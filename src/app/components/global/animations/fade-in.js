"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import styles from "./fade-in.module.css";

export default function FadeInSection({ children }) {
    const domRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const handleIntersection = useCallback((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: "0px 0px -10% 0px", // Optional: fine-tunes reveal timing
        });

        const node = domRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
            observer.disconnect();
        };
    }, [handleIntersection]);

    return (
        <div
            ref={domRef}
            className={[
                styles["fade-in-section"],
                isVisible ? styles["is-visible"] : "",
            ].join(" ")}
        >
            {children}
        </div>
    );
}

