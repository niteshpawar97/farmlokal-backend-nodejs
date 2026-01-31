import { Request, Response } from "express";
import { processWebhookEvent } from "./webhook.service";

export async function apiBWebhook(req: Request, res: Response) {
  const eventId = req.headers["x-event-id"] as string;

  if (!eventId) {
    return res.status(400).json({ error: "Missing event ID" });
  }

  await processWebhookEvent(eventId, req.body);

  // Respond fast (important for retries)
  res.status(200).json({ status: "ok" });
}
