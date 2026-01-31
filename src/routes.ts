import { Router } from "express";
import { testToken } from "./modules/auth/auth.controller";
import { getApiAData } from "./modules/external/apiA.controller";
import { apiBWebhook } from "./modules/webhooks/webhook.controller";
import { listProducts } from "./modules/products/product.controller";

const router = Router();

router.get("/auth/test-token", testToken);
router.get("/external/api-a", getApiAData);
router.post("/webhooks/api-b", apiBWebhook);
router.get("/products", listProducts);

export default router;
