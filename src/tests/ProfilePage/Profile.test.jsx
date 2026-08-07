import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../../components/ProfilePage/Profile";
import * as profileApi from "../../api/profileApi";

// Mock Navbar 
jest.mock("../../components/Navbar/NavBar.jsx", () => () => (
  <div data-testid="navbar">Navbar</div>
));

// Mock the profile API
jest.mock("../../api/profileApi", () => ({
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
}));

describe("Profile page", () => {
  const mockSession = {
    user: {
      email: "test@example.com",
      username: "John Doe",
      id: "123",
      businessUnit: "Engineering",
      contact: "1234567890",
      role: "admin",
    },
  };

  beforeEach(() => {
    localStorage.setItem("session", JSON.stringify(mockSession));
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderProfile = () =>
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

  test("renders profile information from session", () => {
    renderProfile();

    expect(screen.getByRole("heading", { name: "John Doe" })).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    
    const userIdElements = screen.getAllByText("123");
    expect(userIdElements.length).toBeGreaterThanOrEqual(1);
  });

  test("opens edit profile form when Edit Profile is clicked", () => {
    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    expect(
      screen.getByRole("heading", { name: /edit profile information/i })
    ).toBeInTheDocument();

    expect(screen.getByTestId("edit-profile-form")).toBeInTheDocument();
  });

  test("updates profile successfully", async () => {
    // Mock successful API response
    profileApi.updateProfile.mockResolvedValueOnce({
      success: true,
      user: {
        ...mockSession.user,
        username: "Jane Doe",
      },
    });

    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const usernameInput = screen.getByLabelText(/username/i);

    fireEvent.change(usernameInput, {
      target: { value: "Jane Doe" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /save changes/i })
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Jane Doe" })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /edit profile/i })).toBeInTheDocument();
  });

  test("shows success message after profile update", async () => {
    profileApi.updateProfile.mockResolvedValueOnce({
      success: true,
      user: {
        ...mockSession.user,
        username: "Jane Smith",
      },
    });

    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const usernameInput = screen.getByLabelText(/username/i);
    fireEvent.change(usernameInput, { target: { value: "Jane Smith" } });

    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  test("cancel button closes edit form", () => {
    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));
    expect(screen.getByTestId("edit-profile-form")).toBeInTheDocument();

    const cancelButtons = screen.getAllByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButtons[0]);

    expect(screen.queryByTestId("edit-profile-form")).not.toBeInTheDocument();
  });

  test("password change form validates matching passwords", async () => {
    renderProfile();

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: "oldpass123" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "newpass123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "different123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/do not match/i)).toBeInTheDocument();
    });
  });

  test("password change shows success message", async () => {
    profileApi.changePassword.mockResolvedValueOnce({
      success: true,
    });

    renderProfile();

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: "oldpass123" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "newpass123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "newpass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument();
    });
  });

  test("displays user role badge", () => {
    renderProfile();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("email field is disabled in edit mode", () => {
    renderProfile();

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const emailInput = screen.getByDisplayValue("test@example.com");
    expect(emailInput).toBeDisabled();
  });
});