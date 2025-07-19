"use client";
import { useState } from "react";
import axios from "axios";
import { GOLANG_API_BASE_URL } from "@/app/config/constants";

export default function LeftNavBar() {
  const [activeButton, setActiveButton] = useState(null); // State to track active button

  // Function to handle button click
  const handleButtonClick = (buttonName, redirectUrl) => {
    setActiveButton(buttonName);
    if (redirectUrl) {
      window.location.href = redirectUrl; // Redirect to the specified URL
    }
  };

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
    <div className="LeftNavigationBar BoxW20H100 ShadowPrimary">
      <ul className="Box100wh FlexBoxColumn Gap20 JustifyCenter AlignItemsCenter AlignContentCenter ">
        <button
          className="ButtonW80H6 CursorPointer BorderRadius20 BorderN OutlineN ShadowSecondary Transition02 BgWhiteBone Font400 Font16"
          onClick={() =>
            (window.location.href = "../../admin-dashboard/routes/add-new-post")
          }
        >
          Add New Post
        </button>

        <button
          className="ButtonW80H6 CursorPointer BorderRadius20 BorderN OutlineN ShadowSecondary Transition02 BgWhiteBone Font400 Font16"
          onClick={() =>
            (window.location.href =
              "../../admin-dashboard/routes/advertisements")
          }
        >
          Advertisements
        </button>

        <button
          className="ButtonW80H6 CursorPointer BorderRadius20 BorderN OutlineN ShadowSecondary Transition02 BgWhiteBone Font400 Font16"
          onClick={() =>
            (window.location.href =
              "../../admin-dashboard/routes/daily-analysis")
          }
        >
          Daily Analysis
        </button>
        <button
          className="ButtonW80H6 CursorPointer BorderRadius20 BorderN OutlineN ShadowSecondary Transition02 BgWhiteBone Font400 Font16"
          onClick={() =>
            (window.location.href =
              "../../admin-dashboard/routes/user-management")
          }
        >
          User Management
        </button>

        <button
          className="ButtonW80H6 CursorPointer BorderRadius20 BorderN OutlineN ShadowSecondary Transition02 BgWhiteBone Font400 Font16"
          onClick={() =>
            (window.location.href = "../../admin-dashboard/routes/manage-roles")
          }
        >
          Manage Roles
        </button>

        <button
          className="ButtonW80H6 CursorPointer BorderRadius20 BorderN OutlineN ShadowSecondary Transition02 BgWhiteBone Font400 Font16"
          onClick={handleLogout}
        >
          Logout
        </button>
      </ul>
    </div>
  );
}
