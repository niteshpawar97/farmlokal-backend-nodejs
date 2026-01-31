import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 20,          // 20 virtual users
  duration: "30s",  // 30 seconds
};

export default function () {
  // random cursor for deep pagination
  const cursor = Math.floor(Math.random() * 1000000) + 1;

  const res = http.get(
    `http://localhost:3000/products?cursor=${cursor}&limit=20`
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 200ms": (r) => r.timings.duration < 200,
  });

  sleep(1);
}
