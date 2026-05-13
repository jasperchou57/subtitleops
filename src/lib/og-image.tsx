import { ImageResponse } from "next/og";

export const subtitleOpsOgSize = { width: 1200, height: 630 };
export const subtitleOpsOgContentType = "image/png";

type SubtitleOpsOgImageOptions = {
  title: string;
  description: string;
  chips: string[];
};

export function createSubtitleOpsOgImage({
  title,
  description,
  chips,
}: SubtitleOpsOgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#09090b",
          color: "#fafafa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              border: "2px solid #a1a1aa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              paddingLeft: 10,
              paddingBottom: 9,
              gap: 5,
            }}
          >
            <div style={{ width: 30, height: 6, background: "#fafafa", borderRadius: 3 }} />
            <div style={{ width: 18, height: 6, background: "#fafafa", borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 0 }}>
            SubtitleOps
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              maxWidth: 940,
              fontSize: 58,
              fontWeight: 750,
              lineHeight: 1.08,
              letterSpacing: 0,
            }}
          >
            {title}
          </div>
          <div
            style={{
              maxWidth: 860,
              marginTop: 24,
              fontSize: 25,
              lineHeight: 1.35,
              color: "#d4d4d8",
              letterSpacing: 0,
            }}
          >
            {description}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                border: "1px solid #3f3f46",
                borderRadius: 999,
                padding: "10px 18px",
                fontSize: 22,
                color: "#e4e4e7",
                background: "#18181b",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    subtitleOpsOgSize
  );
}
