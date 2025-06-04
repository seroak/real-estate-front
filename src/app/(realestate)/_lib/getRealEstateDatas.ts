// app/(realestate)/_lib/getRealEstateDatas.ts
export interface Article {
  _id: string;
  article_id: string;
  article_title: string;
  article_short_description: string;
  article_short_features: string[] | "None";
  article_regist_date: string;
  agent_office_post: string;
  deposit_fee: number;
  rent_fee: number;
  management_fee: string;
  gu: string;
  dong: string;
  floor: string;
  exclusive_area: string;
  direction: string;
  transaction_type: string;
  image_url: string | null;
  tag_list: string[];
}

interface RealEstateResponse {
  total_count: number;
  real_estate_list: Article[];
  nextPage: string | null;
}

export default async function getRealEstateDatas({
  pageParam,
  queryKey,
}: {
  pageParam: string;
  queryKey: readonly [
    "search",
    {
      readonly gu?: string | string[];
      readonly dong?: string | string[];
      readonly deposit_min?: string | string[];
      readonly deposit_max?: string | string[];
      readonly rent_min?: string | string[];
      readonly rent_max?: string | string[];
    }
  ];
}): Promise<RealEstateResponse> {
  const [, { gu, deposit_min, deposit_max, rent_min, rent_max, dong }] = queryKey;
  const url = new URL("http://localhost:8000/get_articles");
  const multiValueParams = {
    gu,
    dong,
    deposit_min,
    deposit_max,
    rent_min,
    rent_max,
  };
  Object.entries(multiValueParams).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v));
    } else {
      url.searchParams.append(key, value);
    }
  });

  url.searchParams.append("cursor", pageParam.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch real estate listings");
  return await response.json();
}
