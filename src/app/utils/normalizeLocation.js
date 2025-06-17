import { locations } from '@/app/components/Locations';

export const normalizeLocation = (rawLocation) => {
  if (!rawLocation) return rawLocation;

  // Lowercase & trim for better normalization
  const cleaned = rawLocation.trim().toLowerCase();

  for (const region of locations) {
    for (const loc of region.locations) {
      if (
        loc.en.toLowerCase() === cleaned ||
        loc.he.toLowerCase() === cleaned
      ) {
        return loc.en;
      }
    }
  }
  return rawLocation; // fallback if not found
};
