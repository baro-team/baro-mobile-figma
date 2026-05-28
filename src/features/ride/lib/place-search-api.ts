import { PlaceSearchResult } from "../model/ride-location";

type KakaoKeywordSearchResult = {
  x: string;
  y: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
};

type KakaoKeywordSearchResponse = {
  documents: KakaoKeywordSearchResult[];
};

type PlaceSearchErrorResponse = {
  message?: string;
  errorType?: string;
};

function normalizePlaceResult(place: KakaoKeywordSearchResult): PlaceSearchResult {
  return {
    name: place.place_name,
    lat: Number(place.y),
    lon: Number(place.x),
    addressName: place.address_name,
    roadAddressName: place.road_address_name,
  };
}

export async function searchPlacesByKeyword(
  keyword: string,
): Promise<PlaceSearchResult[]> {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    throw new Error("장소 검색어를 입력해주세요.");
  }

  const response = await fetch(
    `/api/places/search?query=${encodeURIComponent(trimmedKeyword)}&size=5`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    let errorData: PlaceSearchErrorResponse | null = null;

    try {
      errorData = (await response.json()) as PlaceSearchErrorResponse;
    } catch {
      errorData = null;
    }

    throw new Error(errorData?.message || "장소 검색 중 오류가 발생했습니다.");
  }

  const data = (await response.json()) as KakaoKeywordSearchResponse;

  if (!data.documents.length) {
    throw new Error(`'${trimmedKeyword}' 검색 결과가 없습니다.`);
  }

  return data.documents.map(normalizePlaceResult);
}
