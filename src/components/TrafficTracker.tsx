"use client";

import { useEffect } from "react";

interface TrafficTrackerProps {
  path: string;
}

export default function TrafficTracker({ path }: { path: string }) {
  useEffect(() => {
    let sessionId = "";
    if (typeof window !== "undefined") {
      sessionId = localStorage.getItem("aura_session_id") || "";
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("aura_session_id", sessionId);
      }
    }
    
    let deviceType = "desktop";
    if (typeof window !== "undefined" && window.navigator) {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes("mobi") || ua.includes("android") || ua.includes("iphone")) {
        deviceType = "mobile";
      } else if (ua.includes("tablet") || ua.includes("ipad")) {
        deviceType = "tablet";
      }
    }

    const refVal = typeof document !== "undefined" ? document.referrer : "direct";

    fetch("/api/traffic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "page_view",
        page_path: path,
        session_id: sessionId,
        device_type: deviceType,
        referrer: refVal || "direct"
      })
    }).catch(err => {
      console.error("Failed to report traffic event:", err);
    });
  }, [path]);

  return null;
}
