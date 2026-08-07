import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminUserManagement from "../../components/AddUser/AdminUserManagement";

describe("AdminUserManagement", () => {
  const renderWithRouter = (ui) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  it("renders user list tab by default", async () => {
    renderWithRouter(<AdminUserManagement />);

    expect(
      await screen.findByText("Registered Users")
    ).toBeInTheDocument();
  });

  it("switches to register user tab", () => {
    renderWithRouter(<AdminUserManagement />);

    fireEvent.click(screen.getByText("Register New User"));

    expect(
      screen.getByRole("heading", { name: "Register New User" })
    ).toBeInTheDocument();
  });
});

