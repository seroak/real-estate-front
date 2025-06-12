import RealEstateClient from "./_components/RealEstateClient";

type SearchParams = {
  gu?: string;
  deposit_min?: string;
  deposit_max?: string;
  rent_min?: string;
  rent_max?: string;
  dong?: string;
};
export default async function RealEstatePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const gu = resolvedSearchParams.gu ? resolvedSearchParams.gu : undefined;
  const deposit_min = resolvedSearchParams.deposit_min ? resolvedSearchParams.deposit_min : undefined;
  const deposit_max = resolvedSearchParams.deposit_max ? resolvedSearchParams.deposit_max : undefined;
  const rent_min = resolvedSearchParams.rent_min ? resolvedSearchParams.rent_min : undefined;
  const rent_max = resolvedSearchParams.rent_max ? resolvedSearchParams.rent_max : undefined;
  const dong = resolvedSearchParams.dong ? resolvedSearchParams.dong : undefined;

  return (
    <div>
      <RealEstateClient
        gu={gu}
        dong={dong}
        deposit_min={deposit_min}
        deposit_max={deposit_max}
        rent_min={rent_min}
        rent_max={rent_max}
      />
    </div>
  );
}
