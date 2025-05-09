import React, { createContext, useState, useEffect } from "react";

/**
 * 룰렛 항목 타입 정의
 */
export interface RouletteItem {
  id: string;
  name: string;
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
  // 룰렛 회전 각도
  spinAngle: number;
  // 현재 룰렛의 항목 목록
  items: RouletteItem[];

  // 액션 함수들
  createNewRoulette: (name: string) => void;
  addItem: (item: { name: string }) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, update: { name: string }) => void;
  clearItems: () => void;
  saveCurrentRoulette: (name: string) => void;
  loadRoulette: (id: string) => void;
  deleteRoulette: (id: string) => void;
  spinRoulette: () => void;
  setSelectedItem: (item: RouletteItem | null) => void;
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

  // 룰렛 회전 각도
  const [spinAngle, setSpinAngle] = useState<number>(0);

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
  const addItem = (item: { name: string }) => {
    if (!item.name.trim()) return;

    const newItem: RouletteItem = {
      id: crypto.randomUUID(),
      name: item.name.trim(),
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
  const updateItem = (id: string, update: { name: string }) => {
    if (!update.name.trim()) return;

    setCurrentRoulette((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, name: update.name.trim() } : item,
        ),
        updatedAt: Date.now(),
      };
    });

    // 선택된 항목이었다면 선택 상태도 업데이트
    if (selectedItem?.id === id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, name: update.name.trim() } : null,
      );
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
  const saveCurrentRoulette = (name: string) => {
    if (!currentRoulette) return;

    // 이름이 변경되었으면 업데이트
    const updatedRoulette = {
      ...currentRoulette,
      name: name.trim() || currentRoulette.name,
      updatedAt: Date.now(),
    };

    // 이미 저장된 룰렛이면 업데이트, 아니면 추가
    const updatedRoulettes = savedRoulettes.some(
      (r) => r.id === updatedRoulette.id,
    )
      ? savedRoulettes.map((r) =>
          r.id === updatedRoulette.id ? updatedRoulette : r,
        )
      : [...savedRoulettes, updatedRoulette];

    setCurrentRoulette(updatedRoulette);
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
  const spinRoulette = () => {
    if (isSpinning || !currentRoulette?.items.length) return;

    try {
      setIsSpinning(true);
      setSelectedItem(null);

      // 새로운 각도 계산 (10-20바퀴 사이의 회전)
      const spinCount = 10 + Math.random() * 10;
      const newSpinAngle = spinAngle + spinCount * 360;
      setSpinAngle(newSpinAngle);

      // 2.5-4초 후 결과 선택
      const spinDuration = 2500 + Math.random() * 1500;
      setTimeout(() => {
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

        setIsSpinning(false);
      }, spinDuration);
    } catch (error) {
      setIsSpinning(false);
      console.error("Error spinning roulette:", error);
    }
  };

  // 항목 목록 getter
  const items = currentRoulette ? currentRoulette.items : [];

  // Context 값
  const value: RouletteContextType = {
    currentRoulette,
    savedRoulettes,
    selectedItem,
    isSpinning,
    isAutoRemoveEnabled,
    spinAngle,
    items,
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
    setIsAutoRemoveEnabled,
  };

  return (
    <RouletteContext.Provider value={value}>
      {children}
    </RouletteContext.Provider>
  );
}
