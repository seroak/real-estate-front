"use client";
import { createContext, useContext, useState, ReactNode, useReducer, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { selectArticleClassReducer } from "@/src/lib/selectArticleClassReducer";

interface SearchFilterContextType {
  showSearchFilter: boolean;
  setShowSearchFilter: (v: boolean) => void;
  showSlider: boolean;
  setShowSlider: (v: boolean) => void;
  showSearchLocation: boolean;
  setShowSearchLocation: (v: boolean) => void;
  depositRange: [number, number];
  setDepositRange: (range: [number, number]) => void;
  monthlyRentRange: [number, number];
  setMonthlyRentRange: (range: [number, number]) => void;
  step: "city" | "gu" | "dong";
  setStep: (n: "city" | "gu" | "dong") => void;
  selectedCity: string | null;
  setSelectedCity: (c: string | null) => void;
  selectedGu: string | null;
  setSelectedGu: (g: string | null) => void;
  selectedDong: Set<string>;
  setSelectedDong: React.Dispatch<React.SetStateAction<Set<string>>>;
  guMap: { [key: string]: string[] };
  dongMap: { [key: string]: string[] };
  searchRealEstate: () => void;
  resetState: () => void;
  selectedArticleClass: string;
  dispatchSelectedArticleClass: React.Dispatch<any>;
  areaRange: [number, number];
  setAreaRange: (range: [number, number]) => void;
}

const SearchFilterContext = createContext<SearchFilterContextType | null>(null);

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- NavBar에 있던 모든 검색 관련 상태를 이곳으로 이동 ---
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [showSearchLocation, setShowSearchLocation] = useState(true);
  const [step, setStep] = useState<"city" | "gu" | "dong">("city");
  const [selectedCity, setSelectedCity] = useState<string | null>("서울");
  const [selectedGu, setSelectedGu] = useState<string | null>("영등포구");
  const [depositRange, setDepositRange] = useState<[number, number]>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const minDeposit = Number(params.get("deposit_min")) || 0;
    const maxDeposit = Number(params.get("deposit_max")) || Infinity;
    return [minDeposit, maxDeposit];
  });
  const [monthlyRentRange, setMonthlyRentRange] = useState<[number, number]>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const minRent = Number(params.get("rent_min")) || 0;
    const maxRent = Number(params.get("rent_max")) || Infinity;
    return [minRent, maxRent];
  });
  const [selectedDong, setSelectedDong] = useState<Set<string>>(() => {
    return new Set(searchParams.get("dong")?.split(",") || []);
  });
  const [selectedArticleClass, dispatchSelectedArticleClass] = useReducer(
    selectArticleClassReducer,
    searchParams.get("article_class") ?? "SELECT_ALL"
  );
  const [areaRange, setAreaRange] = useState<[number, number]>(() => {
    const params = new URLSearchParams(searchParams.toString());
    const minArea = Number(params.get("area_min")) || 0;
    const maxArea = Number(params.get("area_max")) || Infinity;
    return [minArea, maxArea];
  });

  const dongMap: { [gu: string]: string[] } = {
    영등포구: ["당산동", "대림동", "도림동", "문래동", "신길동", "양평동", "여의도동", "영등포동"],
  };
  const guMap: { [city: string]: string[] } = { 서울: ["영등포구"] };

  const stateToParams = () => {
    const params = new URLSearchParams();
    if (selectedDong.size > 0) {
      params.set("gu", selectedGu || "영등포구");
      params.set("dong", [...selectedDong].join(","));
    }
    // ... (rest of the param logic)
    return params;
  };

  const searchRealEstate = () => {
    const params = stateToParams();
    router.replace(`${pathname}/?${params.toString()}`);
  };

  const resetState = () => {
    setSelectedDong(new Set());
    setDepositRange([0, Infinity]);
    setMonthlyRentRange([0, Infinity]);
    dispatchSelectedArticleClass({ type: "SELECT_ALL" });
    setAreaRange([0, Infinity]);
    router.push(pathname);
  };

  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    setHasInitialized(true);
  }, []);

  useEffect(() => {
    if (!hasInitialized) return;
    searchRealEstate();
  }, [selectedDong, depositRange, monthlyRentRange, selectedArticleClass, areaRange, hasInitialized]);

  const value = {
    showSearchFilter,
    setShowSearchFilter,
    showSlider,
    setShowSlider,
    showSearchLocation,
    setShowSearchLocation,
    depositRange,
    setDepositRange,
    monthlyRentRange,
    setMonthlyRentRange,
    step,
    setStep,
    selectedCity,
    setSelectedCity,
    selectedGu,
    setSelectedGu,
    selectedDong,
    setSelectedDong,
    guMap,
    dongMap,
    searchRealEstate,
    resetState,
    selectedArticleClass,
    dispatchSelectedArticleClass,
    areaRange,
    setAreaRange,
  };

  return <SearchFilterContext.Provider value={value}>{children}</SearchFilterContext.Provider>;
}

export function useSearchFilter() {
  const context = useContext(SearchFilterContext);
  if (!context) {
    throw new Error("useSearchFilter must be used within a SearchFilterProvider");
  }
  return context;
}
