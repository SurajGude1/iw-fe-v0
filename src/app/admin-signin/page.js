"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { GOLANG_API_BASE_URL } from "../config/constants";

export default function AdminSignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "", // New field for confirm password
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const isRedirected = sessionStorage.getItem("redirected");
    if (isRedirected === "true") {
      sessionStorage.removeItem("redirected");
    }
  }, []);

  // Function to clear errors and messages after 3 seconds
  const clearMessages = () => {
    setTimeout(() => {
      setErrors({});
      setErrorMessage("");
      setSuccessMessage("");
    }, 3000); // 3 seconds
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage("");

    try {
      const response = await fetch(`${GOLANG_API_BASE_URL}/admin/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Login successful!");
        localStorage.setItem("isAuthenticated", "true");
        router.push("/admin-dashboard");
      } else {
        if (result.error) {
          if (result.error === "User not found") {
            setErrors({
              identifier: "This identifier does not exist in our records.",
            });
          } else if (result.error === "Invalid password") {
            setErrors({ password: "The password you entered is incorrect." });
          } else {
            setErrorMessage(result.error);
          }
          clearMessages(); // Clear messages after 3 seconds
        }
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
      clearMessages(); // Clear messages after 3 seconds
    }
  };

  const handleGetOtp = async () => {
    setErrors({});
    setErrorMessage("");

    try {
      const response = await fetch(
        `${GOLANG_API_BASE_URL}/admin/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotPasswordData.email }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("OTP sent to your email!");
        setOtpSent(true);
        clearMessages(); // Clear messages after 3 seconds
      } else {
        setErrorMessage(result.error || "Failed to send OTP.");
        clearMessages(); // Clear messages after 3 seconds
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
      clearMessages(); // Clear messages after 3 seconds
    }
  };

  const handleUpdatePassword = async () => {
    setErrors({});
    setErrorMessage("");

    // Check if new password and confirm new password match
    if (
      forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword
    ) {
      setErrors({
        confirmNewPassword: "Confirm new password must match the new password.",
      });
      clearMessages(); // Clear messages after 3 seconds
      return; // Stop execution if passwords do not match
    }

    try {
      const response = await fetch(
        `${GOLANG_API_BASE_URL}/admin/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: forgotPasswordData.email,
            otp: forgotPasswordData.otp,
            newPassword: forgotPasswordData.newPassword, // Only send newPassword
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Password updated successfully!");
        setIsForgotPassword(false);
        setOtpSent(false);
        setForgotPasswordData({
          email: "",
          otp: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        clearMessages(); // Clear messages after 3 seconds
      } else {
        setErrorMessage(result.error || "Failed to update password.");
        clearMessages(); // Clear messages after 3 seconds
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
      clearMessages(); // Clear messages after 3 seconds
    }
  };

  // Reset modal state when closing
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsForgotPassword(false); // Reset to Sign-In UI
    setOtpSent(false); // Reset OTP state
    setForgotPasswordData({
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    }); // Clear forgot password data
    setErrors({}); // Clear errors
    setErrorMessage(""); // Clear error message
    setSuccessMessage(""); // Clear success message
  };

  return (
    <div className="FlexBoxColumn JustifyCenter AlignItemsCenter Height100vh Gap25">
      <h2 className="SubHeader">
        Only individuals with verified credentials are granted access!
      </h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="Button Text400 Padding1020 Font16"
      >
        Admin Signin
      </button>

      {isModalOpen && (
        <div className="PopUpOverlay FlexBoxRow JustifyCenter AlignItemsCenter BgCharCoal">
          <div className="FlexBoxColumn JustifyCenter AlignItemsCenter Padding40 BgOffWhite BorderRadius4 Width400 Gap25">
            <h2 className="SubHeader">
              {isForgotPassword ? "Forgot Password" : "Admin Sign-In"}
            </h2>

            {successMessage && (
              <div className="SuccessText TextAlignCenter Font16">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="ErrorText TextAlignCenter Font16">
                {errorMessage}
              </div>
            )}

            {!isForgotPassword ? (
              <form
                className="Form BackgroundN Gap25 Box100w"
                onSubmit={handleSubmit}
              >
                <div className="FormGroup Box100w Gap20">
                  <label htmlFor="identifier">Email/Identifier</label>
                  <input
                    type="text"
                    name="identifier"
                    id="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email or identifier"
                    className={`InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16 ${
                      errors.identifier ? "ErrorText" : ""
                    }`}
                  />
                  {errors.identifier && (
                    <p className="ErrorText">{errors.identifier}</p>
                  )}
                </div>

                <div className="FormGroup Box100w Gap20">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className={`InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16 ${
                      errors.password ? "ErrorText" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="ErrorText">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="Button Box100w Padding15 Font16"
                >
                  Sign-In
                </button>

                <button
                  type="submit"
                  className="Box100w Padding15 CursorPointer BgSkyBlueHover OutlineN BorderCharCoal"
                >
                  <FontAwesomeIcon icon={faGoogle} className="Font16" />
                </button>
              </form>
            ) : (
              <form
                className="Form BackgroundN Gap25 Box100w"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="FormGroup Box100w Gap20">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={forgotPasswordData.email}
                    onChange={handleForgotPasswordChange}
                    required
                    placeholder="Enter your email"
                    className="InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16"
                  />
                </div>

                {otpSent ? (
                  <>
                    <div className="FormGroup Box100w Gap20">
                      <label htmlFor="otp">OTP</label>
                      <input
                        type="text"
                        name="otp"
                        id="otp"
                        value={forgotPasswordData.otp}
                        onChange={handleForgotPasswordChange}
                        required
                        placeholder="Enter OTP"
                        className="InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16"
                      />
                    </div>

                    <div className="FormGroup Box100w Gap20">
                      <label htmlFor="newPassword">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={forgotPasswordData.newPassword}
                        onChange={handleForgotPasswordChange}
                        required
                        placeholder="Enter new password"
                        className="InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16"
                      />
                    </div>

                    <div className="FormGroup Box100w Gap20">
                      <label htmlFor="confirmNewPassword">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        id="confirmNewPassword"
                        value={forgotPasswordData.confirmNewPassword}
                        onChange={handleForgotPasswordChange}
                        required
                        placeholder="Confirm new password"
                        className="InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16"
                      />
                      {errors.confirmNewPassword && (
                        <p className="ErrorText">{errors.confirmNewPassword}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleUpdatePassword}
                      className="Button Box100w Padding15 Font16"
                    >
                      Update Password
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleGetOtp}
                    className="Button Box100w Padding15 Font16"
                  >
                    Get OTP
                  </button>
                )}
              </form>
            )}

            <div className="TextAlignCenter">
              <a
                className="DecorationUlCharcoal RedText DecorationN Font16"
                href="#"
                onClick={() => setIsForgotPassword(!isForgotPassword)}
              >
                {isForgotPassword ? "Back to Sign-In" : "Forgot Password?"}
              </a>
            </div>
            <button
              onClick={handleCloseModal}
              className="DecorationUlCharcoal BorderN RedText Font16 BackgroundN"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
