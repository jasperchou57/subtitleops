import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon. iOS automatically applies a rounded mask, so the
 * source is a square dark zinc tile with two stacked subtitle lines that
 * mirror the SVG favicon. Scale: 16-unit favicon × 11.25 ≈ 180px target.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#18181b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingLeft: 34,
          paddingBottom: 23,
          gap: 11,
        }}
      >
        <div
          style={{
            width: 112,
            height: 22,
            background: "#fafafa",
            borderRadius: 11,
          }}
        />
        <div
          style={{
            width: 68,
            height: 22,
            background: "#fafafa",
            borderRadius: 11,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
