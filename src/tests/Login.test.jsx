import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/LoginPage/Login";

// Mock the authApi module
jest.mock("../api/authApi", () => ({
  login: jest.fn(),
}));

describe("Login", () => {
  let mockLogin;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    
    // Get the mocked login function
    mockLogin = require("../api/authApi").login;
  });

  test("renders login form", () => {
    render(<Login />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
  });

  test("logs in with admin credentials via API", async () => {
    const onLogin = jest.fn();

    // Mock successful API response for admin
    mockLogin.mockResolvedValueOnce({
      token: "admin-token-123",
      user: {
        id: "1",
        email: "admin@sdsync.com",
        role: "admin",
        name: "Admin User",
      },
    });

    render(<Login onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin@sdsync.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "admin@sdsync.com",
        password: "admin123",
      });
      expect(onLogin).toHaveBeenCalled();
    });

    const session = JSON.parse(localStorage.getItem("session"));

    expect(session.user.role).toBe("admin");
    expect(session.token).toBe("admin-token-123");
  });

  test("logs in with user credentials via API", async () => {
    const onLogin = jest.fn();

    // Mock successful API response for regular user
    mockLogin.mockResolvedValueOnce({
      token: "user-token-456",
      user: {
        id: "2",
        email: "user@sdsync.com",
        role: "user",
        name: "Regular User",
      },
    });

    render(<Login onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "user@sdsync.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "user123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@sdsync.com",
        password: "user123",
      });
      expect(onLogin).toHaveBeenCalled();
    });

    const session = JSON.parse(localStorage.getItem("session"));
    expect(session.user.role).toBe("user");
    expect(session.token).toBe("user-token-456");
  });

  test("shows error when login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: "wrong@sdsync.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    expect(
      await screen.findByText(/invalid credentials/i)
    ).toBeInTheDocument();

    expect(mockLogin).toHaveBeenCalledWith({
      email: "wrong@sdsync.com",
      password: "wrongpass",
    });
  });

  test("opens forgot password modal", () => {
    render(<Login />);

    fireEvent.click(screen.getByText(/forgot password/i));

    // The modal h2 text is "Reset Your Password"
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
  });

  test("closes forgot password modal when cancel is clicked", () => {
    render(<Login />);

    // Open modal
    fireEvent.click(screen.getByText(/forgot password/i));
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // Modal should be closed
    expect(screen.queryByText(/reset your password/i)).not.toBeInTheDocument();
  });

  test("login button shows loading state during submission", async () => {
    const onLogin = jest.fn();

    // Mock API to resolve after a delay
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                token: "test-token",
                user: {
                  id: "1",
                  email: "admin@sdsync.com",
                  role: "admin",
                  name: "Admin User",
                },
              }),
            100
          )
        )
    );

    render(<Login onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin@sdsync.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "admin123" },
    });

    const loginButton = screen.getByRole("button", { name: /^login$/i });

    // Click the button
    fireEvent.click(loginButton);

    // Button should show "Logging in..." while loading
    await waitFor(() => {
      expect(screen.getByText("Logging in...")).toBeInTheDocument();
    });

    // Wait for login to complete
    await waitFor(() => {
      expect(onLogin).toHaveBeenCalled();
    });

    // Verify session was created
    const session = JSON.parse(localStorage.getItem("session"));
    expect(session).toBeTruthy();
    expect(session.user.role).toBe("admin");
  });

  test("disables login button during submission", async () => {
    const onLogin = jest.fn();

    // Mock API with delay
    mockLogin.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                token: "test-token",
                user: { id: "1", email: "test@test.com", role: "user" },
              }),
            100
          )
        )
    );

    render(<Login onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    const loginButton = screen.getByRole("button", { name: /^login$/i });

    // Click the button
    fireEvent.click(loginButton);

    // Button should be disabled during loading
    await waitFor(() => {
      expect(loginButton).toBeDisabled();
    });

    // Wait for completion
    await waitFor(() => {
      expect(onLogin).toHaveBeenCalled();
    });
  });
});