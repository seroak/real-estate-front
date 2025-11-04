import { useState, useMemo } from "react";
import { Article } from "@/src/types/real-estate";

export function useEstateSelection(allListings: Article[] = []) {
  const [selectedEstateIds, setSelectedEstateIds] = useState<Set<string>>(
    new Set()
  );

  const handleSelectEstate = (id: string, isChecked: boolean) => {
    setSelectedEstateIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (isChecked) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return newSelectedIds;
    });
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      const allIds = new Set(allListings.map((estate) => estate._id));
      setSelectedEstateIds(allIds);
    } else {
      setSelectedEstateIds(new Set());
    }
  };

  const clearSelection = () => {
    setSelectedEstateIds(new Set());
  };

  const allItemsSelected = useMemo(() => 
    allListings.length > 0 && selectedEstateIds.size === allListings.length,
    [allListings.length, selectedEstateIds.size]
  );

  return {
    selectedEstateIds,
    handleSelectEstate,
    handleSelectAll,
    clearSelection,
    allItemsSelected,
  };
}
