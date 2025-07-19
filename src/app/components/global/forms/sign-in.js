"use client";
import { useState, useEffect } from "react";
import Button from "../buttons/button";
import { TextField, Button as MuiButton, Divider } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import GlobalForm from "./forms.module.css"
import { Global } from "@emotion/react";

export default function SignIn({ onClose }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showForgotPassword) {
      if (currentStep === 1) {
        console.log("Sending OTP to email...");
        setCurrentStep(2);
      } else if (currentStep === 2) {
        console.log("Verifying OTP...");
        setCurrentStep(3);
      } else {
        console.log("Updating password...");
        setShowForgotPassword(false);
        setCurrentStep(1);
      }
    } else {
      console.log(isSignIn ? "Signing in..." : "Creating account...");
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Signing in with ${provider}`);
    // Add your OAuth logic here
  };

  const handleBackToSignIn = () => {
    setShowForgotPassword(false);
    setCurrentStep(1);
  };

  if (!isMounted) return null;

  return (
    <div className={GlobalForm.Overlay} onClick={onClose}>
      <div className={GlobalForm.Modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={GlobalForm.CloseButton}
          aria-label="Close sign in form"
        >
          <svg
            className={GlobalForm.CloseIcon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Form Container */}

        <div className={GlobalForm.FormContainer}>
          <h1 className={GlobalForm.FormTitle}>
            {showForgotPassword
              ? "Reset Password"
              : isSignIn
                ? "Welcome Back"
                : "Create Account"}
          </h1>

          {/* Social Login Buttons - Only shown on sign in and not in forgot password */}
          {isSignIn && !showForgotPassword && (
            <div className={GlobalForm.SocialLoginContainer}>
              <MuiButton
                fullWidth
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                onClick={() => handleSocialLogin("google")}
                sx={{
                  mb: 2,
                  height: 48,
                  color: "#000000",
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Continue with Google
              </MuiButton>

              <Divider sx={{ my: 3 }}>OR</Divider>
            </div>
          )}

          <form onSubmit={handleSubmit} className={Global.Form}>
            {showForgotPassword ? (
              <>
                {currentStep === 1 && (
                  <TextField
                    id="forgot-email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    required
                    fullWidth
                    margin="normal"
                    sx={{
                      "& .MuiInputBase-root": { height: 48 },
                    }}
                  />
                )}

                {currentStep === 2 && (
                  <TextField
                    id="otp"
                    label="OTP"
                    variant="outlined"
                    required
                    fullWidth
                    margin="normal"
                    sx={{
                      "& .MuiInputBase-root": { height: 48 },
                    }}
                  />
                )}

                {currentStep === 3 && (
                  <>
                    <TextField
                      id="new-password"
                      label="New Password"
                      variant="outlined"
                      type="password"
                      required
                      fullWidth
                      margin="normal"
                      sx={{
                        "& .MuiInputBase-root": { height: 48 },
                      }}
                    />
                    <TextField
                      id="confirm-password"
                      label="Confirm New Password"
                      variant="outlined"
                      type="password"
                      required
                      fullWidth
                      margin="normal"
                      sx={{
                        "& .MuiInputBase-root": { height: 48 },
                      }}
                    />
                  </>
                )}

                <div className={GlobalForm.ButtonContainer}>
                  <Button
                    type="submit"
                    text={
                      currentStep === 1
                        ? "Send OTP"
                        : currentStep === 2
                          ? "Verify OTP"
                          : "Reset Password"
                    }
                    backgroundColor="#333333"
                    textColor="#ffffff"
                    className={GlobalForm.SubmitButton}
                  />
                </div>
              </>
            ) : isSignIn ? (
              <>
                <TextField
                  id="username"
                  label="Username/Email"
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": { height: 48 },
                  }}
                />

                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  required
                  fullWidth
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": { height: 48 },
                  }}
                />
              </>
            ) : (
              <>
                <TextField
                  id="fullName"
                  label="Full name"
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": { height: 48 },
                  }}
                />

                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  required
                  fullWidth
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": { height: 48 },
                  }}
                />
              </>
            )}

            {!showForgotPassword && (
              <div className={GlobalForm.ButtonContainer}>
                <Button
                  type="submit"
                  text={isSignIn ? "Sign In" : "Create Account"}
                  backgroundColor="#333333"
                  textColor="#ffffff"
                  className={GlobalForm.SubmitButton}
                />
              </div>
            )}
          </form>

          {/* Form Footer Links */}
          <div className={GlobalForm.LinkContainer}>
            {showForgotPassword ? (
              <button
                type="button"
                className={GlobalForm.LinkButton}
                onClick={handleBackToSignIn}
              >
                Back to Sign In
              </button>
            ) : isSignIn ? (
              <>
                <button
                  type="button"
                  className={GlobalForm.LinkButton}
                  onClick={() => setIsSignIn(false)}
                >
                  Create new account
                </button>
                <button
                  type="button"
                  className={GlobalForm.LinkButton}
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <button
                type="button"
                className={GlobalForm.LinkButton}
                onClick={() => setIsSignIn(true)}
              >
                Already have an account? Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

