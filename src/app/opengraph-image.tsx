import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SubtitleOps — Free Online Subtitle Converter & Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #09090b 0%, #18181b 50%, #09090b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              border: "2px solid #a1a1aa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#fafafa",
            }}
          >
            S
          </div>
          <span
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.02em",
            }}
          >
            SubtitleOps
          </span>
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            letterSpacing: "-0.02em",
          }}
        >
          Free Online Subtitle Converter & Tools
        </div>
        <div
          style={{
            fontSize: "22px",
            color: "#71717a",
            marginTop: "24px",
            display: "flex",
            gap: "16px",
          }}
        >
          <span>SRT</span>
          <span>·</span>
          <span>ASS</span>
          <span>·</span>
          <span>VTT</span>
          <span>·</span>
          <span>TXT</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
