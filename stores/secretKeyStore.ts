import { IS_BROWSER } from "$fresh/runtime.ts";

const SECRET_KEY_STORAGE_KEY = "secretKey";
const timeout = 1000 * 60 * 60 * 24 * 30; // 30 days

const setSecretKey = (key: string) => {
  if (IS_BROWSER) {
    localStorage.setItem(SECRET_KEY_STORAGE_KEY, key);

    // Calculate the expiration timestamp
    const expirationTimestamp = Date.now() + timeout;

    // Store the expiration timestamp in localStorage
    localStorage.setItem(
      `${SECRET_KEY_STORAGE_KEY}_expiration`,
      expirationTimestamp.toString(),
    );
  }
};

const getSecretKey = (): string | null => {
  if (IS_BROWSER) {
    const expirationTimestamp = localStorage.getItem(
      `${SECRET_KEY_STORAGE_KEY}_expiration`,
    );

    if (expirationTimestamp && Date.now() > parseInt(expirationTimestamp)) {
      localStorage.removeItem(SECRET_KEY_STORAGE_KEY);
      localStorage.removeItem(`${SECRET_KEY_STORAGE_KEY}_expiration`);
      return null;
    }
    return localStorage.getItem(SECRET_KEY_STORAGE_KEY);
  }

  return null;
};

export { getSecretKey, setSecretKey };
