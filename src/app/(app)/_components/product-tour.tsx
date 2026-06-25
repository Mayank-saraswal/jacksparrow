"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function ProductTour() {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hedwigs_tour_completed");
    if (hasSeenTour) return;

    const timer = setTimeout(() => {
      const dynamicSteps: any[] = [];

      if (document.querySelector("#tour-sidebar")) {
        dynamicSteps.push({
          element: "#tour-sidebar",
          popover: {
            title: "Your Command Center",
            description: "Access your Inbox, Calendar, Team, and Integrations all from this central sidebar. Everything you need is one click away.",
            side: "right",
            align: "start",
          },
        });
      }

      if (document.querySelector("#tour-chat")) {
        dynamicSteps.push({
          element: "#tour-chat",
          popover: {
            title: "Meet Your AI Assistant",
            description: "This isn't just a chat box. Ask it to 'schedule a meeting with Bob' or 'draft a reply', and it will orchestrate your inbox for you.",
            side: "left",
            align: "center",
          },
        });
      }

      if (document.querySelector("#tour-dock")) {
        dynamicSteps.push({
          element: "#tour-dock",
          popover: {
            title: "Quick Actions & AI",
            description: "Access your pending tasks and your AI assistant from here at any time. (Tip: Hit Cmd+K anywhere to open the command menu!)",
            side: "left",
            align: "end",
          },
        });
      }

      if (dynamicSteps.length === 0) return;

      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: false,
        popoverClass: "driverjs-theme-dark",
        steps: dynamicSteps,
        onDestroyStarted: () => {
          if (driverObj.hasNextStep()) {
            driverObj.destroy();
          } else {
            localStorage.setItem("hedwigs_tour_completed", "true");
            driverObj.destroy();
          }
        },
      });

      driverObj.drive();
    }, 1500); // Small delay to let the dashboard finish loading

    return () => clearTimeout(timer);
  }, []);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .driverjs-theme-dark {
        background-color: #0a0a0a !important;
        color: #ededed !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,76,0, 0.1) !important;
        font-family: var(--font-geist-sans), sans-serif !important;
      }
      .driverjs-theme-dark .driver-popover-title {
        font-size: 16px !important;
        font-weight: 600 !important;
        color: #ffffff !important;
        margin-bottom: 8px !important;
        letter-spacing: -0.02em !important;
      }
      .driverjs-theme-dark .driver-popover-description {
        font-size: 13px !important;
        color: #a3a3a3 !important;
        line-height: 1.5 !important;
      }
      .driverjs-theme-dark .driver-popover-footer {
        margin-top: 20px !important;
      }
      .driverjs-theme-dark .driver-popover-progress-text {
        color: #888888 !important;
        font-size: 12px !important;
      }
      .driverjs-theme-dark .driver-popover-prev-btn {
        color: #a3a3a3 !important;
        text-shadow: none !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        background-color: transparent !important;
        border-radius: 6px !important;
        padding: 4px 10px !important;
        font-size: 12px !important;
      }
      .driverjs-theme-dark .driver-popover-next-btn {
        background-color: #FF4C00 !important;
        color: #ffffff !important;
        text-shadow: none !important;
        border: none !important;
        border-radius: 6px !important;
        padding: 5px 12px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
      }
      .driverjs-theme-dark .driver-popover-next-btn:hover {
        background-color: #e64400 !important;
      }
      .driverjs-theme-dark .driver-popover-close-btn {
        color: #888888 !important;
        top: 12px !important;
        right: 12px !important;
      }
      .driverjs-theme-dark .driver-popover-arrow {
        border-color: #0a0a0a !important;
      }
      div#driver-page-overlay {
        background: rgba(0, 0, 0, 0.75) !important;
        backdrop-filter: blur(2px) !important;
      }
    `}} />
  );
}
