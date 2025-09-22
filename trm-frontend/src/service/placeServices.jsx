const API_URL = "http://localhost:4000/api/places";

/**
 * Fetch all places
 * @returns {Promise<Array>} Array of place objects
 */
export const getAllPlaces = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch places");
  return res.json();
};

/**

 * @param {string} id - place _id
 * @returns {Promise<Object>} place object
 */
export const getPlaceById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch place");
  return res.json();
};

/**
 * Search places by name
 * @param {string} query - search query
 * @returns {Promise<Array>} array of matching places
 */
export const searchPlaces = async (query) => {
  const res = await fetch(`${API_URL}/search/${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search places");
  return res.json();
};
