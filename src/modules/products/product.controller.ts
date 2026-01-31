import { Request, Response } from "express";
import { getProducts } from "./product.service";

export async function listProducts(req: Request, res: Response) {
  const products = await getProducts(req.query);
  res.json({
    count: products.length,
    items: products,
    nextCursor: products.length ? products[products.length - 1].id : null,
  });
}
