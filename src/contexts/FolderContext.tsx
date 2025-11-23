"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// --- localStorage 관련 헬퍼 함수 ---
const FOLDERS_STORAGE_KEY = 'real-estate-folders';

// localStorage에서 폴더 목록을 가져오는 함수
const getFoldersFromStorage = (): string[] => {
  // 서버 사이드 렌더링 중에는 window 객체가 없으므로 빈 배열을 반환
  if (typeof window === 'undefined') return [];
  const savedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
  // 저장된 폴더가 없으면 기본값을 반환
  return savedFolders ? JSON.parse(savedFolders) : ['기본 폴더', '관심 목록'];
};

// localStorage에 폴더 목록을 저장하는 함수
const saveFoldersToStorage = (folders: string[]) => {
  localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
};

// --- Context 생성 ---
interface FolderContextType {
  showFolderSelect: boolean;
  setShowFolderSelect: (v: boolean) => void;
  folders: string[];
  isAddingFolder: boolean;
  setIsAddingFolder: (v: boolean) => void;
  newFolderName: string;
  setNewFolderName: (v: string) => void;
  createFolder: (folderName: string) => void;
}

const FolderContext = createContext<FolderContextType | null>(null);

// --- Provider 컴포넌트 ---
export function FolderProvider({ children }: { children: ReactNode }) {
  const [showFolderSelect, setShowFolderSelect] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState<string[]>([]);

  // 1. 컴포넌트가 처음 마운트될 때, localStorage에서 폴더 목록을 불러옵니다.
  useEffect(() => {
    setFolders(getFoldersFromStorage());
  }, []);

  // 2. 'folders' 상태가 변경될 때마다, 그 결과를 다시 localStorage에 저장합니다.
  useEffect(() => {
    // 초기 빈 배열 상태가 저장되는 것을 방지
    if (folders.length > 0) {
      saveFoldersToStorage(folders);
    }
  }, [folders]);

  // 3. 폴더 생성 로직 (이제는 단순히 상태만 변경)
  const createFolder = (folderName: string) => {
    if (!folderName.trim() || folders.includes(folderName)) {
      alert("폴더 이름이 비어있거나 이미 존재합니다.");
      return;
    }
    setFolders(prevFolders => [...prevFolders, folderName.trim()]);
  };

  const value = {
    showFolderSelect,
    setShowFolderSelect,
    folders,
    isAddingFolder,
    setIsAddingFolder,
    newFolderName,
    setNewFolderName,
    createFolder,
  };

  return (
    <FolderContext.Provider value={value}>
      {children}
    </FolderContext.Provider>
  );
}

// --- Custom Hook ---
export function useFolder() {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolder must be used within a FolderProvider');
  }
  return context;
}