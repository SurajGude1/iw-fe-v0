"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import TinymcePlugins from "./components/TinymcePlugins";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { GOLANG_API_BASE_URL } from "@/app/config/constants";

// Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function AddNewPost() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // For displaying existing thumbnail
  const [category, setCategory] = useState("Controversial");
  const [categories, setCategories] = useState([]); // State to store categories
  const [newCategory, setNewCategory] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [postContent, setPostContent] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assuming the user is authenticated
  const [isUpdating, setIsUpdating] = useState(false); // Track update mode
  const [currentPostId, setCurrentPostId] = useState(null); // Track the post being updated
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // Track the category being updated

  // Fetch posts from the backend
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${GOLANG_API_BASE_URL}/admin/get-post`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err.message);
      setError("Failed to fetch posts. Please try again later.");
      toast.error("Failed to fetch posts. Please try again later.", {
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

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${GOLANG_API_BASE_URL}/admin/get-post-category`
      );
      setCategories(response.data); // Update categories state with fetched data
    } catch (err) {
      console.error("Error fetching categories:", err.message);
      toast.error("Failed to fetch categories. Please try again later.", {
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

  useEffect(() => {
    fetchPosts();
    fetchCategories(); // Fetch categories when the component mounts
  }, []);

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files ? e.target.files[0] : null);
  };

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
      }
    };

    fetchAdminProfile();
  }, [isAuthenticated]);

  // Handle adding new category
  const handleAddCategory = async () => {
    if (newCategory.trim() === "") {
      toast.error("Category name cannot be empty.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("categoryName", newCategory.trim()); // Add categoryName
      formData.append("addedBy", adminData?.name || "Admin"); // Add addedBy

      const response = await axios.post(
        `${GOLANG_API_BASE_URL}/admin/set-post-category`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        }
      );

      if (response.status === 200) {
        toast.success("Category added successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setNewCategory(""); // Clear the input field
        fetchCategories(); // Refresh the categories list
      }
    } catch (err) {
      console.error("Error adding category:", err.message);
      toast.error("Failed to add category. Please try again.", {
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

  // Handle update category
  const handleUpdateCategory = async (categoryId) => {
    if (newCategory.trim() === "") {
      toast.error("Category name cannot be empty.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("categoryName", newCategory.trim()); // Add categoryName
      formData.append("addedBy", adminData?.name || "Admin"); // Add addedBy

      const response = await axios.put(
        `${GOLANG_API_BASE_URL}/admin/update-post-category/${categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        }
      );

      if (response.status === 200) {
        toast.success("Category updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setNewCategory(""); // Clear the input field
        fetchCategories(); // Refresh the categories list
        setIsUpdating(false); // Reset update mode
        setCurrentCategoryId(null); // Reset current category ID
      }
    } catch (err) {
      console.error("Error updating category:", err.message);
      toast.error("Failed to update category. Please try again.", {
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

  // Handle delete post
  const handleDeleteCategory = async (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, the category cannot be retrieved.",
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
            `${GOLANG_API_BASE_URL}/admin/delete-post-category/${categoryId}`
          );

          if (response.status === 200) {
            toast.success("Category deleted successfully!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            fetchCategories(); // Refresh the list
          }
        } catch (err) {
          console.error("Error deleting category:", err.message);
          toast.error("Failed to delete category. Please try again.", {
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("postTitle", postTitle);
    formData.append("category", category);
    formData.append("author", authorName);
    formData.append("postContent", postContent);
    formData.append("addedBy", adminData?.name || "");
    if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

    try {
      let response;
      if (isUpdating) {
        // Update existing post
        response = await axios.put(
          `${GOLANG_API_BASE_URL}/admin/update-post/${currentPostId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new post
        response = await axios.post(
          `${GOLANG_API_BASE_URL}/admin/set-post`,
          formData,
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
            ? "Post updated successfully!"
            : "Post submitted successfully!",
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
        fetchPosts(); // Refresh the list
        resetForm(); // Reset the form
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit post. Please try again.", {
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
    setPostTitle("");
    setAuthorName("");
    setCategory("Controversial");
    setPostContent(""); // Reset TinyMCE editor content
    setThumbnailFile(null);
    setThumbnailUrl("");
    setIsUpdating(false);
    setCurrentPostId(null);
  };

  // Handle delete post
  const handleDelete = async (postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, the post cannot be retrieved.",
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
            `${GOLANG_API_BASE_URL}/admin/delete-post/${postId}`
          );

          if (response.status === 200) {
            toast.success("Post deleted successfully!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
            fetchPosts(); // Refresh the list
          }
        } catch (err) {
          console.error("Error deleting post:", err.message);
          toast.error("Failed to delete post. Please try again.", {
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
  const handleUpdate = (post) => {
    setPostTitle(post.postTitle);
    setAuthorName(post.author);
    setCategory(post.category);
    setPostContent(post.postContent); // Set postContent for TinyMCE
    setThumbnailUrl(post.thumbnailUrl); // Set existing thumbnail URL
    setIsUpdating(true);
    setCurrentPostId(post.postId);
  };

  // Handle cancel update
  const handleCancelUpdate = () => {
    resetForm();
  };

  return (
    <div className="Margin80Auto ShadowPrimary FlexBoxColumn BorderRadius4 OverflowHidden BoxW96Hauto Padding30 Gap25 BackgroundN">
      <ToastContainer />
      <h1 className="Header TextAlignCenter">Add new post</h1>
      <form className="Form JustifyCenter Gap35" onSubmit={handleSubmit}>
        {/* Post Title */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="postTitle">Post Title</label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Enter the post title"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            required
          />
        </div>

        {/* Select Thumbnail */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="thumbnailFile">Select Thumbnail</label>
          <input
            type="file"
            id="thumbnailFile"
            name="thumbnailFile"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
          />
          {thumbnailUrl && (
            <Image
              src={thumbnailUrl}
              alt="Existing Thumbnail"
              width={200}
              height={200}
              className="AutoWH"
            />
          )}
        </div>

        {/* Select Category */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="category">Select Category</label>
          <div className="FlexBoxRow Gap10 Font400">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
            >
              {categories && categories.length > 0 ? (
                categories.map((cat, index) => (
                  <option key={index} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))
              ) : (
                <option value="">No categories to display</option>
              )}
            </select>

            <button
              type="button"
              className="Box_15w Font18 Font400 CursorPointer BorderN BorderRadius4 BorderCharCoal HoverSkyBlue Transition02 BgRichBlack OffWhite BgSkyBlueHover"
              onClick={() => setIsPopupOpen(true)}
            >
              Add
            </button>
          </div>
        </div>

        {/* Popup Form for Managing Categories */}
        {isPopupOpen && (
          <div className="PopupOverlay ZIndex1000 Top0 Left0 PositionFixed BgCharCoal FlexBoxColumn JustifyCenter AlignItemsCenter AlignContentCenter Box100wh">
            <div className="Box400w FlexBoxColumn JustifyCenter AlignItemsCenter AlignContentCenter BgWhiteBone Gap15 Padding20 BorderRadius4 TextAlignCenter">
              <h2>Manage Categories</h2>

              {/* Add New Category */}
              <div className="Box100w Gap10 FormGroup Boxw100 BorderRadius4 OutlineN">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="InputField BorderCharCoal Padding10 BorderRadius4 Font16 BorderCharCoal"
                />
                <button
                  type="button"
                  className="Padding10 Button Font16"
                  onClick={
                    isUpdating
                      ? () => handleUpdateCategory(currentCategoryId)
                      : handleAddCategory
                  }
                >
                  {isUpdating ? "Update Category" : "Add Category"}
                </button>
                {isUpdating && (
                  <button
                    type="button"
                    className="Padding10 Button Font16"
                    onClick={() => {
                      setIsUpdating(false);
                      setCurrentCategoryId(null);
                      setNewCategory("");
                    }}
                  >
                    Cancel Update
                  </button>
                )}
              </div>

              {/* Existing Categories */}
              <div className="MinHeight250 Box100w Padding20 ShadowTernary OverflowYAuto">
                {categories && categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <div
                      key={index}
                      className="Box100w FlexBoxRow justifySpaceBetween AlignItemsCenter Padding10"
                    >
                      <span className="RichBlack">{cat.categoryName}</span>
                      <div className="FlexBoxRow Gap15">
                        <a
                          className="DecorationN BackgroundN CharcoalText"
                          href="#"
                          onClick={() => {
                            setNewCategory(cat.categoryName);
                            setCurrentCategoryId(cat.categoryId);
                            setIsUpdating(true);
                          }}
                        >
                          Update
                        </a>
                        <a
                          className="DecorationN BackgroundN RedText"
                          href="#"
                          onClick={() => handleDeleteCategory(cat.categoryId)}
                        >
                          Delete
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="TextAlignCenter">No categories to display</p>
                )}
              </div>

              <button
                type="button"
                className="Padding10 CursorPointer OutlineN BorderN BgSkyBlueHover Font16 Box100w BgCokeRed BorderRadius4"
                onClick={() => setIsPopupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Author Email */}
        <div className="FormGroup Box100w Gap15 JustifyStart">
          <label htmlFor="authorName">Author</label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter the author's name"
            className="InputField Box100w Padding10 BorderRadius4 Font16 BorderCharCoal"
          />
        </div>

        {/* TinyMCE Editor */}
        <div className="">
          <TinymcePlugins
            setContent={setPostContent}
            initialValue={postContent} // Pass the current post content
          />
        </div>

        {/* Buttons */}
        <div className="FlexBoxRow AlignItemsCenter JustifyCenter AlignContentCenter Gap10">
          <button
            type="button"
            className="Box_15w Padding10 Font16 BgRichBlack PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
            onClick={() => setIsPreviewOpen(true)}
          >
            Preview
          </button>
          <button
            type="submit"
            className="Box_15w Padding10 Font16 BgRichBlack PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
          >
            {isUpdating ? "Update" : "Submit"}
          </button>
          {isUpdating && (
            <button
              type="button"
              className="Box_15w Padding10 Font16 BgRichBlack PreviewButton CursorPointer Transition02 TextAlignCenter OffWhite BorderRadius4 BgSkyBlueHover OutlineN BorderN"
              onClick={handleCancelUpdate}
            >
              Cancel Update
            </button>
          )}
        </div>
      </form>

      {/* Preview Popup */}
      {isPreviewOpen && (
        <div className="PopupOverlay ZIndex1000 Top0 Left0 PositionFixed BgCharCoal FlexBoxColumn JustifyCenter AlignItemsCenter AlignContentCenter Box100wh">
          <div className="OverflowYAuto OverflowXHidden Padding40 BgOffWhite Box_60w MinHeight90 ZIndex1000 PositionRelative AnimationSideIn BorderRadius4">
            <h1 className="Header">{postTitle}</h1>
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt="Preview Thumbnail"
                width={600}
                height={600}
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: postContent }} />
            <button
              type="button"
              className="Padding10 CursorPointer OutlineN BorderN BgSkyBlueHover Font16 Box100w BgCokeRed BorderRadius4"
              onClick={() => setIsPreviewOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* List of posts in table */}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="Box100w OverflowXAuto MaxHeight250">
          <table className="MainTable">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Post Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Added By</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!posts || posts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "10px" }}
                  >
                    Nothing to display!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.postId}</td>
                    <td>{post.postTitle}</td>
                    <td>{post.category}</td>
                    <td>{post.author}</td>
                    <td>{post.addedBy}</td>
                    <td>
                      {new Date(post.postCreatedOn)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </td>
                    <td>
                      <div className="Actions">
                        <Link
                          href="#"
                          className="ActionsLinks DeleteLink"
                          onClick={() => handleDelete(post.postId)}
                        >
                          Delete
                        </Link>
                        <Link
                          href="#"
                          className="ActionsLinks UpdateLink"
                          onClick={() => handleUpdate(post)}
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
  );
}
