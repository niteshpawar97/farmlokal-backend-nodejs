import { Request, Response, NextFunction } from "express";
import { trackRequest } from "../modules/metrics/metrics.service";

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const endpoint = `${req.method} ${req.route?.path || req.path}`;
    trackRequest(endpoint, duration);
  });

  next();
}
