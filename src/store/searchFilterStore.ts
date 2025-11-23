import { create } from "zustand";

// 1. 스토어에서 관리할 상태와 액션의 타입을 정의합니다.
interface SearchFilterState {
  showSearchFilter: boolean;
  showSlider: boolean;
  showSearchLocation: boolean;
  depositRange: [number, number];
  monthlyRentRange: [number, number];
  step: "city" | "gu" | "dong";
  selectedCity: string | null;
  selectedGu: string | null;
  selectedDong: Set<string>;
  selectedArticleClass: string;
  areaRange: [number, number];
  guMap: { [key: string]: string[] };
  dongMap: { [key: string]: string[] };

  // 액션(상태 변경 함수)들을 정의합니다.
  setShowSearchFilter: (v: boolean) => void;
  setShowSlider: (v: boolean) => void;
  setShowSearchLocation: (v: boolean) => void;
  setDepositRange: (range: [number, number]) => void;
  setMonthlyRentRange: (range: [number, number]) => void;
  setStep: (n: "city" | "gu" | "dong") => void;
  setSelectedCity: (c: string | null) => void;
  setSelectedGu: (g: string | null) => void;
  setSelectedDong: (updater: (prev: Set<string>) => Set<string>) => void;
  dispatchSelectedArticleClass: (action: any) => void; // useReducer 로직은 직접 스토어에 통합
  setAreaRange: (range: [number, number]) => void;
  resetState: () => void;
  // searchRealEstate는 useRouter를 사용하므로 컴포넌트에서 처리
}

// 2. 스토어를 생성합니다.
export const useSearchFilterStore = create<SearchFilterState>((set, get) => ({
  // --- 초기 상태 ---
  showSearchFilter: false,
  showSlider: false,
  showSearchLocation: true,
  depositRange: [0, Infinity],
  monthlyRentRange: [0, Infinity],
  step: "city",
  selectedCity: "서울",
  selectedGu: "영등포구",
  selectedDong: new Set(),
  selectedArticleClass: "SELECT_ALL",
  areaRange: [0, Infinity],
  guMap: { 서울: ["영등포구"] },
  dongMap: { 영등포구: ["당산동", "대림동", "도림동", "문래동", "신길동", "양평동", "여의도동", "영등포동"] },

  // --- 액션 구현 ---
  setShowSearchFilter: (v) => set({ showSearchFilter: v }),
  setShowSlider: (v) => set({ showSlider: v }),
  setShowSearchLocation: (v) => set({ showSearchLocation: v }),
  setDepositRange: (range) => set({ depositRange: range }),
  setMonthlyRentRange: (range) => set({ monthlyRentRange: range }),
  setStep: (n) => set({ step: n }),
  setSelectedCity: (c) => set({ selectedCity: c }),
  setSelectedGu: (g) => set({ selectedGu: g }),
  setSelectedDong: (updater) => set((state) => ({ selectedDong: updater(state.selectedDong) })),
  dispatchSelectedArticleClass: (action) =>
    set((state) => {
      if (action.type === "SELECT_ALL") return { selectedArticleClass: "SELECT_ALL" };
      if (action.type === "TOGGLE_CLASS") {
        const currentClasses = state.selectedArticleClass.split(",").filter((c) => c && c !== "SELECT_ALL");
        const newClasses = new Set(currentClasses);
        if (newClasses.has(action.payload)) {
          newClasses.delete(action.payload);
        } else {
          newClasses.add(action.payload);
        }
        return { selectedArticleClass: [...newClasses].join(",") || "SELECT_ALL" };
      }
      return {};
    }),
  setAreaRange: (range) => set({ areaRange: range }),
  resetState: () =>
    set({
      selectedDong: new Set(),
      depositRange: [0, Infinity],
      monthlyRentRange: [0, Infinity],
      selectedArticleClass: "SELECT_ALL",
      areaRange: [0, Infinity],
    }),
}));
