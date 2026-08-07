import React from "react";
import {
  Droplet,
  Heart,
  ScanLine,
  FlaskRound,
  Ear,
  Eye,
} from "lucide-react";

function getStatIcon(id) {
  switch (id) {
    case "blood":
      return Droplet;
    case "heart":
      return  Heart;
    case "xray":
      return ScanLine;
    case "urine":
      return FlaskRound;
    case "audiometry":
      return Ear;
    case "vision":
    default:
      return Eye;
  }
}

/**
 * MedicalTestStatsGrid
 * Nicely formatted cards for the "Medical Test Statistics" section.
 */
export default function MedicalTestStatsGrid({ stats = [] }) {
 const DEFAULT_STATS = [
  { id: "blood", label: "Blood Tests" },
  { id: "heart", label: "Heart Tests" },
  { id: "xray", label: "X-Ray" },
  ] ;
  function MissingLine({ width = "w-10" }) {
  return <span className={`inline-block ${width} h-2 bg-gray-300 rounded`} />;
}

  function buildCSV() {
    if (!stats.length) return "";

    const headers = ["Test", "Value", "Change"];
    const rows = stats.map(s => [
      s.label,
      s.value,
      s.change
    ]);

    return [headers, ...rows]
      .map(r => r.map(c => `"${c}"`).join(","))
      .join("\n");
  }

  function download(blob, name) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const csv = buildCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    download(blob, "medical_test_stats.csv");
  }

  function exportExcel() {
    const csv = buildCSV();
    const blob = new Blob([csv], {
      type: "application/vnd.ms-excel"
    });
    download(blob, "medical_test_stats.xlsx");
  }

  function exportPDF() {
    const win = window.open("", "_blank");

    const rows = stats.map(s => `
      <tr>
        <td>${s.label}</td>
        <td>${s.value}</td>
        <td>${s.change}</td>
      </tr>
    `).join("");

    win.document.write(`
      <html>
      <head>
        <style>
        table{ width:100%; border-collapse:collapse }
        td,th{ border:1px solid #ccc;padding:6px }
        </style>
      </head>
      <body>
        <h2>Medical Test Statistics</h2>
        <table>
          <tr><th>Test</th><th>Value</th><th>Change</th></tr>
          ${rows}
        </table>
        <script>window.print()</script>
      </body>
      </html>
    `);

    win.document.close();
  }

  return (
    <section className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-800">
          Medical Test Statistics
        </h2>

        <div className="flex gap-2">
          <button onClick={exportCSV} className="text-xs bg-green-500 text-white px-3 py-1 rounded">CSV</button>
          <button onClick={exportExcel} className="text-xs bg-blue-500 text-white px-3 py-1 rounded">Excel</button>
          <button onClick={exportPDF} className="text-xs bg-red-500 text-white px-3 py-1 rounded">PDF</button>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(stats.length ? stats : DEFAULT_STATS).map((s) => {
          const Icon = getStatIcon(s.id);
          return (
            <div
              key={s.id}
              className="rounded-xl border border-gray-200 bg-slate-50/50 p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Completed
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {s.label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                  {s.value ?? <MissingLine width="w-8" />}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tests completed this period
                  </p>
                </div>

                <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                {s.change ?? <MissingLine width="w-6" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}