import React from "react";
import {
  Activity,
  ShieldAlert,
  Stethoscope,
  Users,
  ArrowUpRight,
} from "lucide-react";

function MissingLine({ width = "w-10" }) {
  return <span className={`inline-block ${width} h-2 bg-gray-300 rounded`} />;
}

const DEFAULT_KPIS = [
  { id: "risk", title: "Risk Assessments" },
  { id: "exposure", title: "Exposure Assessments" },
  { id: "medical", title: "Medical Tests" },
  { id: "employee", title: "Employees" },
];

function getIcon(id) {
  switch (id) {
    case "risk":
      return ShieldAlert;
    case "exposure":
      return Activity;
    case "medical":
      return Stethoscope;
    default:
      return Users;
  }
}

export default function TopSummaryGrid({ kpis = [] }) {
  const items = kpis.length ? kpis : DEFAULT_KPIS;

  return (
    <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = getIcon(item.id);

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {item.title}
                </h3>
              </div>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500">
                <ArrowUpRight className="w-3 h-3" />
                —
              </span>
            </div>

            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900">
                {item.value ?? <MissingLine />}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Total {item.title.toLowerCase()}
              </p>
            </div>

            <div className="flex gap-3 text-[11px] text-gray-500">
              <span>{item.completed ?? <MissingLine width="w-6" />} Completed</span>
              <span>{item.pending ?? <MissingLine width="w-6" />} Pending</span>
              <span>{item.overdue ?? <MissingLine width="w-6" />} Overdue</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
