import { Router } from "express";
import { asyncHandler } from "./utils/asyncHandler";
import { testToken } from "./modules/auth/auth.controller";
import { getApiAData } from "./modules/external/apiA.controller";
import { apiBWebhook } from "./modules/webhooks/webhook.controller";
import { listProducts } from "./modules/products/product.controller";
import { showMetrics } from "./modules/metrics/metrics.controller";

const router = Router();

router.get("/auth/test-token", asyncHandler(testToken));
router.get("/external/api-a", asyncHandler(getApiAData));
router.post("/webhooks/api-b", asyncHandler(apiBWebhook));
router.get("/products", asyncHandler(listProducts));
router.get("/metrics", asyncHandler(showMetrics));

export default router;
