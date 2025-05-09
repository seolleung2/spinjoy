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

      // 최종적으로 포인터가 가리킬 항목 랜덤 선택
      const itemCount = currentRoulette.items.length;
      const targetIndex = Math.floor(Math.random() * itemCount);

      // 항목 하나당 각도 계산
      const anglePerItem = 360 / itemCount;

      // 회전 바퀴수 계산 (기본 10바퀴 + 랜덤하게 추가)
      const fullRotations = 10 + Math.random() * 2;

      // [핵심 문제 해결] 포인터와 항목의 관계 재정립
      //
      // 문제 분석:
      // 1. 룰렛은 시계 방향으로 회전함 (transform: rotate(${spinAngle}deg))
      // 2. Canvas에서 항목은 12시 방향(kiwi)부터 시계 방향으로 그려짐
      // 3. 회전 각도가 290도일 때 포인터는 kiwi를 가리켜야 함 (로그와 실제화면 결과 불일치)

      // 포인터가 가리키는 각도와 대상 항목 인덱스의 관계:
      // 포인터는 항상 12시 방향(0도)에 고정되어 있음
      // 룰렛이 시계 방향으로 X도 회전했을 때, 포인터 위치에 있는 항목은
      // 360도에서 X도를 뺀 위치의 항목임 (360 - X)

      // ★★★★ 전면 수정: 문제 해결을 위한 근본적인 접근
      // 1. 룰렛은 시계 방향으로 회전
      // 2. 포인터는 항상 12시 방향(0도)에 있음
      // 3. 회전 후 targetIndex가 포인터 아래에 오도록 계산

      // 여기서 핵심은, 우리가 스크린샷에서 본 것처럼 targetIndex의 항목을 포인터 아래에 배치해야 함

      // ★★★★ 이 부분이 가장 중요: 선택 로직과 화면 표시 완전 동기화
      // 포인터 아래에 온 항목을 선택하도록 targetIndex에 해당하는 회전 각도를 계산
      // 항목은 시계 방향으로 배치: apple(0-72), banana(72-144), melon(144-216), kiwi(216-288), orange(288-360)
      // 회전 방향은 시계 방향임을 명심!
      const targetAngle = targetIndex * anglePerItem; // 항목 시작 각도
      const targetCenter = targetAngle + anglePerItem / 2; // 항목 중앙 각도

      // baseAngle을 계산:
      // 시각적 결과 일치를 위해 수정:
      // 룰렛이 시계방향으로 회전하고, 포인터가 12시 방향에 위치했을 때,
      // targetIndex의 항목이 포인터에 오도록 계산
      const baseAngle = targetCenter;

      // 최종 회전 각도 계산 (이전 회전 각도에서 계속해서 회전)
      const currentFullRotation = Math.floor(spinAngle / 360) * 360;
      const newSpinAngle =
        currentFullRotation + fullRotations * 360 + baseAngle;

      // 최종 회전 각도 설정
      setSpinAngle(newSpinAngle);

      // 애니메이션 완료 시간 (5-6초) - 룰렛 회전 트랜지션과 일치
      const spinDuration = 5000 + Math.random() * 1000;

      // 애니메이션이 종료된 후 선택된 항목 설정
      setTimeout(() => {
        // ★★★★ 중요: final angle에 따른 실제 선택 항목 계산 (각도에 기반)
        // finalAngle은 현재 회전한 각도(모듈로 360)
        const finalAngle = newSpinAngle % 360;

        // ★★★★ 이 부분이 핵심:
        // 룰렛이 시계방향으로 회전할 때, 포인터 위치(12시 방향)에는 어떤 항목이 위치하는가?

        // 룰렛이 시계 방향으로 회전했을 때 포인터 위치에 온 항목 계산
        // 360도 회전하면 다시 처음으로 돌아오므로 360으로 나눈 나머지 사용

        // 정확한 항목 인덱스 계산 로직 (실제 화면에 보이는 것과 일치)
        // 1. 각도를 0~360 범위로 정규화
        // 2. 시계 방향으로 finalAngle만큼 회전했을 때, 포인터는 원래 (360-finalAngle) 위치의 항목을 가리킴
        const pointerAngle = (360 - finalAngle) % 360;
        const visibleIndex =
          Math.floor(pointerAngle / anglePerItem) % itemCount;

        // 실제로 선택할 항목
        const realSelectedItem = currentRoulette.items[visibleIndex];

        // 디버깅을 위한 로그 출력 (개발용)
        console.log(
          `[결과] 원래 계산된 항목: ${currentRoulette.items[targetIndex].name}, 인덱스: ${targetIndex}/${itemCount}`,
        );
        console.log(
          `[각도] 항목당 각도: ${anglePerItem}도, 회전각도: ${newSpinAngle}도, 최종각도: ${finalAngle}도`,
        );
        console.log(
          `[계산] 기본각도: ${baseAngle}도, 회전수: ${fullRotations}바퀴, 포인터각도: ${pointerAngle}도`,
        );
        console.log(
          `[포인터] CSS 회전 방향: 시계방향 (양수), 실제 선택 항목: ${realSelectedItem.name}, 인덱스: ${visibleIndex}`,
        );

        // 모든 항목과 인덱스를 출력하여 디버깅에 도움을 줌
        console.log("[항목 목록] 현재 룰렛의 모든 항목:");
        currentRoulette.items.forEach((item, idx) => {
          const itemAngle = idx * anglePerItem;
          const isExpected = idx === targetIndex;
          const isSelected = idx === visibleIndex;
          console.log(
            `  - ${idx}: ${item.name} (각도: ${itemAngle}도~${itemAngle + anglePerItem}도) ${isExpected ? "✓예상" : ""} ${isSelected ? "★실제보임" : ""}`,
          );
        });

        // 포인터 위치에 있는 항목을 선택 결과로 설정
        setSelectedItem(realSelectedItem);

        // 자동 제거 옵션이 켜져 있으면 선택된 항목 제거
        if (isAutoRemoveEnabled && realSelectedItem) {
          setCurrentRoulette((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              items: prev.items.filter(
                (item) => item.id !== realSelectedItem.id,
              ),
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
