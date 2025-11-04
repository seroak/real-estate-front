"use client";
import Link from "next/link";
import DepositAndRentInput from "./DepositAndRentInput";
import SelectLocation from "./SelectLocation";
import SelectArticleClass from "./SelectArticleClass";
import AreaRangeInput from "./AreaRangeInput";
import NavAction from "./NavAction";
import { SearchFilterProvider, useSearchFilter } from "@/src/contexts/SearchFilterContext";
import { FolderProvider } from "@/src/contexts/FolderContext";

// NavBar의 실제 UI 부분만 담당하는 내부 컴포넌트
const NavBarContent = () => {
  const { resetState, selectedArticleClass, dispatchSelectedArticleClass, depositRange, setDepositRange, monthlyRentRange, setMonthlyRentRange, areaRange, setAreaRange } = useSearchFilter();
  
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
        <SelectArticleClass
          selectedArticleClass={selectedArticleClass}
          setSelectedArticleClass={dispatchSelectedArticleClass}
        />
        <DepositAndRentInput
          depositRange={depositRange}
          setDepositRange={setDepositRange}
          monthlyRentRange={monthlyRentRange}
          setMonthlyRentRange={setMonthlyRentRange}
        />
        <AreaRangeInput areaRange={areaRange} setAreaRange={setAreaRange} />
      </div>
    </header>
  );
}

// Provider들을 제공하는 최상위 NavBar 컴포넌트
const NavBar = () => {
  return (
    <SearchFilterProvider>
      <FolderProvider>
        <NavBarContent />
      </FolderProvider>
    </SearchFilterProvider>
  );
};

export default NavBar;
