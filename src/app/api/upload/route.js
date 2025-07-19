import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  console.log("API route called: /api/upload");

  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      console.error("No file provided in the request");
      return new Response(JSON.stringify({ message: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("File received:", file.name, "Type:", file.type);

    // Generate a unique file name (without modifying spaces or special characters)
    const fileName = `${Date.now()}-${file.name}`; // Keep the original file name
    console.log("Generated file name for S3:", fileName);

    // Upload the file to S3 and make it publicly accessible
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName, // Use the original file name
      ContentType: file.type,
      Body: await file.arrayBuffer(), // Directly upload the file
      ACL: "public-read", // Make the object publicly accessible
    });

    console.log("Uploading file to S3...");
    await s3Client.send(uploadCommand);
    console.log("File uploaded successfully to S3");

    // Construct the actual S3 URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(fileName)}`;
    console.log("S3 file URL:", fileUrl);

    return new Response(JSON.stringify({ location: fileUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/upload route:", error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}