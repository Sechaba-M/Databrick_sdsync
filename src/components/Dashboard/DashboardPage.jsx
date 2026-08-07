import React, { useEffect, useState } from "react";
import {
  fetchDashboardSummary,
  fetchRiskAssessments,
} from "../../api/dashboardApi";

import TopSummaryGrid from "./TopSummaryGrid";
import MedicalTestStatsGrid from "./MedicalTestStatsGrid";
import DashboardSectionCard from "./DashboardSectionCard";
import RiskAssessmentTable from "./RiskAssessmentTable";
import EmployeeSurveillanceTable from "./EmployeeSurveillanceTable";
import ExposureAssessmentDetails from "./ExposureAssessmentTable";
import SdsyncTopBar from "../Navbar/NavBar";

export default function DashboardPage({ onLogout, isAdmin }) {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  const [riskRows, setRiskRows] = useState([]);
  const [riskSearch, setRiskSearch] = useState("");
  const [riskLoading, setRiskLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchDashboardSummary();
        setSummary(data || {});
        setRiskRows(data?.riskAssessments || []);
      } catch (err) {
        console.error("[Dashboard API error]", err);
        setSummary({});
        setRiskRows([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setRiskLoading(true);
        const data = await fetchRiskAssessments(riskSearch);
        setRiskRows(Array.isArray(data) ? data : []);
      } catch {
        setRiskRows([]);
      } finally {
        setRiskLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [riskSearch]);

  return (
    <>
      <SdsyncTopBar onLogout={onLogout} isAdmin={isAdmin} />

      <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E3E8F0] to-[#C3CFE2]">
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6">
           {/* kpis */}
        <TopSummaryGrid kpis={summary.kpis || []} />

        {/* MedicalTestStats */}
        <MedicalTestStatsGrid stats={summary.medicalTestStats || []} />

          {/* Risk Assessments */}
          <DashboardSectionCard
            title="Risk Assessments"
            searchPlaceholder="Search business unit, assessor"
            onSearchChange={setRiskSearch}
          >
            <RiskAssessmentTable
              rows={riskLoading ? [] : riskRows}
            />
          </DashboardSectionCard>

          {/* Employee Surveillance */}
          <DashboardSectionCard title="Employee Health Surveillance">
            <EmployeeSurveillanceTable
              rows={summary.employeeSurveillance || []}
            />
          </DashboardSectionCard>

          {/* Exposure Assessments */}
          <DashboardSectionCard title="Exposure Assessment Details">
            <ExposureAssessmentDetails
              rows={summary.exposureAssessments || []}
            />
          </DashboardSectionCard>

        </main>
      </div>
    </>
  );
}
