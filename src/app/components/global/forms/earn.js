"use client";

import { useState, useCallback, useMemo } from "react";
import {
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Button from "../buttons/button";
import GlobalForm from "./forms.module.css";

const experienceOptions = ["1-3 years", "3-5 years", "5+ years"];
const interestOptions = ["Political", "Health", "Social", "Women", "Crime"];

export default function EarnForm({ onClose }) {
  const [formData, setFormData] = useState(() => ({
    name: "",
    email: "",
    dob: "",
    experience: "",
    workLink: "",
    interests: [],
  }));

  const [file, setFile] = useState(null);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      if (type === "checkbox") {
        const updatedInterests = checked
          ? [...prev.interests, value]
          : prev.interests.filter((item) => item !== value);
        return { ...prev, interests: updatedInterests };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Unsupported file type.");
      }
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log({ ...formData, file });
    // Here you'd send this data via fetch/Axios to the backend.
  }, [formData, file]);

  const interestCheckboxes = useMemo(
    () =>
      interestOptions.map((opt) => (
        <FormControlLabel
          key={opt}
          control={
            <Checkbox
              checked={formData.interests.includes(opt)}
              onChange={handleChange}
              value={opt}
              name="interests"
              inputProps={{ "aria-label": opt }}
            />
          }
          label={opt}
        />
      )),
    [formData.interests, handleChange]
  );

  return (
    <div className={GlobalForm.Overlay} onClick={onClose}>
      <div className={GlobalForm.Modal} onClick={(e) => e.stopPropagation()}>
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
            aria-hidden="true"
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

        <form onSubmit={handleSubmit} className={GlobalForm.Form} noValidate>
          <h2 className={GlobalForm.FormTitle}>Join us</h2>

          <div className={GlobalForm.ScrollContainer}>
            <TextField
              id="name"
              name="name"
              label="Full Name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              sx={{ "& .MuiInputBase-root": { height: 48 } }}
            />

            <TextField
              id="email"
              name="email"
              label="Email Address"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              sx={{ "& .MuiInputBase-root": { height: 48 } }}
            />

            <TextField
              id="dob"
              name="dob"
              label="Date of Birth"
              variant="outlined"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              sx={{ "& .MuiInputBase-root": { height: 48 } }}
            />

            <TextField
              id="experience"
              name="experience"
              label="Experience in Writing"
              variant="outlined"
              value={formData.experience}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              select
              sx={{ "& .MuiInputBase-root": { height: 48 } }}
            >
              <MenuItem value="">
                <em>Select experience</em>
              </MenuItem>
              {experienceOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="file"
              name="file"
              type="file"
              variant="outlined"
              label="Upload Resume"
              fullWidth
              required
              margin="normal"
              inputProps={{
                accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
                "aria-label": "Upload Resume",
              }}
              onChange={handleFileChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputBase-root": {
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                },
                "& input": {
                  padding: "10px 14px",
                },
              }}
            />

            <TextField
              id="workLink"
              name="workLink"
              label="Share Work Link (Optional)"
              variant="outlined"
              type="url"
              value={formData.workLink}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ "& .MuiInputBase-root": { height: 48 } }}
            />

            <div className={GlobalForm.CheckboxGroup}>
              <p className={GlobalForm.CheckboxTitle}>Interested Fields</p>
              <div className={GlobalForm.CheckboxOptions}>
                {interestCheckboxes}
              </div>
            </div>
          </div>

          <div className={GlobalForm.ButtonWrapper}>
            <Button
              type="submit"
              text="Submit Application"
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
