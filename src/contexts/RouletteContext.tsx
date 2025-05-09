import React, { createContext, useState, useEffect } from "react";

/**
 * 룰렛 항목 타입 정의
 */
export interface RouletteItem {
  id: string;
  text: string;
}

/**
 * 룰렛 데이터 타입 정의
 */
export interface RouletteData {
  id: string;
  name: string;
  items: RouletteItem[];
  createdAt: number;
  updatedAt: number;
}

/**
 * RouletteContext의 상태 및 액션 타입 정의
 */
interface RouletteContextType {
  // 현재 선택된 룰렛 데이터
  currentRoulette: RouletteData | null;
  // 저장된 룰렛 목록
  savedRoulettes: RouletteData[];
  // 현재 선택된 항목 (결과)
  selectedItem: RouletteItem | null;
  // 룰렛 회전 중 여부
  isSpinning: boolean;
  // 당첨 항목 자동 제거 옵션
  isAutoRemoveEnabled: boolean;

  // 액션 함수들
  createNewRoulette: (name: string) => void;
  addItem: (text: string) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, text: string) => void;
  clearItems: () => void;
  saveCurrentRoulette: () => void;
  loadRoulette: (id: string) => void;
  deleteRoulette: (id: string) => void;
  spinRoulette: () => Promise<RouletteItem | null>;
  setSelectedItem: (item: RouletteItem | null) => void;
  removeSelectedItem: () => void;
  setIsAutoRemoveEnabled: (enabled: boolean) => void;
}

// Context 생성 (기본값은 null로 설정)
// eslint-disable-next-line react-refresh/only-export-components
export const RouletteContext = createContext<RouletteContextType | null>(null);

/**
 * RouletteContext를 위한 Provider 컴포넌트
 */
