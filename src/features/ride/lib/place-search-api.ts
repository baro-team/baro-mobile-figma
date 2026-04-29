import { loadKakaoMapSdk } from "./kakao-map-sdk";
import { PlaceSearchResult } from "../model/ride-location";

type KakaoKeywordSearchResult = {
  x: string;
  y: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
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

  const kakao = await loadKakaoMapSdk();

  return new Promise((resolve, reject) => {
    const places = new kakao.maps.services.Places();

    places.keywordSearch(trimmedKeyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        resolve(result.slice(0, 5).map(normalizePlaceResult));
        return;
      }

      if (status === kakao.maps.services.Status.ZERO_RESULT) {
        reject(new Error(`'${trimmedKeyword}' 검색 결과가 없습니다.`));
        return;
      }

      reject(new Error("장소 검색 중 오류가 발생했습니다."));
    });
  });
}
