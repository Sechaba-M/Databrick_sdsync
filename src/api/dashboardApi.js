import { apiUrl } from "./apiBase";

/**
 * Fetch dashboard summary
 * 
 */
export async function fetchDashboardSummary() {
  const res = await fetch(apiUrl("/api/dashboard/summary"));

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  const data = await res.json();

  // normalize response shape
 return {
  kpis: data.kpis ?? [],
  medicalTestStats: data.medicalTestStats ?? [],
  riskAssessments: data.riskAssessments ?? [],
  employeeSurveillance: data.employeeSurveillance ?? [],
  exposureAssessments: data.exposureAssessments ?? [],
};

}

/**
 * Fetch risk assessments with optional backend search
 * @param {string} search
 */
export async function fetchRiskAssessments(search = "") {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  const res = await fetch(apiUrl(`/api/risk-assessments${query}`));

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to load risk assessments");
  }

  // Expecting an array
  return res.json();
}
export async function fetchEmployeeSurveillance({ page = 1, limit = 5, search = "" }) {
  const params = new URLSearchParams({
    page,
    limit,
    search,
  });

  const res = await fetch(apiUrl(`/api/employee-surveillance?${params}`));
  if (!res.ok) throw new Error("Failed to load employee surveillance");
  return res.json(); // { data, total }
}

export async function fetchExposureAssessments({ page = 1, limit = 5, search = "" }) {
  const params = new URLSearchParams({
    page,
    limit,
    search,
  });

  const res = await fetch(apiUrl(`/api/exposure-assessments?${params}`));
  if (!res.ok) throw new Error("Failed to load exposure assessments");
  return res.json(); // { data, total }
}
