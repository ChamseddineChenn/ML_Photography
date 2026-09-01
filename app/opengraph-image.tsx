import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/metadata";

const HERO_PATH = path.join(process.cwd(), "public", "assets", "hero", "hero-8-dusk.jpg");

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const buffer = await readFile(HERO_PATH);
  const heroSrc = `data:image/jpeg;base64,${buffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#0C0A15",
          position: "relative",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 55%",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(5,4,12,0.92) 0%, rgba(5,4,12,0.5) 42%, rgba(5,4,12,0.1) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "56px 64px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#DD7D3B",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            ML Photography
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 300,
              color: "#EFE6E0",
              lineHeight: 1.02,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Malek Larif
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(239,230,224,0.9)",
              maxWidth: 720,
              lineHeight: 1.35,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Photographs of the last light. Prints from the person who took them.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
