"use client";
import { useSearchFilter } from "@/src/contexts/SearchFilterContext";

export default function SearchLocation() {
  const {
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
    setShowSearchFilter,
  } = useSearchFilter();

  const handleSelectDong = (dong: string) => {
    setSelectedDong((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dong)) {
        newSet.delete(dong);
      } else {
        newSet.add(dong);
      }
      return newSet;
    });
  };

  const renderStep = () => {
    switch (step) {
      case "city":
        return (
          <div>
            <h3 className="font-semibold mb-2">도시 선택</h3>
            {Object.keys(guMap).map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  setStep("gu");
                }}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                {city}
              </button>
            ))}
          </div>
        );
      case "gu":
        return (
          <div>
            <button onClick={() => setStep("city")} className="text-sm text-gray-500 mb-2">← 뒤로</button>
            <h3 className="font-semibold mb-2">구 선택</h3>
            {selectedCity && guMap[selectedCity].map((gu) => (
              <button
                key={gu}
                onClick={() => {
                  setSelectedGu(gu);
                  setStep("dong");
                }}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                {gu}
              </button>
            ))}
          </div>
        );
      case "dong":
        return (
          <div>
            <button onClick={() => setStep("gu")} className="text-sm text-gray-500 mb-2">← 뒤로</button>
            <h3 className="font-semibold mb-2">동 선택</h3>
            <div className="grid grid-cols-3 gap-2">
            {selectedGu && dongMap[selectedGu]?.map((dong) => (
              <button
                key={dong}
                onClick={() => handleSelectDong(dong)}
                className={`p-2 text-sm border rounded-md ${
                  selectedDong.has(dong) ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {dong}
              </button>
            ))}
            </div>
            <button 
              onClick={() => {
                searchRealEstate();
                setShowSearchFilter(false);
              }}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              선택 완료
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="w-full p-4">{renderStep()}</div>;
}