import { render, screen, fireEvent } from "@testing-library/react";
import RiskAssessmentCard from "../../components/DataSheet/RiskAssessmentCard";

const mockData = {
  exposureRoutes: "Inhalation",
  healthEffects: {
    acute: "Eye irritation",
    chronic: "Dermatitis",
  },
  controlMeasures: ["Ventilation", "PPE"],
  riskRating: "Medium",
};

describe("RiskAssessmentCard", () => {
  test("returns null when data is missing", () => {
    const { container } = render(<RiskAssessmentCard />);
    expect(container.firstChild).toBeNull();
  });

  test("renders risk assessment data", () => {
    render(<RiskAssessmentCard data={mockData} onEdit={jest.fn()} />);

    expect(screen.getByText("Risk Assessment")).toBeInTheDocument();
    expect(screen.getByText("Inhalation")).toBeInTheDocument();
    expect(screen.getByText(/Eye irritation/i)).toBeInTheDocument();
    expect(screen.getByText(/Dermatitis/i)).toBeInTheDocument();
    expect(screen.getByText("Ventilation")).toBeInTheDocument();
    expect(screen.getByText("PPE")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  test("calls onEdit when Edit button is clicked", () => {
    const onEdit = jest.fn();

    render(<RiskAssessmentCard data={mockData} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
