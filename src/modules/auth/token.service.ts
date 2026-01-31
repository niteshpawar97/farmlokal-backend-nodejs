import axios from "axios";
import { redis } from "../../config/redis";
import { oauthConfig } from "../../config/oauth";

const TOKEN_KEY = "oauth:access_token";
const LOCK_KEY = "oauth:lock";

export async function getAccessToken(): Promise<string> {
  // 1️⃣ Check Redis cache
  const cachedToken = await redis.get(TOKEN_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  // 2️⃣ Acquire lock (NX = only if not exists)
  const lock = await redis.set(LOCK_KEY, "1", "EX", 5, "NX");

  if (!lock) {
    // Someone else is fetching token → wait & retry
    await sleep(200);
    return getAccessToken();
  }

  try {
    // 3️⃣ Fetch token from OAuth provider
    // const response = await axios.post(oauthConfig.tokenUrl, {
    //   grant_type: "client_credentials",
    //   client_id: oauthConfig.clientId,
    //   client_secret: oauthConfig.clientSecret,
    // });

    
const response = {
  data: await fetchOAuthToken(),
};

    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in; // seconds

    // 4️⃣ Store token with buffer (refresh before expiry)
    await redis.setex(
      TOKEN_KEY,
      expiresIn - 60, // safety buffer
      accessToken
    );

    return accessToken;
  } finally {
    // 5️⃣ Release lock
    await redis.del(LOCK_KEY);
  }
}

// 🔴 TEMP MOCK (for assignment)
async function fetchOAuthToken() {
  return {
    access_token: "mock-access-token-" + Date.now(),
    expires_in: 3600, // 1 hour
  };
}


function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
