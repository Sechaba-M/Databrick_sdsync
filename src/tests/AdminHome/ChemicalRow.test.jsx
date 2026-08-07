import { render, screen, fireEvent } from "@testing-library/react";
import ChemicalRow from "../../components/AdminHome/ChemicalRow";

const mockChemical = {
  id: 1,
  name: "Acetone",
  casNumber: "67-64-1",
  riskLevel: "Medium",
  hazards: ["Flammable", "Irritant"],
  monitoringType: "Air",
  supplier: "ChemSource",
};

describe("ChemicalRow", () => {
  test("renders chemical data", () => {
    render(
      <table>
        <tbody>
          <ChemicalRow chemical={mockChemical} index={0} />
        </tbody>
      </table>
    );

    expect(screen.getByText("Acetone")).toBeInTheDocument();
    expect(screen.getByText("67-64-1")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Flammable | Irritant")).toBeInTheDocument();
    expect(screen.getByText("Air")).toBeInTheDocument();
    expect(screen.getByText("ChemSource")).toBeInTheDocument();
  });

  test("calls onView when name or View button is clicked", () => {
    const onView = jest.fn();

    render(
      <table>
        <tbody>
          <ChemicalRow chemical={mockChemical} index={0} onView={onView} />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Acetone"));
    fireEvent.click(screen.getByText("View"));

    expect(onView).toHaveBeenCalledTimes(2);
    expect(onView).toHaveBeenCalledWith(mockChemical);
  });

  test("calls onEdit when Edit button is clicked", () => {
    const onEdit = jest.fn();

    render(
      <table>
        <tbody>
          <ChemicalRow chemical={mockChemical} index={0} onEdit={onEdit} />
        </tbody>
      </table>
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(mockChemical);
  });
});
