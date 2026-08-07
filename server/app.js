import http from "node:http";
import { parse } from "node:url";
import { db } from "./database.js";

const send = (res, status, body, headers = {}) => {
  const data = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, { "Content-Type": typeof body === "string" ? "text/plain" : "application/json", "Access-Control-Allow-Origin": "*", ...headers });
  res.end(data);
};

const readJson = (req) => new Promise((resolve, reject) => {
  let raw = "";
  req.on("data", (chunk) => { raw += chunk; });
  req.on("end", () => {
    if (!raw) return resolve({});
    try { resolve(JSON.parse(raw)); } catch (error) { reject(error); }
  });
});

function csv(rows) {
  if (!rows.length) return "";
  const keys = ["id", "name", "casNumber", "riskLevel", "supplier", "quantity", "unit", "location"];
  return [keys.join(","), ...rows.map((row) => keys.map((key) => JSON.stringify(row[key] ?? "")).join(","))].join("\n");
}

export function createServer() {
  return http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") return send(res, 204, "");
    const { pathname, query } = parse(req.url, true);
    try {
      if (pathname === "/api/health") return send(res, 200, { ok: true, service: "sdsync" });
      if (pathname === "/api/dashboard/summary") return send(res, 200, db.dashboardSummary());
      if (pathname === "/api/rules/evaluate" && req.method === "POST") return send(res, 200, db.evaluateRisk(await readJson(req)));
      if (pathname === "/api/chemicals" && req.method === "GET") return send(res, 200, { data: db.listChemicals(query) });
      if (pathname === "/api/chemicals" && req.method === "POST") return send(res, 201, { data: db.upsertChemical(await readJson(req), "api") });
      if (pathname === "/api/chemicals/export") return send(res, 200, csv(db.listChemicals(query)), { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=chemicals.csv" });
      const chemicalMatch = pathname.match(/^\/api\/chemicals\/([^/]+)$/);
      if (chemicalMatch && req.method === "PUT") return send(res, 200, { data: db.upsertChemical({ ...(await readJson(req)), id: decodeURIComponent(chemicalMatch[1]) }, "api") });
      if (chemicalMatch && req.method === "DELETE") return send(res, db.deleteChemical(decodeURIComponent(chemicalMatch[1]), "api") ? 204 : 404, "");
      if (pathname === "/api/surveillance/chemicals") return send(res, 200, db.listChemicals(query).map((c) => ({ chemical: c.name, cas: c.casNumber, risk: c.riskLevel, oels: c.oels, tests: c.biologicalMonitoring, frequencyMonths: c.examFrequencyMonths })));
      if (pathname === "/api/surveillance/business-units") return send(res, 200, Object.values(db.state.chemicals.reduce((acc, c) => { (c.businessUnits ?? []).forEach((unit) => { acc[unit] ??= { businessUnit: unit, chemicals: 0, critical: 0 }; acc[unit].chemicals += 1; if (c.riskLevel === "Critical") acc[unit].critical += 1; }); return acc; }, {})));
      if (pathname === "/api/workflows" && req.method === "GET") return send(res, 200, { data: db.state.workflows });
      if (pathname === "/api/workflows" && req.method === "POST") { const body = await readJson(req); return send(res, 201, { data: db.createWorkflow(body.type, body.subjectId, body.assignee, body.steps ?? []) }); }
      if (pathname === "/api/ingestions/chemicals" && req.method === "POST") {
        const body = await readJson(req); const rows = Array.isArray(body) ? body : body.rows ?? [];
        const imported = rows.map((row) => db.upsertChemical(row, "ingestion"));
        return send(res, 201, { data: { rowsReceived: rows.length, rowsImported: imported.length, imported } });
      }
      if (pathname === "/api/auth/me") return send(res, 200, { user: db.state.users[0] });
      if (pathname === "/api/auth/users") return send(res, 200, { data: db.state.users });
      return send(res, 404, { error: "Not found" });
    } catch (error) {
      return send(res, 400, { error: error.message });
    }
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => console.log(`SDSync API listening on ${port}`));
}
