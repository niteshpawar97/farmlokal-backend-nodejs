import { Request, Response } from "express";
import { getAccessToken } from "./token.service";

export async function testToken(req: Request, res: Response) {
  try {
    const token = await getAccessToken();
    res.json({ accessToken: token });
  } catch (error) {
    res.status(500).json({ error: "Token fetch failed" });
  }
}
