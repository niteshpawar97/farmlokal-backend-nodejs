import { Request, Response } from "express";
import { fetchApiAData } from "./apiA.service";

export async function getApiAData(req: Request, res: Response) {
  try {
    const data = await fetchApiAData();
    res.json({ source: "api-a", count: data.length });
  } catch (err) {
    res.status(502).json({ error: "External API A failed" });
  }
}
