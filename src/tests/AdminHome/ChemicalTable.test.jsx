import { render, screen } from "@testing-library/react";
import ChemicalTable from "../../components/AdminHome/ChemicalTable";

const chemicals = [
  { id: 1, name: "Acetone", casNumber: "67-64-1" },
  { id: 2, name: "Benzene", casNumber: "71-43-2" },
];

describe("ChemicalTable", () => {
  test("renders table headers", () => {
    render(<ChemicalTable chemicals={[]} />);

    expect(screen.getByText("Chemical Name")).toBeInTheDocument();
    expect(screen.getByText("CAS Number")).toBeInTheDocument();
    expect(screen.getByText("Risk Level")).toBeInTheDocument();
  });

  test("renders chemical rows", () => {
    render(<ChemicalTable chemicals={chemicals} />);

    expect(screen.getByText("Acetone")).toBeInTheDocument();
    expect(screen.getByText("Benzene")).toBeInTheDocument();
  });

  test("shows correct caption text", () => {
    render(<ChemicalTable chemicals={chemicals} />);

    expect(
      screen.getByText("Showing 2 chemicals")
    ).toBeInTheDocument();
  });
});
