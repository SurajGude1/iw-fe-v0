"use client";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GOLANG_API_BASE_URL } from "@/app/config/constants";

export default function Advertisements() {
  const [advertiseType, setAdvertiseType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    clientEmail: "",
    redirectionUrl: "",
    advertiseType: "",
    bannerFile: null,
    videoFile: null,
    duration: "",
    expectedCost: 0,
    youtubeChannelName: "",
    youtubeChannelUrl: "",
  });
  const [advertises, setAdvertises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManage, setShowManage] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAdId, setCurrentAdId] = useState(null);

  // Fetch advertisements from the backend
  const fetchAdvertises = async () => {
    try {
      const response = await axios.get(
        `${GOLANG_API_BASE_URL}/admin/get-advertise`
      );
      setAdvertises(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching advertisements:", err.message);
      setError("Failed to fetch advertisements. Please try again later.");
      toast.error("Failed to fetch advertisements. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertises();
  }, []);

  // Calculate expectedCost whenever duration changes
  useEffect(() => {
    const duration = parseFloat(formData.duration) || 0;
    const expectedCost = duration * 189;
    setFormData((prevData) => ({
      ...prevData,
      expectedCost: expectedCost,
    }));
  }, [formData.duration]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title || "");
    form.append("clientName", formData.clientName || "");
    form.append("clientEmail", formData.clientEmail || "");
    form.append("redirectionUrl", formData.redirectionUrl || "");
    form.append("advertiseType", formData.advertiseType || "");
    if (formData.bannerFile) form.append("bannerFile", formData.bannerFile);
    if (formData.videoFile) form.append("videoFile", formData.videoFile);
    form.append("duration", formData.duration || "");
    form.append("expectedCost", formData.expectedCost || 0);
    form.append("youtubeChannelName", formData.youtubeChannelName || "");
    form.append("youtubeChannelUrl", formData.youtubeChannelUrl || "");

    try {
      let response;
      if (isUpdating) {
        response = await axios.put(
          `${GOLANG_API_BASE_URL}/admin/update-advertise/${currentAdId}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${GOLANG_API_BASE_URL}/admin/set-advertise`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.status === 200) {
        toast.success(
          isUpdating
            ? "Record updated successfully!"
            : "Advertisement created successfully!",
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          }
        );
      }

      fetchAdvertises();
      resetForm();
    } catch (err) {
      console.error("Error submitting form:", err.message);
      setError("Failed to submit form. Please try again.");
      toast.error("Failed to submit form. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      clientName: "",
      clientEmail: "",
      redirectionUrl: "",
      advertiseType: "",
      bannerFile: null,
      videoFile: null,
      duration: "",
      expectedCost: 0,
      youtubeChannelName: "",
      youtubeChannelUrl: "",
    });
    setAdvertiseType("");
    setIsUpdating(false);
    setCurrentAdId(null);
  };

  // Handle delete advertisement
  const handleDelete = async (advertisementId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, the advertisement cannot be retrieved.",
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
            `${GOLANG_API_BASE_URL}/admin/delete-advertise/${advertisementId}`
          );

          if (response.status === 200) {
            toast.success("Advertisement deleted successfully!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
          }
          fetchAdvertises(); // Refresh the list
        } catch (err) {
          console.error("Error deleting advertisement:", err.message);
          toast.error("Failed to delete advertisement. Please try again.", {
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

  // Handle update button click
  const handleUpdate = (ad) => {
    setFormData({
      title: ad.title,
      clientName: ad.clientName,
      clientEmail: ad.clientEmail,
      redirectionUrl: ad.redirectionUrl,
      advertiseType: ad.advertiseType,
      bannerFile: null,
      videoFile: null,
      duration: ad.duration,
      expectedCost: ad.expectedCost,
      youtubeChannelName: ad.youtubeChannelName || "",
      youtubeChannelUrl: ad.youtubeChannelUrl || "",
    });
    setAdvertiseType(ad.advertiseType);
    setIsUpdating(true);
    setCurrentAdId(ad.advertisementId);
  };

  // Handle cancel update
  const handleCancelUpdate = () => {
    resetForm();
  };

  // Toggle manage visibility
  const toggleManage = () => {
    setShowManage(!showManage);
  };

  const [sortBy, setSortBy] = useState("");

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };
  return (
    <div className="Margin80Auto ShadowPrimary FlexBoxColumn BorderRadius4 OverflowHidden BoxW96Hauto Padding30 Gap25 BackgroundN RoutesMainContainer">
      <ToastContainer />
      <h1 className="Header TextAlignCenter">Add Advertisement</h1>

      <form className="Form JustifyCenter Gap35" onSubmit={handleSubmit}>
        {/* Title */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="postTitle">Title</label>
          <input
            type="text"
            id="postTitle"
            placeholder="Enter the advertisement title"
            required={!isUpdating}
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Client Name */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="advertiserName">Client Name</label>
          <input
            type="text"
            id="advertiserName"
            placeholder="Enter the client name"
            required={!isUpdating}
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            value={formData.clientName || ""}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
          />
        </div>

        {/* Client Email */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="advertiserEmail">Client Email</label>
          <input
            type="email"
            id="advertiserEmail"
            placeholder="Enter the client email"
            required={!isUpdating}
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            value={formData.clientEmail || ""}
            onChange={(e) =>
              setFormData({ ...formData, clientEmail: e.target.value })
            }
          />
        </div>

        {/* Redirection URL */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="companyLink">Redirection URL</label>
          <input
            type="url"
            id="companyLink"
            placeholder="Enter the client organization url (if any)"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            value={formData.redirectionUrl || ""}
            onChange={(e) =>
              setFormData({ ...formData, redirectionUrl: e.target.value })
            }
          />
        </div>

        {/* Advertise Type */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="advertiseType">Advertise type</label>
          <select
            id="advertiseType"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            value={advertiseType || ""}
            onChange={(e) => {
              setAdvertiseType(e.target.value);
              setFormData({ ...formData, advertiseType: e.target.value });
            }}
          >
            <option value="" disabled>
              Select advertise type
            </option>
            <option value="banner">Banner</option>
            <option value="video">Video</option>
            <option value="youtube">Youtube channel promotion</option>
          </select>
        </div>

        {/* Banner File Upload */}
        {advertiseType === "banner" && (
          <div className="FormGroup Box100w Gap15 JustifyStart">
            <label htmlFor="posterFile">Upload banner</label>
            <input
              type="file"
              id="posterFile"
              className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
              onChange={(e) =>
                setFormData({ ...formData, bannerFile: e.target.files[0] })
              }
            />
          </div>
        )}

        {/* Video File Upload */}
        {advertiseType === "video" && (
          <div className="FormGroup Box100w Gap15 JustifyStart">
            <label htmlFor="videoFile">Upload video</label>
            <input
              type="file"
              id="videoFile"
              className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
              onChange={(e) =>
                setFormData({ ...formData, videoFile: e.target.files[0] })
              }
            />
          </div>
        )}

        {/* YouTube Channel Fields */}
        {advertiseType === "youtube" && (
          <>
            <div className="FormGroup Box100w Gap15 JustifyStart">
              <label htmlFor="youtubeChannelName">YouTube Channel Name</label>
              <input
                type="text"
                id="youtubeChannelName"
                placeholder="Enter YouTube channel name"
                className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
                value={formData.youtubeChannelName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, youtubeChannelName: e.target.value })
                }
              />
            </div>
            <div className="FormGroup Box100w Gap15 JustifyStart">
              <label htmlFor="youtubeChannelUrl">YouTube Channel URL</label>
              <input
                type="url"
                id="youtubeChannelUrl"
                placeholder="Enter YouTube channel URL"
                className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
                value={formData.youtubeChannelUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, youtubeChannelUrl: e.target.value })
                }
              />
            </div>
          </>
        )}

        {/* Duration */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="duration">Duration (1-45 days)</label>
          <input
            type="number"
            id="duration"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            min="1"
            max="65"
            value={formData.duration || ""}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </div>

        {/* Expected Cost */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="expectedCost">Expected Cost (₹)</label>
          <input
            type="text"
            id="expectedCost"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            value={formData.expectedCost}
            onChange={(e) =>
              setFormData({ ...formData, expectedCost: e.target.value })
            }
            readOnly
          />
        </div>

        {/* Add Button */}
        <div className="FlexBoxRow AlignItemsCenter JustifyCenter Box100w Gap20">
          <button
            className="Box_15w Padding10 Font16 BgRichBlack CursorPointer Transition02 TextAlignCenter JustifyCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
            type="submit"
          >
            {isUpdating ? "Submit to Update" : "Submit"}
          </button>
          {isUpdating && (
            <button
              className="Box_15w Padding10 Font16 BgRichBlack CursorPointer Transition02 TextAlignCenter JustifyCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
              type="button"
              onClick={handleCancelUpdate}
            >
              Cancel Update
            </button>
          )}
          <button
            className="Box_15w Padding10 Font16 BgRichBlack CursorPointer Transition02 TextAlignCenter JustifyCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
            type="button"
            onClick={toggleManage}
          >
            {showManage ? "Close" : "Manage"}
          </button>
        </div>
      </form>

      {showManage && (
        <div className="FlexBoxColumn Gap25">
          <h1 className="Font24 TextAlignCenter">Manage Advertisements</h1>

          {/* Filter Dropdown */}
          <div className="FlexBoxRow Box100w Gap15 JustifyStart">
            <div className="FlexBoxRow Box100w Gap15 JustifyStart">
              <select
                id="filter"
                placeholder="Sort by"
                value={sortBy}
                onChange={handleSortByChange}
                className="InputField Box100w Padding10 BorderRadius4 Font16"
              >
                <option value="Sort by" disabled>
                  Sort by
                </option>
                <option value="date">Ctreated date</option>
                <option value="date">Expiry date</option>
                <option value="advertiseType">Advertise type</option>
                <option value="duration">Duration</option>
              </select>
            </div>
            <div className="FlexBoxRow Box100w Gap15 JustifyStart">
              <select
                id="filter"
                placeholder="Filter by"
                className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
              >
                <option value="Sort by" disabled>
                  Filter by
                </option>
                {sortBy === "advertiseType" ? (
                  <>
                    <option value="banner">Banner</option>
                    <option value="video">Video</option>
                    <option value="youtube">Youtube channel promotion</option>
                  </>
                ) : (
                  <>
                    <option value="lowerFirst">Lower first</option>
                    <option value="higherFirst">Higher first</option>
                  </>
                )}
              </select>
            </div>

            <button
              className="Box_15w Padding10 Font16 BgRichBlack CursorPointer Transition02 TextAlignCenter JustifyCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
              type="button"
            >
              Apply
            </button>
          </div>

          {/* List of advertisements in table */}
          {loading ? (
            <p>Loading advertisements...</p>
          ) : (
            <div className="Box100w OverflowXAuto MaxHeight250">
              <table className="MainTable">
                <thead>
                  <tr>
                    <th>Ad ID</th>
                    <th>Client Name</th>
                    <th>Client Email</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Expiry Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!advertises || advertises.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{ textAlign: "center", padding: "10px" }}
                      >
                        Nothing to display !
                      </td>
                    </tr>
                  ) : (
                    advertises.map((ad) => (
                      <tr key={ad._id}>
                        <td>{ad.advertisementId}</td>
                        <td>{ad.clientName}</td>
                        <td>{ad.clientEmail}</td>
                        <td>{ad.advertiseType}</td>
                        <td>{ad.duration}</td>
                        <td>
                          {new Date(ad.advertiseexpireson)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-")}
                        </td>
                        <td>
                          <div className="Actions">
                            <Link
                              href="#"
                              className="ActionsLinks DeleteLink"
                              onClick={() => handleDelete(ad.advertisementId)}
                            >
                              Delete
                            </Link>
                            <Link
                              href="#"
                              className="ActionsLinks UpdateLink"
                              onClick={() => handleUpdate(ad)}
                            >
                              Update
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}