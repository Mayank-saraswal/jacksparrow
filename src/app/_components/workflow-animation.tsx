"use client";

import React from "react";

export function WorkflowAnimation() {
  return (
    <div className="w-full max-w-5xl mx-auto flex justify-center items-center py-12 relative overflow-hidden">
      <svg
        viewBox="0 0 800 400"
        className="w-full h-auto overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="line-grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(255, 76, 0, 0.4)" />
          </linearGradient>
          
          <linearGradient id="line-grad-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 76, 0, 0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Paths */}
        <path id="path-gmail" d="M 150 100 C 250 100, 300 200, 380 200" fill="none" stroke="url(#line-grad-left)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path id="path-outlook" d="M 100 200 C 200 200, 300 200, 380 200" fill="none" stroke="url(#line-grad-left)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path id="path-zendesk" d="M 150 300 C 250 300, 300 200, 380 200" fill="none" stroke="url(#line-grad-left)" strokeWidth="1.5" strokeDasharray="4 4" />

        <path id="path-cal" d="M 420 200 C 500 200, 550 100, 650 100" fill="none" stroke="url(#line-grad-right)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path id="path-jira" d="M 420 200 C 500 200, 600 200, 700 200" fill="none" stroke="url(#line-grad-right)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path id="path-notion" d="M 420 200 C 500 200, 550 300, 650 300" fill="none" stroke="url(#line-grad-right)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Animated Packets */}
        <circle r="3" fill="#FF4C00" filter="url(#glow)">
          <animateMotion dur="2.5s" repeatCount="indefinite" path="M 150 100 C 250 100, 300 200, 380 200" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        
        <circle r="3" fill="#FF4C00" filter="url(#glow)">
          <animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M 100 200 C 200 200, 300 200, 380 200" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>

        <circle r="3" fill="#FF4C00" filter="url(#glow)">
          <animateMotion dur="2.2s" begin="0.5s" repeatCount="indefinite" path="M 150 300 C 250 300, 300 200, 380 200" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.2s" begin="0.5s" repeatCount="indefinite" />
        </circle>

        <circle r="3" fill="#FF4C00" filter="url(#glow)">
          <animateMotion dur="2.5s" begin="1.2s" repeatCount="indefinite" path="M 420 200 C 500 200, 550 100, 650 100" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
        </circle>

        <circle r="3" fill="#FF4C00" filter="url(#glow)">
          <animateMotion dur="2s" begin="2s" repeatCount="indefinite" path="M 420 200 C 500 200, 600 200, 700 200" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2s" begin="2s" repeatCount="indefinite" />
        </circle>

        <circle r="3" fill="#FF4C00" filter="url(#glow)">
          <animateMotion dur="2.8s" begin="0.8s" repeatCount="indefinite" path="M 420 200 C 500 200, 550 300, 650 300" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="2.8s" begin="0.8s" repeatCount="indefinite" />
        </circle>

        {/* Nodes */}
        
        {/* Center Node */}
        <g transform="translate(400, 200)">
          <circle r="48" fill="rgba(255, 76, 0, 0.05)" stroke="rgba(255, 76, 0, 0.2)" strokeWidth="1">
            <animate attributeName="r" values="48;56;48" dur="3s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="38" className="fill-background stroke-border" strokeWidth="1" />
          <image href="/logo/FIRE_SVG_Animated.svg" x="-24" y="-24" width="48" height="48" />
        </g>

        {/* Input Nodes */}
        <g transform="translate(150, 100)">
          <circle r="26" className="fill-background stroke-border" strokeWidth="1" />
          <image href="/logo/gmail.svg" x="-14" y="-14" width="28" height="28" />
        </g>

        <g transform="translate(100, 200)">
          <circle r="26" className="fill-background stroke-border" strokeWidth="1" />
          <image href="/logo/outlook.svg" x="-14" y="-14" width="28" height="28" />
        </g>

        <g transform="translate(150, 300)">
          <circle r="26" className="fill-background stroke-border" strokeWidth="1" />
          <image href="/logo/zendesk-icon.svg" x="-14" y="-14" width="28" height="28" />
        </g>

        {/* Output Nodes */}
        <g transform="translate(650, 100)">
          <circle r="26" className="fill-background stroke-border" strokeWidth="1" />
          <image href="/logo/google-calendar.svg" x="-14" y="-14" width="28" height="28" />
        </g>

        <g transform="translate(700, 200)">
          <circle r="26" className="fill-background stroke-border" strokeWidth="1" />
          <image href="/logo/jira.png" x="-14" y="-14" width="28" height="28" />
        </g>

        <g transform="translate(650, 300)">
          <circle r="26" className="fill-background stroke-border" strokeWidth="1" />
          <image href="/logo/notion.png" x="-14" y="-14" width="28" height="28" />
        </g>

        {/* Labels */}
        <text x="130" y="30" className="fill-muted-foreground font-mono text-[11px]" letterSpacing="1">INCOMING SIGNALS</text>
        <text x="400" y="280" fill="rgba(255,76,0,0.8)" className="font-mono text-[11px]" textAnchor="middle" letterSpacing="1">AGENT INTELLIGENCE</text>
        <text x="670" y="30" className="fill-muted-foreground font-mono text-[11px]" textAnchor="end" letterSpacing="1">DRAFTED ACTIONS</text>

      </svg>
    </div>
  );
}
