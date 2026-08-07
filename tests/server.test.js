import test from "node:test";
import assert from "node:assert/strict";
import { createDatabase } from "../server/database.js";

test("rule engine escalates carcinogenic flammable inventory", () => {
  const db = createDatabase({ chemicals: [], users: [] });
  const result = db.evaluateRisk({ quantity: 30, hazards: ["Carcinogen", "Flammable"] });
  assert.equal(result.riskLevel, "Critical");
  assert.ok(result.requiredControls.includes("Medical surveillance"));
});

test("chemical ingestion stores records and dashboard KPIs", () => {
  const db = createDatabase({ chemicals: [], users: [] });
  db.upsertChemical({ name: "Xylene", casNumber: "1330-20-7", quantity: 10, hazards: ["Flammable"], businessUnits: ["Paint"] });
  assert.equal(db.listChemicals({ search: "xyl" }).length, 1);
  assert.equal(db.dashboardSummary().kpis[0].value, 1);
});
