"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { getFolderList, createFolder } from "@/src/lib/api";

// 1. Context 타입 정의
interface FolderContextType {
  showFolderSelect: boolean;
  setShowFolderSelect: (v: boolean) => void;
  folders: { folders: string[] } | undefined;
  isAddingFolder: boolean;
  setIsAddingFolder: (v: boolean) => void;
  newFolderName: string;
  setNewFolderName: (v: string) => void;
  createFolderMutation: UseMutationResult<any, Error, string, unknown>;
}

const FolderContext = createContext<FolderContextType | null>(null);

// 2. Provider가 직접 상태를 소유하고 관리
export function FolderProvider({ children }: { children: ReactNode }) {
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const { data: folders } = useQuery({
    queryKey: ["folders", "admin"], // Assuming user is 'admin'
    queryFn: getFolderList,
  });

  const queryClient = useQueryClient();

  const createFolderMutation = useMutation<any, Error, string, unknown>({
    mutationFn: (folderName: string) => createFolder({ folderName, user: "admin" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", "admin"] });
    },
  });

  const value = {
    showFolderSelect,
    setShowFolderSelect,
    folders,
    isAddingFolder,
    setIsAddingFolder,
    newFolderName,
    setNewFolderName,
    createFolderMutation,
  };

  return <FolderContext value={value}>{children}</FolderContext>;
}

// 3. Custom Hook
export function useFolder() {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolder must be used within a FolderProvider");
  }
  return context;
}
