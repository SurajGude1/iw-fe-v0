"use client";
import Logo from "../../../../public/logo/logo";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API requests
import { useRouter } from "next/navigation"; // Updated to use the correct hook
import { GOLANG_API_BASE_URL } from "@/app/config/constants";

export default function TopBar() {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  


  const handleClick = () => {
    router.push("/admin-dashboard/routes/admin-profile"); // Updated relative path to an absolute path
  };

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

  return (
    <div className="Top0 Left0 Box100w Padding10 ZIndex1000 FlexBoxRow AlignItemsCenter justifySpaceBetween BgRichBlack PositionFixed">
      <Logo />
      <div
        className="AdminName Box100h FlexBoxRow JustifyCenter AlignItemsCenter Gap10 CursorPointer"
        onClick={handleClick}
      >
        <div className="Padding9 FlexBoxRow AlignItemsCenter JustifyCenter Font400 OffWhite  BorderCharCoal FlexBoxRow Gap10 BorderRadius50 CursorPointer">
          <p className="Font12">
            {adminData?.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase() || "NA"}
          </p>
        </div>
        <p className="Font12 Font400 TextAlignCenter Padding5 Transition02 OffWhite DecorationUlOffWhite DecorationN">
          {adminData?.name || "Not Available"}
        </p>
      </div>
    </div>
  );
}
