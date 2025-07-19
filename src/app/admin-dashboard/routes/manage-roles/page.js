"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GOLANG_API_BASE_URL } from "@/app/config/constants";

export default function ManageRoles() {
  const [admins, setAdmins] = useState([]);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState("");
  const [assignedRole, setAssignedRole] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEmailExistsPopup, setShowEmailExistsPopup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState(null);

  useEffect(() => {
    if (showOtpPopup) {
      setCountdown(60);
      setResendEnabled(false);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOtpPopup]);

  const handleProceedClick = async () => {
    const form = document.getElementById("adminForm");
    const enteredDob = document.getElementById("dob").value;

    // Validate DOB
    const dobDate = new Date(enteredDob);
    const today = new Date();

    if (dobDate > today) {
      setDobError("Date of birth cannot be a future date!");
      setTimeout(() => setDobError(""), 3000);
      return;
    }

    let age = today.getFullYear() - dobDate.getFullYear();
    const month = today.getMonth() - dobDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setDobError("Age must be 18 years or older!");
      setTimeout(() => setDobError(""), 3000);
      return;
    }

    if (form.checkValidity()) {
      const enteredEmail = document.getElementById("email").value;
      setEmail(enteredEmail);

      const formData = {
        name,
        email: enteredEmail,
        dob: enteredDob,
        assignedRole,
      };

      try {
        if (isUpdating) {
          const response = await axios.put(
            `${GOLANG_API_BASE_URL}/admin/${currentAdminId}`,
            formData,
            { withCredentials: true }
          );

          if (response.status === 200) {
            setAdmins(
              admins.map((admin) =>
                admin.roleId === currentAdminId
                  ? { ...admin, ...formData }
                  : admin
              )
            );
            toast.success("Updated admin details successfully !", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            setIsUpdating(false);
            setCurrentAdminId(null);
            setName("");
            setEmail("");
            setDob("");
            setAssignedRole("");
            fetchAdmins();
          } else {
            toast.error("Failed to update admin details", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
          }
        } else {
          const response = await fetch(`${GOLANG_API_BASE_URL}/admin/signup`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();

          if (response.ok) {
            setShowOtpPopup(true);
          } else {
            let errorMessage = data.error || "Error signing up.";
            if (errorMessage.toLowerCase().includes("user not found")) {
              errorMessage = "Admin with this email already exists!";
            }
            setEmailError(errorMessage);
          }
        }
      } catch (error) {
        setEmailError(error.message || "Network error.");
      }
    } else {
      form.reportValidity();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `${GOLANG_API_BASE_URL}/admin/auth/verify/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value: otp }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setShowOtpPopup(false);
        console.log("Showing SweetAlert2"); // Debugging
        Swal.fire({
          title: "Success",
          text: "New role added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          fetchAdmins();
        });
      } else {
        setOtpMessage(data.message || "Invalid OTP.");
      }
    } catch (error) {
      setOtpMessage(error.message || "Network error.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch(
        `${GOLANG_API_BASE_URL}/admin/auth/resend-otp/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "OTP resent successfully!");
        setCountdown(60);
        setResendEnabled(false);

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendEnabled(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        alert(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      alert(error.message || "Network error. Failed to resend OTP.");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${GOLANG_API_BASE_URL}/admin/list`, {
        withCredentials: true,
      });
      setAdmins(response.data.admins);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError(err.response?.data?.error || "Failed to fetch admins");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, the admin cannot be retrieved.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${GOLANG_API_BASE_URL}/admin/${roleId}`,
            {
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            setAdmins(admins.filter((admin) => admin.roleId !== roleId));
            toast.success("Admin deleted successfully!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
          }
          fetchAdmins();
        } catch (err) {
          console.error("Error deleting admin:", err);
          toast.error("Failed to delete admin. Please try again.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        }
      }
    });
  };

  const handleUpdateAdmin = (roleId) => {
    const admin = admins.find((a) => a.roleId === roleId);
    if (!admin) return;

    setName(admin.name);
    setEmail(admin.email);
    setDob(admin.dob);
    setAssignedRole(admin.assignedRole);
    setIsUpdating(true);
    setCurrentAdminId(roleId);
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setCurrentAdminId(null);
    setName("");
    setEmail("");
    setDob("");
    setAssignedRole("");
  };

  return (
    <div className="Margin80Auto ShadowPrimary FlexBoxColumn FourPxBorderRadius OverflowHidden BoxW96Hauto Padding30 Gap25 BackgroundN RoutesMainContainer">
      <ToastContainer />
      <h1 className="Header TextAlignCenter">Manage Roles</h1>

      <form id="adminForm" className="Form JustifyCenter Gap35">
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="name" className="Label">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Admin name"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="email" className="Label">
            Email
          </label>
          {emailError && <p className="RedText">{emailError}</p>}
          <div className="EmailContainer">
            <input
              type="email"
              id="email"
              placeholder="Email"
              className={`InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal EmailInput ${
                emailError ? "inputError" : ""
              }`}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="dob" className="Label">
            Date of Birth
          </label>
          {dobError && <p className="RedText">{dobError}</p>}
          <input
            type="date"
            id="dob"
            name="dob"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="assignedRole" className="Label">
            Role
          </label>
          <select
            id="assignedRole"
            required
            value={assignedRole}
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            onChange={(e) => setAssignedRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option>Owner</option>
            <option>Blog Writer</option>
            <option>Advertise Editor</option>
            <option>SEO Specialist</option>
          </select>
        </div>

        <div className="FlexBoxRow AlignItemsCenter JustifyCenter Box100w Gap20">
          <button
            type="button"
            className="Box_15w Padding10 Font16 BgRichBlack CursorPointer Transition02 TextAlignCenter JustifyCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
            onClick={handleProceedClick}
          >
            {isUpdating ? "Update Role" : "Proceed"}
          </button>
          {isUpdating && (
            <button
              type="button"
              className="Box_15w Padding10 Font16 BgRichBlack CursorPointer Transition02 TextAlignCenter JustifyCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
              onClick={handleCancelUpdate}
            >
              Cancel Update
            </button>
          )}
        </div>
      </form>

      <h1 className="SubHeader Font18 TextAlignCenter">
        Manage existing roles
      </h1>

      {isLoading ? (
        <p className="TextAlignCenter">Loading admins...</p>
      ) : error ? (
        <p className="TextAlignCenter RedText">{error}</p>
      ) : (
        <div className="Box100w MaxHeight250">
          <table className="MainTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>DOB</th>
                <th>Created On</th>
                <th>Updated On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.roleId}>
                  <td>{admin.roleId}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.assignedRole}</td>
                  <td>
                    {new Date(admin.dob)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </td>
                  <td>
                    {new Date(admin.roleCreatedOn)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </td>
                  <td>
                    {new Date(admin.roleUpdatedOn)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </td>
                  <td>
                    <div className="Actions">
                      <button
                        className="ActionsLinks DeleteLink BorderN CursorPointer"
                        onClick={() => handleDeleteAdmin(admin.roleId)}
                      >
                        Delete
                      </button>
                      <button
                        className="ActionsLinks UpdateLink BorderN CursorPointer"
                        onClick={() => handleUpdateAdmin(admin.roleId)}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEmailExistsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Admin Already Exists</h2>
            <p>
              This email is already registered as an admin. Please use a
              different email.
            </p>
            <button
              onClick={() => setShowEmailExistsPopup(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showOtpPopup && (
        <div className="PopupOverlay ZIndex1000 Top0 Left0 PositionFixed BgCharCoal FlexBoxColumn JustifyCenter AlignItemsCenter AlignContentCenter Box100wh">
          <div className="FlexBoxColumn JustifyCenter AlignItemsCenter Padding40 BgOffWhite BorderRadius4 Width400 Gap25">
            <h2 className="Header TextAlignCenter">Verify Email</h2>
            <div className="FormGroup Box100w Gap20">
              <label htmlFor="popupEmail" className="PopupLabel">
                OTP is shared on below email
              </label>
              <input
                type="email"
                id="popupEmail"
                className="InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16"
                value={email}
                readOnly
                required
              />
            </div>
            <div className="FormGroup Box100w Gap20">
              {otpMessage && <p className="RedText">{otpMessage}</p>}
              <label htmlFor="otp" className="PopupLabel">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="InputField Padding15 OutlineY BorderRadius4 BorderCharCoal Font16"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="ResendOtpSection">
              {resendEnabled ? (
                <button
                  className="OutlineN BorderN BackgroundN CursorPointer Font16 DecorationUlCharcoal Transition02"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              ) : (
                <p>Resend available in {countdown} seconds</p>
              )}
            </div>

            <div className="FlexBoxRow Box100w Gap20 OutlineN BorderN ">
              <button
                onClick={handleVerifyOtp}
                className="Box100w Padding10 Font16 BgRichBlack PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
              >
                Verify
              </button>
              <button
                className="Box100w Padding10 Font16 BgCokeRed PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
                onClick={() => setShowOtpPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
