export interface Station {
  code: string;
  name: string;
  district: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

// 엑셀 첫 행이 비어 있어 xlsx 가 컬럼을 __EMPTY* 로 자동 명명한다.
// A=__EMPTY(코드) B=__EMPTY_1(장소명) C=__EMPTY_2(자치구) D=__EMPTY_3(전체주소)
// E=__EMPTY_4(위도) F=__EMPTY_5(경도)
interface RawRow {
  __EMPTY?: unknown;
  __EMPTY_1?: unknown;
  __EMPTY_2?: unknown;
  __EMPTY_3?: unknown;
  __EMPTY_4?: unknown;
  __EMPTY_5?: unknown;
}

const SEOUL_LAT = [37.4, 37.72] as const;
const SEOUL_LNG = [126.73, 127.27] as const;

const SEOUL_GU = new Set([
  '종로구',
  '중구',
  '용산구',
  '성동구',
  '광진구',
  '동대문구',
  '중랑구',
  '성북구',
  '강북구',
  '도봉구',
  '노원구',
  '은평구',
  '서대문구',
  '마포구',
  '양천구',
  '강서구',
  '구로구',
  '금천구',
  '영등포구',
  '동작구',
  '관악구',
  '서초구',
  '강남구',
  '송파구',
  '강동구',
]);

const toCoord = (value: unknown, range: readonly [number, number]) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < range[0] || num > range[1]) {
    return null;
  }
  return num;
};

// 자치구 컬럼(__EMPTY_2)이 신뢰원본. 주소 정규식은 컬럼이 비었을 때만 보조로 사용.
// '출구/번출구' 같은 오탐을 막기 위해 25개 자치구 화이트리스트로 검증한다.
const pickDistrict = (address: string, column: string) => {
  const col = column.trim();
  if (SEOUL_GU.has(col)) {
    return col;
  }
  const match = address.match(/([가-힣]+구)(?:\s|$)/);
  if (match && SEOUL_GU.has(match[1])) {
    return match[1];
  }
  return col || (match ? match[1] : '서울');
};

const pickName = (rawName: string, address: string, district: string) => {
  const name = rawName.trim();
  if (name) {
    return name;
  }
  // 장소명이 비면 주소에서 자치구 이후 마지막 토막을 사용
  const base =
    district && address.includes(district)
      ? address.split(district).pop() ?? ''
      : address;
  const parts = base.trim().split(' ').filter(Boolean);
  return parts.slice(-2).join(' ') || address.trim();
};

export const parseStations = (rows: RawRow[]): Station[] => {
  const stations: Station[] = [];

  for (const row of rows) {
    const address = String(row.__EMPTY_3 ?? '').trim();
    const district = pickDistrict(address, String(row.__EMPTY_2 ?? ''));
    const name = pickName(String(row.__EMPTY_1 ?? ''), address, district);
    const lat = toCoord(row.__EMPTY_4, SEOUL_LAT);
    const lng = toCoord(row.__EMPTY_5, SEOUL_LNG);

    // 이름도 좌표도 없으면 식별 불가 → 제외 (주소만 없는 건 살린다)
    if (!name && lat === null) {
      continue;
    }

    stations.push({
      code: String(row.__EMPTY ?? '').trim(),
      name: name || district,
      district,
      address,
      lat,
      lng,
    });
  }

  return stations;
};

// 좌표가 있으면 카카오맵 길찾기, 없으면 주소 검색으로 폴백
export const mapUrl = (station: Station) => {
  if (station.lat !== null && station.lng !== null) {
    return `https://map.kakao.com/link/to/${encodeURIComponent(station.name)},${
      station.lat
    },${station.lng}`;
  }
  return `https://map.kakao.com/?q=${encodeURIComponent(
    station.address || station.name,
  )}`;
};
