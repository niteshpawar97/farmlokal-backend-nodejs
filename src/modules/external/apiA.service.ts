import axios from "axios";
import { retryWithBackoff } from "../../utils/retry";

// Fake public API
const API_A_URL = "https://jsonplaceholder.typicode.com/posts";
//Force failure: /invalid
// //Force success: /posts
export async function fetchApiAData() {
  return retryWithBackoff(async () => {
    const response = await axios.get(API_A_URL, {
      timeout: 2000, // ⏱️ timeout handling
    });

    return response.data;
  });
}
