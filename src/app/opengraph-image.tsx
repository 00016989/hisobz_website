import { ImageResponse } from "next/og";

// Ulashilganda (Telegram/WhatsApp/ijtimoiy tarmoq) chiroyli brend kartasi chiqadi.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Hisobz — Savdo, ombor va kassa tizimi";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#fb923c 0%,#ea580c 58%,#9a3412 100%)",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 104,
              height: 104,
              borderRadius: 28,
              background: "rgba(255,255,255,0.18)",
              color: "#fff",
              fontSize: 68,
              fontWeight: 800,
            }}
          >
            H
          </div>
          <div style={{ color: "#fff", fontSize: 60, fontWeight: 800 }}>Hisobz</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ color: "#fff", fontSize: 66, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Savdo, ombor va kassa — bitta tizimda
          </div>
          <div style={{ color: "rgba(255,255,255,0.88)", fontSize: 32 }}>
            POS · Ombor · CRM · Marketing · Moliya · Oflayn
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {["Payme", "Click", "soliq.uz", "Eskiz", "Uzum"].map((x) => (
            <div
              key={x}
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.16)",
                color: "#fff",
                fontSize: 26,
                padding: "10px 24px",
                borderRadius: 999,
              }}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
