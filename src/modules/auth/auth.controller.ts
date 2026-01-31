import { Request, Response } from "express";
import { getAccessToken } from "./token.service";

export async function testToken(req: Request, res: Response) {
  const token = await getAccessToken();
  res.json({ accessToken: token });
}
