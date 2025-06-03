// src/lib/fetchProperties.ts
export const fetchProperties = async () => {
  const res = await fetch("/api/properties");
  return res.json();
};
