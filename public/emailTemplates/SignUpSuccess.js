import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Img,
  Button,
} from "@react-email/components";

export default function SignUpSuccess({
  recipientName,
  roleAssigned,
  username,
  password,
}) {
  return (
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
          {/* Company Banner */}
          <Img
            src="https://source.unsplash.com/600x200/?corporate,teamwork"
            alt="Company Banner"
            width="100%"
            height="auto"
            style={{ borderRadius: "5px" }}
          />

          {/* Welcome Message */}
          <Heading style={{ color: "#333", marginTop: "20px" }}>
            Now, you are officially added as <strong>{roleAssigned}</strong>.
          </Heading>

          <Text
            style={{ fontSize: "16px", color: "#555", marginBottom: "10px" }}
          >
            Congratulations and welcome aboard, <strong>{recipientName}</strong>
            !
          </Text>

          {/* Detailed Welcome Message */}
          <Text
            style={{ fontSize: "14px", color: "#555", textAlign: "justify" }}
          >
            We are thrilled to officially add you to our team as{" "}
            <strong>{roleAssigned}</strong>. Your selection is a testament to
            your expertise, skills, and the potential we see in you to
            contribute meaningfully to our goals and aspirations. This is not
            just an addition to a role but a valued partnership where your
            individuality and talents will be vital in shaping the future of our
            projects.
          </Text>

          {/* Credentials Section */}
          <Text
            style={{
              fontSize: "14px",
              color: "#555",
              marginTop: "10px",
              textAlign: "justify",
            }}
          >
            To help you get started, please find your login credentials attached
            below. These credentials will grant you access to our systems and
            platforms, ensuring you have all the necessary tools to excel in
            your role. Should you encounter any issues or have questions about
            accessing your account, please do not hesitate to reach out to the
            IT support team or your manager.
          </Text>

          <Text style={{ fontSize: "14px", color: "#555", marginTop: "15px" }}>
            <strong>Username:</strong> {username} <br />
            <strong>Password:</strong> {password}
          </Text>

          {/* Login Button */}
          <Button
            href="http://localhost:3000/admin-signin"
            style={{
              backgroundColor: "#87CEEB",
              color: "#fff",
              fontSize: "16px",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "15px",
            }}
          >
            Login Now
          </Button>

          {/* Signature */}
          <Text style={{ fontSize: "14px", color: "#555", marginTop: "20px" }}>
            Thanks & Regards,
            <br />
            <strong>IndianWriters</strong>
          </Text>

          {/* Disclaimer */}
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
