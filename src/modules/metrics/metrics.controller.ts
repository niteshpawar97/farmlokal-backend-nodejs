import { Request, Response } from "express";
import { getMetrics } from "./metrics.service";

export async function showMetrics(req: Request, res: Response) {
  const metrics = await getMetrics();
  res.json(metrics);
}
