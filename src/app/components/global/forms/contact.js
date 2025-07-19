"use client";

import { useState, useCallback, useMemo } from "react";
import { TextField, MenuItem } from "@mui/material";
import Button from "../buttons/button";
import GlobalForm from "./forms.module.css";

export default function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
    message: "",
  });

  const purposeOptions = useMemo(
    () => ["Advertisements", "Promotions", "Content", "General Inquiry"],
    []
  );

  const inputStyles = useMemo(
    () => ({
      "& .MuiInputBase-root": { height: 48 },
    }),
    []
  );

  const messageStyles = useMemo(
    () => ({
      "& .MuiInputBase-root": {
        height: "auto",
        minHeight: "120px",
      },
    }),
    []
  );

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Basic front-end validation
      if (!formData.name || !formData.email || !formData.purpose || !formData.message) {
        alert("All fields are required.");
        return;
      }

      // Sanitize data (basic client-side)
      const sanitizedData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        purpose: formData.purpose.trim(),
        message: formData.message.trim(),
      };

      console.log("Submitting form:", sanitizedData);

      // Submit logic here (e.g., fetch/axios POST)
    },
    [formData]
  );

  const stopPropagation = useCallback((e) => e.stopPropagation(), []);

  return (
    <div className={GlobalForm.Overlay} onClick={onClose}>
      <div className={GlobalForm.Modal} onClick={stopPropagation}>
        <button
          onClick={onClose}
          className={GlobalForm.CloseButton}
          aria-label="Close contact form"
        >
          <svg
            className={GlobalForm.CloseIcon}
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className={GlobalForm.Form} noValidate>
          <h2 className={GlobalForm.FormTitle}>Contact Us</h2>

          <div className={GlobalForm.ScrollContainer}>
            <TextField
              id="name"
              name="name"
              label="Full Name"
              variant="outlined"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              sx={inputStyles}
            />

            <TextField
              id="email"
              name="email"
              label="Email Address"
              variant="outlined"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              sx={inputStyles}
            />

            <TextField
              id="purpose"
              name="purpose"
              label="Purpose of Contact"
              variant="outlined"
              value={formData.purpose}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              select
              sx={inputStyles}
            >
              <MenuItem value="">
                <em>Select purpose</em>
              </MenuItem>
              {purposeOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="message"
              name="message"
              label="Your Message"
              variant="outlined"
              value={formData.message}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              multiline
              rows={5}
              autoComplete="off"
              sx={messageStyles}
            />
          </div>

          <div className={GlobalForm.ButtonWrapper}>
            <Button
              type="submit"
              text="Send Message"
              backgroundColor="var(--rich-black)"
              textColor="#ffffff"
              className={GlobalForm.SubmitButton}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
