import "server-only";

function getBaseUrl() {
  return process.env.BACKEND_URL || "http://localhost:4000";
}

export async function backendFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: init?.cache ?? "no-store",
  });

  if (!response.ok) {
    let message = `Backend request failed with ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
