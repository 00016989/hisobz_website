"use server";

// Bog'lanish formasi — Telegram'ga yuboradi. TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
// o'rnatilsa haqiqiy xabar; bo'lmasa demo rejim (faqat log). Boshqa bog'liqlik yo'q.

export type ContactState = { ok: boolean; message: string } | null;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, 1000);

async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log(`[Telegram demo] (${text.length} belgi)`);
    return;
  }
  try {
    const ac = new AbortController();
    const tmo = setTimeout(() => ac.abort(), 8000);
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: ac.signal,
    }).finally(() => clearTimeout(tmo));
  } catch (e) {
    console.error("[contact] Telegram xatosi:", e);
  }
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const business = String(formData.get("business") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const lang = String(formData.get("lang") ?? "uz").trim();

  // Honeypot — bot to'ldirsa jim qaytamiz.
  if (String(formData.get("company_url") ?? "").trim()) return { ok: true, message: "ok" };

  if (name.length < 2 || phone.length < 5) {
    return { ok: false, message: "invalid" };
  }

  const text =
    `<b>Hisobz — yangi murojaat</b>\n` +
    `Ism: ${esc(name)}\n` +
    `Telefon: ${esc(phone)}\n` +
    (business ? `Biznes: ${esc(business)}\n` : "") +
    (message ? `Xabar: ${esc(message)}\n` : "") +
    `<i>til: ${esc(lang)}</i>`;

  await sendTelegram(text);
  return { ok: true, message: "ok" };
}
