import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddChemicalModal from "../../components/AddNewChemical/AddChemicalModal";
import * as chemicalApi from "../../api/chemicalApi";

jest.mock("../../api/chemicalApi");

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

test("does not render when closed", () => {
  render(<AddChemicalModal isOpen={false} />);
  expect(screen.queryByText(/add new chemical/i)).not.toBeInTheDocument();
});

test("renders modal when open", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ["Manufacturing"],
  });

  render(<AddChemicalModal isOpen={true} />);

  expect(
    await screen.findByText(/add new chemical/i)
  ).toBeInTheDocument();
});

test("loads business units from backend", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ["QA", "Logistics"],
  });

  render(<AddChemicalModal isOpen={true} />);

  expect(await screen.findByText("QA")).toBeInTheDocument();
  expect(screen.getByText("Logistics")).toBeInTheDocument();
});

test("shows error message when business units fail to load", async () => {
  global.fetch.mockRejectedValueOnce(new Error("Network error"));

  render(<AddChemicalModal isOpen={true} />);

  // Should show the error message in the red error box
  expect(
    await screen.findByText(/network error/i)
  ).toBeInTheDocument();
  
  // Submit button should be disabled when no business units available
  const submitButton = screen.getByRole("button", { name: /add chemical/i });
  expect(submitButton).toBeDisabled();
});

test("shows autocomplete suggestions when typing", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ["Manufacturing"],
  });

  chemicalApi.fetchChemicals.mockResolvedValueOnce([
    { id: 1, name: "Acetone", casNumber: "67-64-1" },
  ]);

  render(<AddChemicalModal isOpen={true} />);

  fireEvent.change(
    screen.getByPlaceholderText(/search by name/i),
    { target: { value: "Ac" } }
  );

  expect(await screen.findByText("Acetone")).toBeInTheDocument();
});

test("submits valid payload", async () => {
  const onSubmit = jest.fn();

  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ["Manufacturing"],
  });

  chemicalApi.fetchChemicals.mockResolvedValueOnce([
    { id: 1, name: "Acetone" },
  ]);

  render(
    <AddChemicalModal isOpen={true} onSubmit={onSubmit} />
  );

  fireEvent.change(
    screen.getByPlaceholderText(/search by name/i),
    { target: { value: "Ac" } }
  );

  fireEvent.click(await screen.findByText("Acetone"));
  fireEvent.click(screen.getByText("Manufacturing"));

  fireEvent.click(screen.getByRole("button", { name: /add chemical/i }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      chemicalSearch: "Acetone",
      businessUnits: ["Manufacturing"],
      chemicalId: 1,
      selectedChemical: { id: 1, name: "Acetone" },
    });
  });
});