import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ResetPasswordPage from "../../components/ResetPasswordPage/ResetPassword";

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (token = "valid-token") => {
    const path = token ? `/reset-password/${token}` : "/reset-password/";
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/reset-password/:token?"
            element={<ResetPasswordPage />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  test("submits form successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Password reset successful" }),
    });

    renderWithRouter();

    fireEvent.change(
      screen.getByLabelText(/new password/i),
      { target: { value: "Password123!" } }
    );

    fireEvent.change(
      screen.getByLabelText(/confirm password/i),
      { target: { value: "Password123!" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  test("shows API error on failure", async () => {
    fetch.mockRejectedValueOnce(
      new Error("Reset failed")
    );

    renderWithRouter();

    fireEvent.change(
      screen.getByLabelText(/new password/i),
      { target: { value: "Password123!" } }
    );

    fireEvent.change(
      screen.getByLabelText(/confirm password/i),
      { target: { value: "Password123!" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    expect(
      await screen.findByText(/reset failed/i)
    ).toBeInTheDocument();
  });

  test("shows error when passwords do not match", async () => {
    renderWithRouter();

    fireEvent.change(
      screen.getByLabelText(/new password/i),
      { target: { value: "Password123!" } }
    );

    fireEvent.change(
      screen.getByLabelText(/confirm password/i),
      { target: { value: "Different123!" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  test("shows error when token is missing", async () => {
    // Pass null to create path without token
    renderWithRouter(null);

    fireEvent.change(
      screen.getByLabelText(/new password/i),
      { target: { value: "Password123!" } }
    );

    fireEvent.change(
      screen.getByLabelText(/confirm password/i),
      { target: { value: "Password123!" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    expect(
      await screen.findByText(/reset link is invalid or has expired/i)
    ).toBeInTheDocument();
  });
});





