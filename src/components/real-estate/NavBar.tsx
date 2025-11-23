"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import DepositAndRentInput from "./DepositAndRentInput";
import SelectLocation from "./SelectLocation";
import SelectArticleClass from "./SelectArticleClass";
import AreaRangeInput from "./AreaRangeInput";
import NavAction from "./NavAction";
import { useSearchFilterStore } from "@/src/store/searchFilterStore";

// URL과 Zustand 상태를 동기화하는 역할을 하는 컴포넌트
const StateSync = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedDong, selectedGu, depositRange, monthlyRentRange, selectedArticleClass, areaRange } =
    useSearchFilterStore(
      useShallow((state) => ({
        selectedDong: state.selectedDong,
        selectedGu: state.selectedGu,
        depositRange: state.depositRange,
        monthlyRentRange: state.monthlyRentRange,
        selectedArticleClass: state.selectedArticleClass,
        areaRange: state.areaRange,
      }))
    );

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedDong.size > 0) {
      params.set("gu", selectedGu || "영등포구");
      params.set("dong", [...selectedDong].join(","));
    }
    params.set("deposit_min", depositRange[0].toString());
    if (depositRange[1] !== Infinity) {
      params.set("deposit_max", depositRange[1].toString());
    }
    params.set("rent_min", monthlyRentRange[0].toString());
    if (monthlyRentRange[1] !== Infinity) {
      params.set("rent_max", monthlyRentRange[1].toString());
    }
    if (areaRange[0] !== 0) {
      params.set("area_min", areaRange[0].toString());
    }
    if (areaRange[1] !== Infinity) {
      params.set("area_max", areaRange[1].toString());
    }
    params.set("article_class", selectedArticleClass);
    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedDong, depositRange, monthlyRentRange, selectedArticleClass, areaRange, selectedGu, router, pathname]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

// NavBar의 실제 UI 부분
const NavBarContent = () => {
  const resetState = useSearchFilterStore((state) => state.resetState);

  return (
    <header className="min-w-[555px] w-full bg-white shadow-sm border-b">
      <div className="mx-auto px-4 py-1 flex items-center justify-between gap-4">
        <Link href="/" onClick={resetState} className="whitespace-nowrap text-lg font-bold text-blue-600">
          부동산 리스트
        </Link>
        <NavAction />
      </div>
      <div className="flex justify-start px-4 py-2 flex gap-6">
        <SelectLocation />
        <SelectArticleClass />
        <DepositAndRentInput />
        <AreaRangeInput />
      </div>
    </header>
  );
};

// 최상위 NavBar 컴포넌트
const NavBar = () => {
  return (
    <>
      <StateSync />
      <NavBarContent />
    </>
  );
};

export default NavBar;
