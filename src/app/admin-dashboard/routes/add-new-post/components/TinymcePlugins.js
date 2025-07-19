import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the TinyMCE Editor to prevent SSR hydration issues
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

const TinymcePlugins = ({ setContent, initialValue }) => {
  const [value, setValue] = useState(initialValue || "");

  // Update the internal state when `initialValue` changes
  useEffect(() => {
    setValue(initialValue || "");
  }, [initialValue]);

  const onEditorInputChange = (newValue) => {
    setValue(newValue);
    setContent(newValue); // Pass content to parent component
  };

  const tinyMceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;

  return (
    <div>
      <Editor
        // apiKey="4mpqlxoscr6reqctmby6pnla7lptwb6qn4mr9yf7gwb3xb1q" 
        apiKey={tinyMceApiKey}
        value={value} // Controlled value
        onEditorChange={onEditorInputChange}
        init={{
          plugins: [
            "fullscreen",
            "image",
            "editimage",
            "accordion",
            "footnotes",
            "lists",
            "advlist",
            "anchor",
            "autolink",
            "code",
            "codesample",
            "emoticons",
            "importcss",
            "insertdatetime",
            "link",
            "media",
            "nonbreaking",
            "pagebreak",
            "preview",
            "table",
            "searchreplace",
            "wordcount",
            "visualchars",
          ],
          toolbar: `
            undo redo |
            blocks |
            bold italic |
            alignleft aligncenter alignright alignjustify |
            bullist numlist outdent indent |
            help
          `,
          images_upload_handler: (blobInfo, success, failure) => {
            console.log("Starting image upload process...");

            const formData = new FormData();
            formData.append("file", blobInfo.blob(), blobInfo.filename());

            console.log("File prepared for upload:", blobInfo.filename());

            // Call the API route
            fetch("/api/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                console.log("API response received:", response);

                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then((data) => {
                console.log("API response data:", data);

                if (data.location) {
                  console.log(
                    "Image uploaded successfully. S3 URL:",
                    data.location
                  );
                  success(data.location); // Use the S3 URL returned by the API
                } else {
                  throw new Error("No location returned from API");
                }
              })
              .catch((err) => {
                console.error("Image upload failed:", err);
                if (typeof failure === "function") {
                  failure("Image upload failed: " + err.message);
                }
              });
          },
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = () => {
                const file = input.files[0];
                const formData = new FormData();
                formData.append("file", file);

                fetch("/api/upload/", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error("Failed to upload image");
                    }
                    return response.json();
                  })
                  .then((data) => {
                    callback(data.location, { alt: file.name });
                  })
                  .catch((err) => {
                    console.error("Error uploading file:", err);
                  });
              };
              input.click();
            }
          },
          content_style:
            "body { line-height: 0.8; font-family: Arial, sans-serif; }",
        }}
      />
    </div>
  );
};

export default TinymcePlugins;
