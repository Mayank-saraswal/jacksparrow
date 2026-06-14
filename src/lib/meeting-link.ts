/**
 * Pure helpers for embedding a created meeting's join details into a calendar
 * event before the event is created. Works the same regardless of mail/calendar
 * provider (Gmail or Outlook).
 */
export type MeetingProviderId = "none" | "zoom" | "teams" | "meet";

export interface MeetingDetails {
  provider: Exclude<MeetingProviderId, "none">;
  joinUrl: string;
  dialIn?: string | null;
  password?: string | null;
}

/** A Google Calendar conferenceData.createRequest for a native Google Meet. */
export function meetCreateRequest(requestId: string): {
  conferenceData: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: { type: "hangoutsMeet" };
    };
  };
} {
  return {
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };
}

interface CalEventEntryPoint {
  entryPointType?: string;
  uri?: string;
}

/** Extract the Meet join URL from a created Google Calendar event response. */
export function extractMeetLink(event: {
  hangoutLink?: string;
  conferenceData?: { entryPoints?: CalEventEntryPoint[] };
}): string | null {
  if (event.hangoutLink) return event.hangoutLink;
  const video = event.conferenceData?.entryPoints?.find(
    (e) => e.entryPointType === "video" && typeof e.uri === "string",
  );
  return video?.uri ?? null;
}

/** Append a formatted "Join" block to an event description. */
export function injectMeetingIntoDescription(
  description: string | undefined,
  meeting: MeetingDetails,
): string {
  const label = meeting.provider === "zoom" ? "Zoom" : "Microsoft Teams";
  const lines = [`${label} meeting`, `Join: ${meeting.joinUrl}`];
  if (meeting.password) lines.push(`Passcode: ${meeting.password}`);
  if (meeting.dialIn) lines.push(`Dial-in: ${meeting.dialIn}`);
  const block = lines.join("\n");
  const base = (description ?? "").trim();
  return base ? `${base}\n\n${block}` : block;
}

/**
 * Google Calendar conferenceData entry point for a non-Google meeting URL, so
 * the join link is a first-class "video" entry (not just text in the body).
 */
export function meetingConferenceData(meeting: MeetingDetails): {
  conferenceData: {
    conferenceSolution: { name: string };
    entryPoints: { entryPointType: "video"; uri: string }[];
  };
} {
  return {
    conferenceData: {
      conferenceSolution: {
        name: meeting.provider === "zoom" ? "Zoom" : "Microsoft Teams",
      },
      entryPoints: [{ entryPointType: "video", uri: meeting.joinUrl }],
    },
  };
}
