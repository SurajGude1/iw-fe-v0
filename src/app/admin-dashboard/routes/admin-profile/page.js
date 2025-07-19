"use client";
// import axios from "axios";

import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API requests
import "./styles/page.css";
import { GOLANG_API_BASE_URL } from "@/app/config/constants";

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get(
          `${GOLANG_API_BASE_URL}/admin/profile`,
          {
            withCredentials: true, // Ensure cookies (JWT) are sent with the request
          }
        );
        setAdminData(response.data.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleProfileClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${GOLANG_API_BASE_URL}/admin/logout`,
        {},
        { withCredentials: true } // Ensure cookies (auth token) are included
      );

      if (response.status === 200) {
        // Clear authentication token (if stored)
        document.cookie =
          "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly";

        // Redirect to login page after successful logout
        window.location.href = "/admin-signin";
      } else {
        console.error("Logout failed:", response.data);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="Margin80Auto ShadowPrimary FlexBoxColumn BorderRadius4 OverflowHidden BoxW96Hauto Padding30 Gap25 BackgroundN RoutesMainContainer">
      <div className="FlexBoxRow AlignItemsCenter Gap30 ShadowSecondary BorderRadius4 Padding20">
        <img
          className="ProfileImg"
          src="/icons/profile.png"
          alt="Profile Icon"
          onClick={handleProfileClick}
        />
        <div className="FlexBoxColumn Gap20 BorderCharcoal">
          <h2 className="Header Font42 CharcoalText">
            {adminData.name || "Admin"}
          </h2>
          <span className="Font28">
            {adminData.assignedRole || "Not Assigned"}
          </span>
        </div>
      </div>

      <div className="PersonalInfo">
        <h3 className="Padding20 Font24 ShadowSecondary BorderRadius4 CharcoalText">
          Personal Information
        </h3>
        <div className="FlexBoxRow Padding20 Gap10">
          <p className="Font18 TextBold">Person Name:</p>
          <p className="InfoValue">{adminData.name || "Not Available"}</p>
        </div>
        <div className="FlexBoxRow Padding20 Gap10">
          <p className="TextBold">Email:</p>
          <p className="InfoValue">{adminData.email || "Not Available"}</p>
        </div>
        <div className="FlexBoxRow Padding20 Gap10">
          <p className="TextBold">Date of birth:</p>
          <p className="InfoValue">{adminData.dob || "Not Available"}</p>
        </div>
        <div className="FlexBoxRow Padding20 Gap10">
          <p className="TextBold">Last login:</p>
          <p className="InfoValue">{adminData.lastLogin || "Not Available"}</p>
        </div>
      </div>

      <div className="FlexBoxRow AlignItemsCenter JustifyCenter AlignContentCenter Gap10">
        <button className="Box_15w Padding10 Font16 BgRichBlack PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN">
          Reset password
        </button>
        <button
          className="Box_15w Padding10 Font16 BgRichBlack PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
          onClick={handleLogout}
        >
          Logout
        </button>

        {/*     
        <button
          className="ButtonW80H6 CursorPointer BorderRadius20 BorderN OutlineN ShadowSecondary Transition02 BgWhiteBone Font400 Font16"
          onClick={handleLogout}
        >
          Logout
        </button> */}
      </div>

      {showPopup && (
        <div className="PopupOverlay ZIndex1000 Top0 Left0 PositionFixed BgCharCoal FlexBoxColumn JustifyCenter AlignItemsCenter AlignContentCenter Box100wh">
          <div className="FlexBoxColumn JustifyCenter AlignItemsCenter Padding40 BgOffWhite BorderRadius4 Width400 Gap25">
            <h3 className="Herder Font24">Update Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              className="InputField Padding10 OutlineY BorderRadius4 BorderCharCoal Font16"
            />
            <div className="FlexBoxRow Box100w Gap20 OutlineN BorderN BorderCharCoal Box100w">
              <button className="Box100w Padding10 Font16 BgRichBlack PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN">
                Update
              </button>
              <button
                className="Box100w Padding10 Font16 BgCokeRed PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
                onClick={handleClosePopup}
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
