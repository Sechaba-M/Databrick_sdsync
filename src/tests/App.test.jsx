jest.mock("../pages/LoginPage", () => (props) => (
  <div>
    Login Page
    <button onClick={() =>
      props.onLogin({
        token: "t",
        user: { role: "admin" }
      })
    }>
      Mock Login
    </button>
  </div>
));

jest.mock("../pages/AdminHomePage", () => () => <div>Admin Home</div>);
jest.mock("../pages/UserHome", () => () => <div>User Home</div>);
jest.mock("../pages/DatasheetPage", () => () => <div>Datasheet</div>);
jest.mock("../pages/AddUserPage", () => () => <div>Add User</div>);
jest.mock("../pages/ProfilePage", () => () => <div>Profile</div>);
jest.mock("../pages/DashboardInfoPage", () => () => <div>Dashboard</div>);
jest.mock("../pages/MedicalDataPage", () => () => <div>Medical Data</div>);
jest.mock("../pages/ResetPasswordPage", () => () => <div>Reset</div>);

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

describe("App routing", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders login page when not authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("redirects admin to chemical dashboard after login", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Mock Login"));

    expect(screen.getByText("Admin Home")).toBeInTheDocument();
  });

  test("redirects unauthenticated user from protected route", () => {
    render(
      <MemoryRouter initialEntries={["/chemicaldashboard"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  test("redirects non-admin user from admin-only route", () => {
    localStorage.setItem(
      "session",
      JSON.stringify({
        token: "t",
        user: { role: "user" },
      })
    );

    render(
      <MemoryRouter initialEntries={["/adduser"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText("User Home")).toBeInTheDocument();
  });
});
