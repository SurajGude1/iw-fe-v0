"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { GOLANG_API_BASE_URL } from "@/app/config/constants";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check authentication on component mount
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      sessionStorage.setItem("redirected", "true");
      window.location.href = "/admin-signin"; // Redirect to login page if unauthenticated
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return; // Ensures hooks always run in order

    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get(
          `${GOLANG_API_BASE_URL}/admin/profile`,
          { withCredentials: true }
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
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Prevents hooks from breaking while checking auth
  }

  return (
    <div className="Margin80Auto ShadowPrimary FlexBoxColumn AlignItemsCenter BorderRadius4 OverflowHidden BoxW96Hauto BackgroundN RoutesMainContainer AdminDashboard">
      <div className="Box100w BorderCharCoal AutoWH Box100w Box600h OverFlowHidden PositionRelative">
        <Image
          className="Opacity08"
          src="/images/dashboard-home.png"
          alt="Dashboard Home"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="Box_60w PositionAbsolute Gap25 Top0 Left0 Bottom0 FlexBoxColumn JustifyCenter AlignContentCenter TransformTranslateYMinus50 Padding40">
          <h1 className="OffWhite">
            Hello,{" "}
            <span className="DecorationColorOffWhite DecorationOffSet DecorationUnderline DecorationThickness ElectricBlue">
              {adminData?.name || "Esteemed Guest"}
            </span>
          </h1>
          <p className="OffWhite WordSpacing1 Font16 LineHeight25">
            It&apos;s a pleasure to have you here! Our platform is designed to
            empower you with seamless tools, insightful analytics, and a dynamic
            space to manage everything effortlessly. Dive in, explore, and make
            the most of your experience with us.
          </p>
          <button
            className="Box165w Padding10 Font16 BgRichBlack CursorPointer Transition02 TextAlignCenter JustifyCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
            type="submit"
          >
            Discover More
          </button>
        </div>
      </div>
    </div>
  );
}
