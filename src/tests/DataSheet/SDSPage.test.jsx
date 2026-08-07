import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SDSPage from "../../components/DataSheet/SDSPage";
import { fetchSdsById } from "../../api/sdsApi";

// Mock API
jest.mock("../../api/sdsApi", () => ({
  fetchSdsById: jest.fn(),
}));

// Mock router params
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ chemicalId: "acetone" }),
}));

// Mock navbar to avoid unrelated failures
jest.mock("../../components/Navbar/NavBar.jsx", () => () => (
  <div data-testid="navbar" />
));

describe("SDSPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    // Keep the promise pending to show loading state
    fetchSdsById.mockImplementation(() => new Promise(() => {}));

    render(<SDSPage />);

    expect(
      screen.getByText(/Loading Chemical Information/i)
    ).toBeInTheDocument();
  });

  it("renders SDS data when API call succeeds", async () => {
    fetchSdsById.mockResolvedValueOnce({
      title: "Test SDS",
      identification: {
        productName: "Test",
        casNumber: "123",
        synonyms: "ABC",
      },
      healthSafety: {
        hazardStatement: "Hazard",
        precautionaryStatements: [],
        firstAid: {},
      },
      legislative: {
        regulations: [],
        osha: "",
        dot: "",
        epa: "",
      },
      riskAssessmentPrimary: {
        exposureRoutes: "Inhalation",
        healthEffects: { acute: "", chronic: "" },
        controlMeasures: [],
        riskRating: "Low",
      },
      chemicalProperties: { physicalState: "Liquid" },
      businessUnits: [],
      monitoringAssessment: {
        monitoringType: "",
        frequency: "",
        locations: "",
        exposureLimits: [],
        medicalSurveillance: {},
      },
    });

    render(<SDSPage />);

    await waitFor(() =>
      expect(screen.getByText("Test SDS")).toBeInTheDocument()
    );
  });

  it("shows error message when API fails", async () => {
    fetchSdsById.mockRejectedValueOnce(new Error("API down"));

    render(<SDSPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/Could not load Chemical Information/i)
      ).toBeInTheDocument()
    );
  });

  it("opens risk assessment edit modal when Edit is clicked", async () => {
    fetchSdsById.mockResolvedValueOnce({
      title: "Test SDS",
      identification: {
        productName: "Test",
        casNumber: "123",
        synonyms: "ABC",
      },
      healthSafety: {
        hazardStatement: "Hazard",
        precautionaryStatements: [],
        firstAid: {},
      },
      legislative: {
        regulations: [],
        osha: "",
        dot: "",
        epa: "",
      },
      riskAssessmentPrimary: {
        exposureRoutes: "Inhalation",
        healthEffects: { acute: "Test acute", chronic: "Test chronic" },
        controlMeasures: ["Control 1"],
        riskRating: "Low",
      },
      chemicalProperties: { physicalState: "Liquid" },
      businessUnits: [],
      monitoringAssessment: {
        monitoringType: "",
        frequency: "",
        locations: "",
        exposureLimits: [],
        medicalSurveillance: {},
      },
    });

    render(<SDSPage />);

    // Wait for SDS to load
    await waitFor(() => expect(screen.getByText("Test SDS")).toBeInTheDocument());

    // Find and click the Edit button (from RiskAssessmentCard)
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(
      screen.getByText("Edit Risk Assessment")
    ).toBeInTheDocument();
  });

  it("saves risk assessment changes", async () => {
    global.fetch = jest.fn();

    fetchSdsById.mockResolvedValueOnce({
      title: "Test SDS",
      identification: {
        productName: "Test",
        casNumber: "123",
        synonyms: "ABC",
      },
      healthSafety: {
        hazardStatement: "Hazard",
        precautionaryStatements: [],
        firstAid: {},
      },
      legislative: {
        regulations: [],
        osha: "",
        dot: "",
        epa: "",
      },
      riskAssessmentPrimary: {
        exposureRoutes: "Inhalation",
        healthEffects: { acute: "Test acute", chronic: "Test chronic" },
        controlMeasures: ["Control 1"],
        riskRating: "Low",
      },
      chemicalProperties: { physicalState: "Liquid" },
      businessUnits: [],
      monitoringAssessment: {
        monitoringType: "",
        frequency: "",
        locations: "",
        exposureLimits: [],
        medicalSurveillance: {},
      },
    });

    render(<SDSPage />);

    await waitFor(() => expect(screen.getByText("Test SDS")).toBeInTheDocument());

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    // Mock the API response for updating
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        exposureRoutes: "Inhalation, Skin",
        healthEffects: { acute: "Updated acute", chronic: "Updated chronic" },
        controlMeasures: ["New control"],
        riskRating: "Medium",
      }),
    });

    // Change exposure routes field
    const exposureInput = screen.getByPlaceholderText(/inhalation/i);
    fireEvent.change(exposureInput, { target: { value: "Inhalation, Skin" } });

    // Click save
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/sds/acetone/risk-assessment"),
        expect.objectContaining({
          method: "PUT",
        })
      );
    });
  });
});