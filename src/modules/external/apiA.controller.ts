import { Request, Response } from "express";
import { fetchApiAData } from "./apiA.service";

export async function getApiAData(req: Request, res: Response) {
  const data = await fetchApiAData();
  res.json({ source: "api-a", count: data.length });
}
