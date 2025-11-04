"use client";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import EstateItemCard from "./EstateItemCard";
import getRealEstateDatas from "@/src/lib/getRealEstateDatas";
import LoadingSpinner from "@/src/components/common/LoadingSpinner";
import { Article } from "@/src/types/real-estate";
import Toolbar from "./Toolbar";
import { useEstateSelection } from "@/src/hooks/useEstateSelection";

export default function RealEstateClient({
  gu,
  dong,
  deposit_min,
  deposit_max,
  rent_min,
  rent_max,
  area_min,
  area_max,
  article_class,
}: {
  gu?: string;
  dong?: string;
  deposit_min?: string;
  deposit_max?: string;
  rent_min?: string;
  rent_max?: string;
  area_min?: string;
  area_max?: string;
  article_class?: string;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: [
      "search",
      { gu, deposit_min, deposit_max, rent_min, rent_max, dong, area_min, area_max, article_class },
    ] as const,
    queryFn: ({ pageParam, queryKey }) => {
      const [, filters] = queryKey;
      return getRealEstateDatas({ pageParam, filters });
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: "1",
    staleTime: 1000 * 60 * 5,
    placeholderData: (prevData) => prevData,
  });

  const allListings = data?.pages.flatMap((page) => page.real_estate_list) ?? [];
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Custom Hook으로 상태 관리 로직 위임
  const {
    selectedEstateIds,
    handleSelectEstate,
    handleSelectAll,
    clearSelection,
    allItemsSelected,
  } = useEstateSelection(allListings);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="flex justify-between px-4 pt-4 pb-10">
      <div className="relative w-full p-4">
        {isFetching && !isFetchingNextPage && <LoadingSpinner />}
        {allListings.length === 0 ? (
          <p className="text-gray-600 text-sm mb-4">원하는 동을 눌러서 검색하세요</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">부동산 목록</h1>

            <p className="text-gray-600 text-sm mb-4">
              체크박스를 선택하여 내 리스트에 담을 매물을 한 번에 저장하세요.
            </p>

            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
              {allListings.map((item: Article) => (
                <EstateItemCard
                  key={item._id} // index 대신 고유한 _id를 key로 사용
                  realEstate={item}
                  isSelected={selectedEstateIds.has(item._id)}
                  onSelect={handleSelectEstate}
                />
              ))}
            </div>
            <div ref={observerRef} className="h-10"></div>
          </>
        )}
      </div>
      <Toolbar
        selectedCount={selectedEstateIds.size}
        allListingsCount={allListings.length}
        onSelectAll={handleSelectAll}
        allItemsSelected={allItemsSelected}
        selectedEstateIds={selectedEstateIds}
        onClearSelection={clearSelection}
      />
    </div>
  );
}
