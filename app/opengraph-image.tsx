import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Niken Bakery — Katalog Kue UMKM";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF4E0",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative Outer Border Box */}
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            border: "8px solid #2B1B17",
            borderRadius: "32px",
            boxShadow: "16px 16px 0px #2B1B17",
            padding: "40px 60px",
            textAlign: "center",
          }}
        >
          {/* Sticker Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FF8FAB",
              border: "4px solid #2B1B17",
              borderRadius: "16px",
              padding: "10px 24px",
              fontSize: "24px",
              fontWeight: 900,
              color: "#2B1B17",
              boxShadow: "4px 4px 0px #2B1B17",
              transform: "rotate(-2deg)",
              marginBottom: "28px",
            }}
          >
            🎂 KATALOG KUE UMKM KEKINIAN
          </div>

          {/* Main Title */}
          <div
            style={{
              fontSize: "76px",
              fontWeight: 900,
              color: "#2B1B17",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "16px",
            }}
          >
            Niken Bakery
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "30px",
              fontWeight: 600,
              color: "#2B1B17",
              opacity: 0.85,
              maxWidth: "850px",
              lineHeight: 1.3,
              marginBottom: "36px",
            }}
          >
            Kue lezat, freshly baked setiap hari. Pesan langsung via WhatsApp tanpa ribet!
          </div>

          {/* Bottom Badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#25D366",
                border: "4px solid #2B1B17",
                borderRadius: "999px",
                padding: "12px 28px",
                fontSize: "24px",
                fontWeight: 900,
                color: "#FFFFFF",
                boxShadow: "4px 4px 0px #2B1B17",
              }}
            >
              💬 Order via WhatsApp
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#FFD93D",
                border: "4px solid #2B1B17",
                borderRadius: "999px",
                padding: "12px 28px",
                fontSize: "24px",
                fontWeight: 900,
                color: "#2B1B17",
                boxShadow: "4px 4px 0px #2B1B17",
              }}
            >
              🍰 Ready & Pre-order
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

