import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SdsyncTopBar from "../../components/Navbar/NavBar";

function renderWithRouter(ui, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}

describe("SdsyncTopBar", () => {
  test("renders brand and navigation tabs", () => {
    renderWithRouter(<SdsyncTopBar />);

    expect(screen.getByText("SDSYNC")).toBeInTheDocument();
    expect(screen.getByText("Database")).toBeInTheDocument();
    // Medical Surveillance and Dashboard tabs are currently commented out in the component
    // expect(screen.getByText("Medical Surveillance")).toBeInTheDocument();
    // expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("toggles search input and submits search", () => {
    const onSearchSubmit = jest.fn();

    renderWithRouter(<SdsyncTopBar onSearchSubmit={onSearchSubmit} />);

    // Click desktop search toggle (first one)
    const [desktopToggle] = screen.getAllByLabelText(/toggle search/i);
    fireEvent.click(desktopToggle);

    // Scope to desktop search container to avoid mobile input
    const searchContainer = desktopToggle.closest("div");
    const input = searchContainer.querySelector("input");

    fireEvent.change(input, { target: { value: "Acetone" } });
    fireEvent.keyPress(input, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    expect(onSearchSubmit).toHaveBeenCalledWith("Acetone");
  });

  test("opens user menu and logs out", () => {
    const onLogout = jest.fn();

    renderWithRouter(<SdsyncTopBar onLogout={onLogout} />);

    fireEvent.click(screen.getByLabelText(/user menu/i));
    fireEvent.click(screen.getByText(/logout/i));

    expect(onLogout).toHaveBeenCalled();
  });

  test("shows Add User option for admin only", () => {
    renderWithRouter(<SdsyncTopBar isAdmin />);

    fireEvent.click(screen.getByLabelText(/user menu/i));

    expect(screen.getByText(/add user/i)).toBeInTheDocument();
  });

  test("does not show Add User option for non-admin", () => {
    renderWithRouter(<SdsyncTopBar isAdmin={false} />);

    fireEvent.click(screen.getByLabelText(/user menu/i));

    expect(screen.queryByText(/add user/i)).not.toBeInTheDocument();
  });

  test("highlights active tab based on route", () => {
    // Since only Database tab is currently active, test with database route
    renderWithRouter(<SdsyncTopBar />, {
      route: "/chemicaldashboard",
    });

    const databaseTab = screen.getByText("Database");
    expect(databaseTab).toHaveClass("text-white");
  });
});
