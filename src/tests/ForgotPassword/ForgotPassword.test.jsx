import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordModal from "../../components/ForgotPassword/ForgotPassword";

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

test("does not render when closed", () => {
  render(<ForgotPasswordModal open={false} />);
  expect(
    screen.queryByText(/reset your password/i)
  ).not.toBeInTheDocument();
});

test("renders modal when open", () => {
  render(<ForgotPasswordModal open={true} />);
  expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
});

test("submit button is disabled when form is empty", () => {
  render(<ForgotPasswordModal open={true} />);
  
  const submitButton = screen.getByRole("button", { name: /send reset link/i });
  
  expect(submitButton).toBeDisabled();
});

test("submit button is enabled when identifier is entered", () => {
  render(<ForgotPasswordModal open={true} />);
  
  const input = screen.getByPlaceholderText(/you@example.com/i);
  const submitButton = screen.getByRole("button", { name: /send reset link/i });
  
  expect(submitButton).toBeDisabled();
  
  fireEvent.change(input, { target: { value: "user@sdsync.com" } });
  
  expect(submitButton).not.toBeDisabled();
});

test("submits successfully and shows success message", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
  });

  render(<ForgotPasswordModal open={true} />);

  fireEvent.change(
    screen.getByPlaceholderText(/you@example.com/i),
    { target: { value: "user@sdsync.com" } }
  );

  fireEvent.click(
    screen.getByRole("button", { name: /send reset link/i })
  );

  expect(
    await screen.findByText(/reset link has been sent/i)
  ).toBeInTheDocument();
});

test("shows error message when API fails", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    text: async () => "Server error",
  });

  render(<ForgotPasswordModal open={true} />);

  fireEvent.change(
    screen.getByPlaceholderText(/you@example.com/i),
    { target: { value: "bad@sdsync.com" } }
  );

  fireEvent.click(
    screen.getByRole("button", { name: /send reset link/i })
  );

  expect(
    await screen.findByText(/server error/i)
  ).toBeInTheDocument();
});

test("closes modal when cancel is clicked", () => {
  const onClose = jest.fn();

  render(<ForgotPasswordModal open={true} onClose={onClose} />);

  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

  expect(onClose).toHaveBeenCalled();
});

test("closes modal when clicking backdrop", () => {
  const onClose = jest.fn();

  render(<ForgotPasswordModal open={true} onClose={onClose} />);

  const backdrop = screen.getByRole("button", { name: /send reset link/i }).closest('.fixed');

  fireEvent.click(backdrop);

  expect(onClose).toHaveBeenCalled();
});

test("calls onSuccess callback after successful submission", async () => {
  const onSuccess = jest.fn();
  
  global.fetch.mockResolvedValueOnce({
    ok: true,
  });

  render(<ForgotPasswordModal open={true} onSuccess={onSuccess} />);

  fireEvent.change(
    screen.getByPlaceholderText(/you@example.com/i),
    { target: { value: "user@sdsync.com" } }
  );

  fireEvent.click(
    screen.getByRole("button", { name: /send reset link/i })
  );

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});

test("resets form state when modal is reopened", () => {
  const { rerender } = render(<ForgotPasswordModal open={true} />);

  const input = screen.getByPlaceholderText(/you@example.com/i);
  fireEvent.change(input, { target: { value: "test@example.com" } });

  expect(input.value).toBe("test@example.com");

  // Close modal
  rerender(<ForgotPasswordModal open={false} />);
  
  // Reopen modal
  rerender(<ForgotPasswordModal open={true} />);

  const reopenedInput = screen.getByPlaceholderText(/you@example.com/i);
  expect(reopenedInput.value).toBe("");
});