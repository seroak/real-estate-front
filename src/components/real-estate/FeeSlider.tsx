"use client";
import { useSearchFilter } from "@/src/contexts/SearchFilterContext";
import { formatMoney } from "@/src/lib/formatMoney";

export default function FeeSlider() {
  const { depositRange, setDepositRange, monthlyRentRange, setMonthlyRentRange } = useSearchFilter();

  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">보증금</label>
        <input
          type="range"
          min="0"
          max="100000"
          value={depositRange[1] === Infinity ? 100000 : depositRange[1]}
          onChange={(e) => setDepositRange([depositRange[0], Number(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0원</span>
          <span>{formatMoney(depositRange[1])}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">월세</label>
        <input
          type="range"
          min="0"
          max="1000"
          value={monthlyRentRange[1] === Infinity ? 1000 : monthlyRentRange[1]}
          onChange={(e) => setMonthlyRentRange([monthlyRentRange[0], Number(e.target.value)])}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0원</span>
          <span>{formatMoney(monthlyRentRange[1])}</span>
        </div>
      </div>
    </div>
  );
}