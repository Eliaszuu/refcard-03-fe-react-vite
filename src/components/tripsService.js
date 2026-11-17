const baseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");

export async function getBusinessTrips({signal} = {}) {
  const response = await fetch(`${baseUrl}/v1/trips`, {signal});
  if (!response.ok) {
    throw new Error(`Could not load business trips (HTTP ${response.status}).`);
  }

  const trips = await response.json();
  if (!Array.isArray(trips)) {
    throw new Error("The business trips response has an unexpected format.");
  }
  return trips;
}

export const getWishlistItems = getBusinessTrips;
