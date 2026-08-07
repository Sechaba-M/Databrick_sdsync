import { randomUUID } from "node:crypto";

const now = () => new Date().toISOString();

const seedChemicals = [
  {
    id: "chem-benzene",
    name: "Benzene",
    casNumber: "71-43-2",
    molecularFormula: "C6H6",
    molecularMass: 78.11,
    supplier: "Acme Solvents",
    businessUnits: ["Laboratory", "Maintenance"],
    quantity: 24,
    unit: "L",
    location: "Flammable Cabinet A",
    hazards: ["Carcinogen", "Flammable", "Toxic"],
    riskLevel: "Critical",
    exposureRoutes: ["Inhalation", "Skin"],
    sdsUrl: "https://example.com/sds/benzene.pdf",
    oels: { twa: "0.5 ppm", stel: "2.5 ppm", ceiling: null, skin: true },
    biologicalMonitoring: ["Urinary S-phenylmercapturic acid"],
    examFrequencyMonths: 12,
    reviewStatus: "Approved",
  },
  {
    id: "chem-acetone",
    name: "Acetone",
    casNumber: "67-64-1",
    molecularFormula: "C3H6O",
    molecularMass: 58.08,
    supplier: "Fisher Scientific",
    businessUnits: ["Production"],
    quantity: 80,
    unit: "L",
    location: "Bulk Store 2",
    hazards: ["Highly flammable", "Eye irritation"],
    riskLevel: "Medium",
    exposureRoutes: ["Inhalation"],
    sdsUrl: "https://example.com/sds/acetone.pdf",
    oels: { twa: "250 ppm", stel: "500 ppm", ceiling: null, skin: false },
    biologicalMonitoring: [],
    examFrequencyMonths: 24,
    reviewStatus: "Approved",
  },
];

const seedUsers = [
  { id: "user-admin", name: "Safety Admin", email: "admin@sdsync.local", role: "admin", businessUnit: "EHS", status: "Active" },
  { id: "user-nurse", name: "Occupational Nurse", email: "nurse@sdsync.local", role: "clinician", businessUnit: "Medical", status: "Active" },
];

export function createDatabase(seed = {}) {
  const state = {
    chemicals: seed.chemicals ?? seedChemicals,
    users: seed.users ?? seedUsers,
    workflows: seed.workflows ?? [],
    ingestionJobs: seed.ingestionJobs ?? [],
    auditEvents: seed.auditEvents ?? [],
  };

  const audit = (actor, action, entityType, entityId, details = {}) => {
    state.auditEvents.unshift({ id: randomUUID(), actor, action, entityType, entityId, details, createdAt: now() });
  };

  return {
    state,
    listChemicals(filters = {}) {
      const q = String(filters.search ?? "").toLowerCase();
      return state.chemicals.filter((chemical) => {
        const matchesSearch = !q || [chemical.name, chemical.casNumber, chemical.supplier, chemical.location].some((value) => String(value ?? "").toLowerCase().includes(q));
        const matchesRisk = !filters.riskLevel || filters.riskLevel === "all" || chemical.riskLevel === filters.riskLevel;
        const matchesUnit = !filters.businessUnit || filters.businessUnit === "all" || chemical.businessUnits?.includes(filters.businessUnit);
        return matchesSearch && matchesRisk && matchesUnit;
      });
    },
    upsertChemical(payload, actor = "system") {
      const id = payload.id || randomUUID();
      const existing = state.chemicals.findIndex((chemical) => chemical.id === id);
      const riskLevel = payload.riskLevel || this.evaluateRisk(payload).riskLevel;
      const record = { ...payload, id, riskLevel, updatedAt: now(), createdAt: payload.createdAt || now() };
      if (existing >= 0) state.chemicals[existing] = { ...state.chemicals[existing], ...record };
      else state.chemicals.unshift(record);
      audit(actor, existing >= 0 ? "chemical.updated" : "chemical.created", "chemical", id, { name: record.name, riskLevel });
      return record;
    },
    deleteChemical(id, actor = "system") {
      const before = state.chemicals.length;
      state.chemicals = state.chemicals.filter((chemical) => chemical.id !== id);
      if (state.chemicals.length !== before) audit(actor, "chemical.deleted", "chemical", id);
      return state.chemicals.length !== before;
    },
    evaluateRisk(payload) {
      const hazards = (payload.hazards ?? []).map((hazard) => String(hazard).toLowerCase());
      const qty = Number(payload.quantity ?? 0);
      let score = qty >= 100 ? 3 : qty >= 25 ? 2 : 1;
      if (hazards.some((h) => /carcinogen|fatal|explosive|mutagen|reproductive/.test(h))) score += 4;
      if (hazards.some((h) => /flammable|toxic|corrosive/.test(h))) score += 2;
      const riskLevel = score >= 6 ? "Critical" : score >= 4 ? "High" : score >= 2 ? "Medium" : "Low";
      return { score, riskLevel, requiredControls: riskLevel === "Critical" ? ["Medical surveillance", "Industrial hygiene sampling", "Annual SDS review"] : ["SDS review", "PPE verification"] };
    },
    createWorkflow(type, subjectId, assignee, steps) {
      const workflow = { id: randomUUID(), type, subjectId, assignee, status: "Open", steps, createdAt: now(), updatedAt: now() };
      state.workflows.unshift(workflow);
      audit("system", "workflow.created", "workflow", workflow.id, { type, subjectId });
      return workflow;
    },
    dashboardSummary() {
      const chemicals = state.chemicals;
      return {
        kpis: [
          { label: "Chemicals", value: chemicals.length },
          { label: "Critical risk", value: chemicals.filter((c) => c.riskLevel === "Critical").length },
          { label: "Open workflows", value: state.workflows.filter((w) => w.status === "Open").length },
          { label: "Users", value: state.users.length },
        ],
        riskAssessments: chemicals.map((c) => ({ id: c.id, chemical: c.name, risk: c.riskLevel, controls: this.evaluateRisk(c).requiredControls })),
        medicalTestStats: chemicals.filter((c) => c.examFrequencyMonths).map((c) => ({ chemical: c.name, frequencyMonths: c.examFrequencyMonths, tests: c.biologicalMonitoring ?? [] })),
        employeeSurveillance: state.workflows,
        exposureAssessments: chemicals.map((c) => ({ id: c.id, chemical: c.name, routes: c.exposureRoutes ?? [], oels: c.oels })),
      };
    },
  };
}

export const db = createDatabase();
