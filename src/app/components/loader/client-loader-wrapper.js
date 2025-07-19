"use client";
import { useEffect, useState } from "react";
import Loader from "./loader";

export default function ClientLoaderWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000); // Adjust as needed
    return () => clearTimeout(timeout);
  }, []);

  return isLoading ? <Loader /> : children;
}
