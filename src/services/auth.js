import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Reset user password
 * @param {string} token - reset token from email link
 * @param {string} newPassword - new password
 */
export const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw new Error("Reset link is invalid or has expired.");
  }

  if (!newPassword) {
    throw new Error("Password is required.");
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/reset-password`,
      {
        password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    // Normalize backend errors for the UI
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to reset password. Please try again.");
  }
};
