import { describe, it, expect } from "vitest";

import {
  injectMeetingIntoDescription,
  meetingConferenceData,
  meetCreateRequest,
  extractMeetLink,
} from "./meeting-link";

describe("injectMeetingIntoDescription", () => {
  it("appends a join block to an existing description", () => {
    const out = injectMeetingIntoDescription("Agenda: planning", {
      provider: "zoom",
      joinUrl: "https://zoom.us/j/123",
      password: "secret",
    });
    expect(out).toContain("Agenda: planning");
    expect(out).toContain("Zoom meeting");
    expect(out).toContain("Join: https://zoom.us/j/123");
    expect(out).toContain("Passcode: secret");
  });

  it("works with no prior description", () => {
    const out = injectMeetingIntoDescription(undefined, {
      provider: "teams",
      joinUrl: "https://teams.microsoft.com/l/x",
    });
    expect(out.startsWith("Microsoft Teams meeting")).toBe(true);
    expect(out).toContain("https://teams.microsoft.com/l/x");
  });

  it("includes dial-in when present", () => {
    const out = injectMeetingIntoDescription("", {
      provider: "zoom",
      joinUrl: "https://zoom.us/j/9",
      dialIn: "+1-555-0100",
    });
    expect(out).toContain("Dial-in: +1-555-0100");
  });
});

describe("meetingConferenceData", () => {
  it("builds a video entry point", () => {
    const cd = meetingConferenceData({
      provider: "zoom",
      joinUrl: "https://zoom.us/j/1",
    });
    expect(cd.conferenceData.conferenceSolution.name).toBe("Zoom");
    expect(cd.conferenceData.entryPoints[0]).toEqual({
      entryPointType: "video",
      uri: "https://zoom.us/j/1",
    });
  });
});

describe("Google Meet helpers", () => {
  it("builds a hangoutsMeet createRequest", () => {
    const req = meetCreateRequest("req-123");
    expect(req.conferenceData.createRequest.requestId).toBe("req-123");
    expect(req.conferenceData.createRequest.conferenceSolutionKey.type).toBe(
      "hangoutsMeet",
    );
  });

  it("prefers hangoutLink for the join URL", () => {
    expect(
      extractMeetLink({ hangoutLink: "https://meet.google.com/abc-defg-hij" }),
    ).toBe("https://meet.google.com/abc-defg-hij");
  });

  it("falls back to the video entry point", () => {
    expect(
      extractMeetLink({
        conferenceData: {
          entryPoints: [
            { entryPointType: "more", uri: "https://x" },
            { entryPointType: "video", uri: "https://meet.google.com/zzz" },
          ],
        },
      }),
    ).toBe("https://meet.google.com/zzz");
  });

  it("returns null when there's no meeting", () => {
    expect(extractMeetLink({})).toBeNull();
    expect(extractMeetLink({ conferenceData: { entryPoints: [] } })).toBeNull();
  });
});
