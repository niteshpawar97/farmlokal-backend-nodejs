import crypto from "crypto";
import { sequelize } from "../../config/mysql";

export async function processWebhookEvent(eventId: string, payload: any) {
  // 1️⃣ Check if event already processed
  const [results] = await sequelize.query(
    "SELECT id FROM webhook_events WHERE event_id = ?",
    { replacements: [eventId] }
  );

  if ((results as any[]).length > 0) {
    console.log("⚠️ Duplicate webhook event ignored:", eventId);
    return;
  }

  // 2️⃣ Process event (business logic placeholder)
  console.log("✅ Processing webhook event:", eventId);

  // 3️⃣ Store event as processed
  const payloadHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  await sequelize.query(
    "INSERT INTO webhook_events (event_id, payload_hash) VALUES (?, ?)",
    { replacements: [eventId, payloadHash] }
  );
}
