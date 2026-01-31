export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 200
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;

    await sleep(delay);
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
