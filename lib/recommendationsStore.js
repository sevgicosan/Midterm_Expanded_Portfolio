// ============================================================
// JSON storage for Learning Exchange recommendations.
//
// Valid recommendations are APPENDED to
// data/recommendations.json, so community notes are never
// overwritten. If the file does not exist yet (first
// submission), it is created.
//
// This is the SHARED storage — every visitor sees the same
// notes. Personal "My Learning List" saving lives in
// learningExchangeStorage.js (browser LocalStorage).
// ============================================================

import { promises as fs } from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data");
const recommendationsFilePath = path.join(
  dataDirectory,
  "recommendations.json"
);

async function readAll() {
  try {
    const parsed = JSON.parse(
      await fs.readFile(recommendationsFilePath, "utf8")
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // The file does not exist yet — start a new list.
    return [];
  }
}

export async function getRecommendations() {
  const recommendations = await readAll();

  // Newest first, so the board can pin them in that order.
  return recommendations.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export async function saveRecommendation(data) {
  const recommendation = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: data.name,
    title: data.title,
    category: data.category,
    url: data.url,
    description: data.description,
  };

  const recommendations = await readAll();
  recommendations.push(recommendation);

  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(
    recommendationsFilePath,
    JSON.stringify(recommendations, null, 2),
    "utf8"
  );

  return recommendation;
}

// Updates an existing recommendation (found by id). Returns the
// updated recommendation, or null if the id does not exist.
export async function updateRecommendation(id, data) {
  const recommendations = await readAll();
  const index = recommendations.findIndex((rec) => rec.id === id);

  if (index === -1) {
    return null;
  }

  const updated = {
    ...recommendations[index],
    name: data.name,
    title: data.title,
    category: data.category,
    url: data.url,
    description: data.description,
    updatedAt: new Date().toISOString(),
  };

  recommendations[index] = updated;

  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(
    recommendationsFilePath,
    JSON.stringify(recommendations, null, 2),
    "utf8"
  );

  return updated;
}

// Deletes a recommendation by id. Returns the deleted
// recommendation, or null if the id does not exist.
export async function deleteRecommendation(id) {
  const recommendations = await readAll();
  const index = recommendations.findIndex((rec) => rec.id === id);

  if (index === -1) {
    return null;
  }

  const [deleted] = recommendations.splice(index, 1);

  await fs.writeFile(
    recommendationsFilePath,
    JSON.stringify(recommendations, null, 2),
    "utf8"
  );

  return deleted;
}