export function RouletteProvider({ children }: { children: React.ReactNode }) {
  // 현재 룰렛 데이터 상태
  const [currentRoulette, setCurrentRoulette] = useState<RouletteData>({
    id: crypto.randomUUID(),
    name: "새로운 룰렛",
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // 저장된 모든 룰렛 목록
  const [savedRoulettes, setSavedRoulettes] = useState<RouletteData[]>([]);

  // 선택된 항목 (결과)
  const [selectedItem, setSelectedItem] = useState<RouletteItem | null>(null);

  // 룰렛 회전 중 상태
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // 당첨 항목 자동 제거 옵션
  const [isAutoRemoveEnabled, setIsAutoRemoveEnabled] =
    useState<boolean>(false);

  // LocalStorage에서 저장된 룰렛 목록 불러오기
  useEffect(() => {
    const loadedRoulettes = localStorage.getItem("spinjoy_roulettes");
    if (loadedRoulettes) {
      try {
        const parsedRoulettes: RouletteData[] = JSON.parse(loadedRoulettes);
        setSavedRoulettes(parsedRoulettes);
      } catch (error) {
        console.error("Failed to parse saved roulettes:", error);
      }
    }
  }, []);

  // 새 룰렛 생성
  const createNewRoulette = (name: string) => {
    const newRoulette: RouletteData = {
      id: crypto.randomUUID(),
      name: name || "새로운 룰렛",
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentRoulette(newRoulette);
    setSelectedItem(null);
  };

  // 항목 추가
  const addItem = (text: string) => {
    if (!text.trim()) return;

    const newItem: RouletteItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
    };

    setCurrentRoulette((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [...prev.items, newItem],
        updatedAt: Date.now(),
      };
    });
  };

  // 항목 제거
  const removeItem = (id: string) => {
    setCurrentRoulette((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
        updatedAt: Date.now(),
      };
    });

    // 선택된 항목이었다면 선택 상태도 제거
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  // 항목 수정
  const updateItem = (id: string, text: string) => {
    if (!text.trim()) return;

    setCurrentRoulette((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, text: text.trim() } : item,
        ),
        updatedAt: Date.now(),
      };
    });

    // 선택된 항목이었다면 선택 상태도 업데이트
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, text: text.trim() } : null));
    }
  };

  // 모든 항목 초기화
  const clearItems = () => {
    setCurrentRoulette((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [],
        updatedAt: Date.now(),
      };
    });
    setSelectedItem(null);
  };

  // 현재 룰렛 저장
  const saveCurrentRoulette = () => {
    if (!currentRoulette) return;

    // 이미 저장된 룰렛이면 업데이트, 아니면 추가
    const updatedRoulettes = savedRoulettes.some(
      (r) => r.id === currentRoulette.id,
    )
      ? savedRoulettes.map((r) =>
          r.id === currentRoulette.id ? currentRoulette : r,
        )
      : [...savedRoulettes, currentRoulette];

    setSavedRoulettes(updatedRoulettes);

    // LocalStorage에 저장
    try {
      localStorage.setItem(
        "spinjoy_roulettes",
        JSON.stringify(updatedRoulettes),
      );
    } catch (error) {
      console.error("Failed to save roulettes to localStorage:", error);
    }
  };

  // 저장된 룰렛 불러오기
  const loadRoulette = (id: string) => {
    const rouletteToLoad = savedRoulettes.find((r) => r.id === id);
    if (rouletteToLoad) {
      setCurrentRoulette(rouletteToLoad);
      setSelectedItem(null);
    }
  };

  // 저장된 룰렛 삭제
  const deleteRoulette = (id: string) => {
    const updatedRoulettes = savedRoulettes.filter((r) => r.id !== id);
    setSavedRoulettes(updatedRoulettes);

    // LocalStorage에 업데이트
    try {
      localStorage.setItem(
        "spinjoy_roulettes",
        JSON.stringify(updatedRoulettes),
      );
    } catch (error) {
      console.error(
        "Failed to update localStorage after deleting roulette:",
        error,
      );
    }

    // 현재 선택된 룰렛이면 초기화
    if (currentRoulette?.id === id) {
      createNewRoulette("새로운 룰렛");
    }
  };

  // 룰렛 회전 및 결과 선택
  const spinRoulette = async (): Promise<RouletteItem | null> => {
    if (isSpinning || !currentRoulette?.items.length) return null;

    try {
      setIsSpinning(true);
      setSelectedItem(null);

      // 회전 시간을 임의로 설정 (2~4초)
      const spinDuration = Math.random() * 2000 + 2000;

      // 비동기로 대기 (실제 애니메이션은 UI 컴포넌트에서 처리)
      await new Promise((resolve) => setTimeout(resolve, spinDuration));

      // 항목 랜덤 선택
      const randomIndex = Math.floor(
        Math.random() * currentRoulette.items.length,
      );
      const selected = currentRoulette.items[randomIndex];

      setSelectedItem(selected);

      // 자동 제거 옵션이 켜져 있으면 선택된 항목 제거
      if (isAutoRemoveEnabled && selected) {
        setCurrentRoulette((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.filter((item) => item.id !== selected.id),
            updatedAt: Date.now(),
          };
        });
      }

      return selected;
    } finally {
      setIsSpinning(false);
    }
  };

  // 선택된 항목 수동 제거
  const removeSelectedItem = () => {
    if (selectedItem) {
      removeItem(selectedItem.id);
    }
  };

  // Context 값
  const value: RouletteContextType = {
    currentRoulette,
    savedRoulettes,
    selectedItem,
    isSpinning,
    isAutoRemoveEnabled,
    createNewRoulette,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    saveCurrentRoulette,
    loadRoulette,
    deleteRoulette,
    spinRoulette,
    setSelectedItem,
    removeSelectedItem,
    setIsAutoRemoveEnabled,
  };

  return (
    <RouletteContext.Provider value={value}>
      {children}
    </RouletteContext.Provider>
  );
}
