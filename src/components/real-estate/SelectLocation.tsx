import { useContext } from "react";
import { useSearchFilter } from "@/src/contexts/SearchFilterContext";
interface Props {
  selectedDong: Set<string>;
  setSelectedDong: React.Dispatch<React.SetStateAction<Set<string>>>;
  dongMap: { [gu: string]: string[] };
}
const SelectLocation = () => {
  const { selectedDong, setSelectedDong, dongMap } = useSearchFilter();
  return (
    <div className=" ">
      <section className="px-4 py-4 rounded-b">
        <ul className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-1 text-gray-700 ">
          {(dongMap["영등포구"] || []).map((dong) => (
            <li
              key={dong}
              className={`cursor-pointer box-border text-xs hover:text-blue-600 px-1 py-1 min-w-0 max-w-full ${
                selectedDong.has(dong) ? "bg-blue-200 text-blue-500 rounded" : ""
              }`}
              onClick={() => {
                setSelectedDong((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(dong)) {
                    newSet.delete(dong);
                  } else {
                    newSet.add(dong);
                  }
                  return newSet;
                });
              }}
            >
              {dong}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
export default SelectLocation;
