import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Img,
} from "@react-email/components";

export default function generateEmailHtml(otp) {
  return ReactDOMServer.renderToString(
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          padding: "20px",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "5px",
            textAlign: "center",
            maxWidth: "500px",
            margin: "auto",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Text
            style={{ fontSize: "14px", color: "#555", marginBottom: "15px" }}
          >
            As part of our security measures, we require you to verify your
            email address by entering the OTP provided below. This ensures the
            safety of your account and enhances our authentication process.
          </Text>

          <Img
            src="https://yourdomain.com/path/to/uploaded/image.png"
            alt="Company Banner"
            width="100%"
            height="auto"
            style={{ borderRadius: "5px", marginBottom: "20px" }}
          />

          <Heading style={{ color: "#333", marginTop: "20px" }}>
            Use Code: <strong style={{ color: "#007bff" }}>{otp}</strong>
          </Heading>

          <Text style={{ fontSize: "16px", color: "#555", marginTop: "10px" }}>
            Sign in to your <strong>IndianWriters</strong> account securely.
          </Text>

          <Text
            style={{
              fontSize: "12px",
              color: "#777",
              marginTop: "20px",
              textAlign: "justify",
            }}
          >
            <strong>Disclaimer:</strong> This email and its attachments are
            intended solely for the recipient and may contain highly
            confidential information. If you are not the intended recipient,
            please notify the sender immediately, delete this email and all
            attachments from your system, and refrain from using, copying, or
            distributing its contents. Unauthorized access or misuse of this
            communication may violate laws or regulations and could result in
            legal consequences.
            <br />
            <br />
            If you have received this email in error or have concerns about its
            contents, please contact us at
            <a
              href="mailto:support@indianwriters.com"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              {" "}
              support@indianwriters.com
            </a>
            . Thank you for safeguarding the confidentiality of this
            communication.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}