import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SDSection from "./SDSection";
import RiskAssessmentCard from "./RiskAssessmentCard";
import BusinessUnitTable from "./BusinessUnitTable";
import { fetchSdsById } from "../../api/sdsApi.js";
import SdsyncTopBar from "../Navbar/NavBar.jsx";

/**
 * Small helper to update risk assessment via backend.
 */
async function updateRiskAssessmentApi(chemicalId, riskData) {
  const res = await fetch(
    `/api/sds/${encodeURIComponent(chemicalId)}/risk-assessment`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(riskData),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update risk assessment");
  }

  return res.json();
}

/**
 * Modal for editing risk assessment.
 */
function RiskAssessmentEditModal({ isOpen, initialData, loading, onClose, onSave }) {
  const [exposureRoutes, setExposureRoutes] = useState("");
  const [acute, setAcute] = useState("");
  const [chronic, setChronic] = useState("");
  const [controlMeasuresText, setControlMeasuresText] = useState("");
  const [riskRating, setRiskRating] = useState("");

  useEffect(() => {
    if (isOpen && initialData) {
      setExposureRoutes(initialData.exposureRoutes || "");
      setAcute(initialData.healthEffects?.acute || "");
      setChronic(initialData.healthEffects?.chronic || "");
      setControlMeasuresText(
        Array.isArray(initialData.controlMeasures)
          ? initialData.controlMeasures.join("\n")
          : ""
      );
      setRiskRating(initialData.riskRating || "");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    const controlMeasures = controlMeasuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const formData = {
      exposureRoutes,
      healthEffects: { acute, chronic },
      controlMeasures,
      riskRating,
    };

    onSave(formData);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Edit Risk Assessment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Exposure Routes
            </label>
            <input
              type="text"
              value={exposureRoutes}
              onChange={(e) => setExposureRoutes(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Inhalation, Skin contact, Eye contact"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Health Effects – Acute
              </label>
              <textarea
                value={acute}
                onChange={(e) => setAcute(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Health Effects – Chronic
              </label>
              <textarea
                value={chronic}
                onChange={(e) => setChronic(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Control Measures (one per line)
            </label>
            <textarea
              value={controlMeasuresText}
              onChange={(e) => setControlMeasuresText(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Risk Rating
            </label>
            <input
              type="text"
              value={riskRating}
              onChange={(e) => setRiskRating(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Medium – Manageable with proper controls"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-md border border-gray-300 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-orange-600 text-white text-xs sm:text-sm font-semibold hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * SDSPage
 *
 * - Loads SDS data from API (fetchSdsById)
 * - Supports editing the primary risk assessment with backend sync
 */
export default function SDSPage({ chemicalId: propChemicalId, onLogout, isAdmin }) {
  const { chemicalId: routeChemicalId } = useParams();

  // Prefer prop → then route param
  const effectiveChemicalId = propChemicalId || routeChemicalId;

  const [sds, setSds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEditingRisk, setIsEditingRisk] = useState(false);
  const [savingRisk, setSavingRisk] = useState(false);
  const [riskError, setRiskError] = useState(null);

  useEffect(() => {
    async function loadSds() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSdsById(effectiveChemicalId);
        setSds(data);
      } catch (err) {
        console.error("[SDS API error]", err);
        setError(
          "Could not load Chemical Information."
        );
        setSds(null);
      } finally {
        setLoading(false);
      }
    }

    loadSds();
  }, [effectiveChemicalId]);

  function handleEditRiskAssessment() {
    setRiskError(null);
    setIsEditingRisk(true);
  }

  async function handleSaveRiskAssessment(formData) {
    if (!sds) return;

    const payload = {
      exposureRoutes: formData.exposureRoutes,
      healthEffects: {
        acute: formData.healthEffects.acute,
        chronic: formData.healthEffects.chronic,
      },
      controlMeasures: formData.controlMeasures,
      riskRating: formData.riskRating,
    };

    try {
      setSavingRisk(true);
      setRiskError(null);

      const apiRes = await updateRiskAssessmentApi(
        effectiveChemicalId,
        payload
      );

      // Allow backend to return a wrapped object or just the risk block
      const updatedRisk =
        apiRes.riskAssessmentPrimary && apiRes.riskAssessmentPrimary.exposureRoutes
          ? apiRes.riskAssessmentPrimary
          : apiRes;

      setSds((prev) =>
        prev
          ? {
              ...prev,
              riskAssessmentPrimary: updatedRisk,
            }
          : prev
      );
      setIsEditingRisk(false);
    } catch (err) {
      console.error("[update risk assessment error]", err);
      setRiskError(
        err.message ||
          "Failed to update risk assessment."
      );
    } finally {
      setSavingRisk(false);
    }
  }

  if (loading && !sds) {
    return (
      <>
        <SdsyncTopBar onLogout={onLogout} isAdmin={isAdmin} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200">
          <p className="text-gray-600 text-sm">Loading Chemical Information…</p>
        </div>
      </>
    );
  }

  if (error || !sds) {
    return (
      <>
        <SdsyncTopBar onLogout={onLogout} isAdmin={isAdmin} />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200">
          <div className="text-center">
            <p className="text-red-600 text-sm mb-2">
              {error || "Unable to load Chemical Information."}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SdsyncTopBar onLogout={onLogout} isAdmin={isAdmin} />
      <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#C3CFE2] px-3 py-6 flex justify-center">
        <div className="w-full bg-white p-2 rounded-lg max-w-4xl">
          {riskError && (
            <div className="mb-3 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              {riskError}
            </div>
          )}

          {/* Top title bar */}
          <div className="bg-[#003E77] text-white rounded-lg rounded-b-none p-5 shadow">
            <h1 className="text-xl font-semibold">{sds.title}</h1>
          </div>

          {/* Identification */}
          {sds.identification && (
            <SDSection title="Identification" bg="bg-blue-50">
              {sds.identification.productName && (
                <p>
                  <strong>Product Name:</strong> {sds.identification.productName}
                </p>
              )}
              {sds.identification.casNumber && (
                <p>
                  <strong>CAS Number:</strong> {sds.identification.casNumber}
                </p>
              )}
              {sds.identification.synonyms && (
                <p>
                  <strong>Synonyms:</strong> {sds.identification.synonyms}
                </p>
              )}
            </SDSection>
          )}

          {/* Health & Safety Data */}
          {sds.healthSafety && (
            <SDSection title="Health and Safety Data" bg="bg-red-50">
              {sds.healthSafety.hazardStatement && (
                <>
                  <p className="font-semibold text-red-700 mb-1">Hazard Statement:</p>
                  <p className="mb-3">{sds.healthSafety.hazardStatement}</p>
                </>
              )}

              {sds.healthSafety.precautionaryStatements && 
               sds.healthSafety.precautionaryStatements.length > 0 && (
                <>
                  <p className="font-semibold text-red-700 mb-1">
                    Precautionary Statements:
                  </p>
                  <ul className="list-disc list-inside mb-4">
                    {sds.healthSafety.precautionaryStatements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {sds.healthSafety.firstAid && (
                <>
                  <p className="font-semibold text-red-700 mb-1">
                    First Aid Measures:
                  </p>
                  {sds.healthSafety.firstAid.inhalation && (
                    <p>
                      <strong>Inhalation:</strong>{" "}
                      {sds.healthSafety.firstAid.inhalation}
                    </p>
                  )}
                  {sds.healthSafety.firstAid.skinContact && (
                    <p>
                      <strong>Skin Contact:</strong>{" "}
                      {sds.healthSafety.firstAid.skinContact}
                    </p>
                  )}
                  {sds.healthSafety.firstAid.eyeContact && (
                    <p>
                      <strong>Eye Contact:</strong>{" "}
                      {sds.healthSafety.firstAid.eyeContact}
                    </p>
                  )}
                  {sds.healthSafety.firstAid.ingestion && (
                    <p>
                      <strong>Ingestion:</strong> {sds.healthSafety.firstAid.ingestion}
                    </p>
                  )}
                </>
              )}
            </SDSection>
          )}

          {/* Legislative Requirements */}
          {sds.legislative && (
            <SDSection title="Legislative Requirements" bg="bg-purple-50">
              {sds.legislative.regulations && 
               sds.legislative.regulations.length > 0 && (
                <>
                  <p className="font-semibold text-purple-700 mb-1">
                    Applicable Regulations:
                  </p>
                  <ul className="list-disc list-inside mb-4">
                    {sds.legislative.regulations.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
              {sds.legislative.osha && (
                <p>
                  <strong>OSHA:</strong> {sds.legislative.osha}
                </p>
              )}
              {sds.legislative.dot && (
                <p>
                  <strong>DOT:</strong> {sds.legislative.dot}
                </p>
              )}
              {sds.legislative.epa && (
                <p>
                  <strong>EPA:</strong> {sds.legislative.epa}
                </p>
              )}
            </SDSection>
          )}

          {/* Primary Risk Assessment card */}
          {sds.riskAssessmentPrimary && (
            <RiskAssessmentCard
              data={sds.riskAssessmentPrimary}
              onEdit={handleEditRiskAssessment}
            />
          )}

          {/* Chemical Properties */}
          {sds.chemicalProperties && sds.chemicalProperties.physicalState && (
            <SDSection title="Chemical Properties" bg="bg-green-50">
              <p>
                <strong>Physical State:</strong>{" "}
                {sds.chemicalProperties.physicalState}
              </p>
            </SDSection>
          )}

          {/* Business Units */}
          {sds.businessUnits && sds.businessUnits.length > 0 && (
            <BusinessUnitTable units={sds.businessUnits} />
          )}

          {/* Environmental monitoring / exposure block */}
          {sds.monitoringAssessment && (
            <SDSection title="Environmental Monitoring & Risk Assessment" bg="bg-blue-50">
              {(sds.monitoringAssessment.monitoringType || 
                sds.monitoringAssessment.frequency || 
                sds.monitoringAssessment.locations) && (
                <>
                  <p className="font-semibold text-gray-700 mb-2">
                    Environmental Monitoring:
                  </p>
                  {sds.monitoringAssessment.monitoringType && (
                    <p>
                      <strong>Type:</strong> {sds.monitoringAssessment.monitoringType}
                    </p>
                  )}
                  {sds.monitoringAssessment.frequency && (
                    <p>
                      <strong>Frequency:</strong>{" "}
                      {sds.monitoringAssessment.frequency}
                    </p>
                  )}
                  {sds.monitoringAssessment.locations && (
                    <p>
                      <strong>Locations:</strong>{" "}
                      {sds.monitoringAssessment.locations}
                    </p>
                  )}
                </>
              )}

              {sds.monitoringAssessment.exposureLimits && 
               sds.monitoringAssessment.exposureLimits.length > 0 && (
                <>
                  <p className="font-semibold text-gray-700 mt-4 mb-1">
                    Exposure Limits:
                  </p>
                  {sds.monitoringAssessment.exposureLimits.map((limit, idx) => (
                    <p key={idx}>{limit}</p>
                  ))}
                </>
              )}

              {sds.monitoringAssessment.medicalSurveillance && (
                <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-indigo-700 mb-1">
                    Medical Surveillance Program:
                  </p>
                  {sds.monitoringAssessment.medicalSurveillance.required && (
                    <p>
                      <strong>Required:</strong>{" "}
                      {sds.monitoringAssessment.medicalSurveillance.required}
                    </p>
                  )}
                  {sds.monitoringAssessment.medicalSurveillance.tests && (
                    <p>
                      <strong>Tests:</strong>{" "}
                      {sds.monitoringAssessment.medicalSurveillance.tests}
                    </p>
                  )}
                  {sds.monitoringAssessment.medicalSurveillance.frequency && (
                    <p>
                      <strong>Frequency:</strong>{" "}
                      {sds.monitoringAssessment.medicalSurveillance.frequency}
                    </p>
                  )}
                  {sds.monitoringAssessment.medicalSurveillance.eligibility && (
                    <p>
                      <strong>Eligibility:</strong>{" "}
                      {sds.monitoringAssessment.medicalSurveillance.eligibility}
                    </p>
                  )}
                </div>
              )}
            </SDSection>
          )}
        </div>
      </div>

      {/* Risk Assessment Edit Modal */}
      <RiskAssessmentEditModal
        isOpen={isEditingRisk}
        initialData={sds?.riskAssessmentPrimary}
        loading={savingRisk}
        onClose={() => setIsEditingRisk(false)}
        onSave={handleSaveRiskAssessment}
      />
    </>
  );
}