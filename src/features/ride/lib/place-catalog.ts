import { RideLocation } from "../model/ride-types";

type PlaceCatalogEntry = RideLocation & {
  aliases: string[];
};

const PLACE_CATALOG: PlaceCatalogEntry[] = [
  {
    name: "건국대학교",
    lat: 37.547,
    lon: 127.091896,
    aliases: ["건국대학교", "건국대", "건대", "건대입구", "건국"],
  },
  {
    name: "홍익대학교",
    lat: 37.551464,
    lon: 126.925011,
    aliases: ["홍익대학교", "홍익대", "홍대", "홍대입구", "홍익"],
  },
];

export function resolvePlaceInput(input: string): RideLocation | null {
  const normalizedInput = input.trim().replace(/\s+/g, "");

  if (!normalizedInput) {
    return null;
  }

  const matchedPlace = PLACE_CATALOG.find((place) =>
    place.aliases.some((alias) => alias.replace(/\s+/g, "") === normalizedInput),
  );

  if (!matchedPlace) {
    return null;
  }

  return {
    name: matchedPlace.name,
    lat: matchedPlace.lat,
    lon: matchedPlace.lon,
  };
}
