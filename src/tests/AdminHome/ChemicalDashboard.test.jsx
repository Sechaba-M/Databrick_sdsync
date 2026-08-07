import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChemicalDashboardPage from "../../components/AdminHome/AdminChemicalDashboardPage";

jest.mock("../../api/chemicalApi", () => ({
  fetchChemicals: jest.fn().mockResolvedValue([]),
}));

describe("AdminChemicalDashboardPage", () => {
  test("renders loading state and table", async () => {
    render(
      <MemoryRouter>
        <ChemicalDashboardPage isAdmin onLogout={jest.fn()} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading chemicals/i)
    ).toBeInTheDocument();
  });
});
