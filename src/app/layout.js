/**
 * Root Layout Component
 * 
 * This is the foundational layout component that wraps all pages in the application.
 * It handles:
 * - Font loading optimization
 * - Global metadata configuration
 * - Basic document structure
 * - Client-side loading states
 * 
 * Key Optimizations:
 * - Next.js font optimization
 * - Comprehensive SEO metadata
 * - Responsive favicon configuration
 * - Loading state management
 */

import { Sour_Gummy } from "next/font/google";
import "./styles/globals.css";
import ClientLoaderWrapper from "./components/loader/client-loader-wrapper";

// Initialize optimized font loader (must use direct literals)
const sourGummy = Sour_Gummy({
  weight: "200",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sour-gummy",
  adjustFontFallback: false,
});

// Environment Configuration
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const SITE_NAME = "ReadinSpeed";
const DEFAULT_DESCRIPTION = "Professional blog platform for modern content creators";

/**
 * Application Metadata
 * 
 * Comprehensive SEO configuration following Next.js 13+ metadata standards.
 * Includes:
 * - Default and template-based titles
 * - OpenGraph and Twitter card configurations
 * - Robot directives for search engines
 * - Favicon and Apple Touch icon configurations
 */
export const metadata = {
  // Core Metadata
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ${DEFAULT_DESCRIPTION}`,
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: ["/twitter-image.jpg"],
  },

  // Search Engine Directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons Configuration
  icons: {
    icon: [
      // Standard sizes
      { url: "/icons/triplelines-title-icon-v0.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/triplelines-title-icon-v0.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/triplelines-title-icon-v0.png", sizes: "48x48", type: "image/png" },
      // Your existing 62x62 size
      { url: "/icons/triplelines-title-icon-v0.png", sizes: "62x62", type: "image/png" },
      // SVG version if available (recommended to add)
      // { url: "/icons/triplelines-title-icon-v0.svg", type: "image/svg+xml" },
    ],
    apple: [
      // Apple recommended sizes
      { url: "/icons/triplelines-title-icon-v0.png", sizes: "180x180" },
    ],
    shortcut: ["/icons/triplelines-title-icon-v0.png"],
  },

  // Additional Metadata
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
};

/**
 * RootLayout Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root layout structure
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={sourGummy.variable}
      suppressHydrationWarning
    >
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>

      <body className="min-h-screen antialiased">
        <ClientLoaderWrapper>
          {children}
        </ClientLoaderWrapper>
      </body>
    </html>
  );
}