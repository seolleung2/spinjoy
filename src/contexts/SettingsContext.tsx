import React, { createContext, useState, useEffect } from "react";

/**
 * 애플리케이션 사용자 설정 타입 정의
 */
interface SettingsData {
  // 사운드 활성화 여부
  isSoundEnabled: boolean;
  // 테마 설정 (기본값: 라이트 모드)
  theme: "light" | "dark";
}

/**
 * 설정 Context 타입 정의
 */
interface SettingsContextType {
  // 설정 상태
  settings: SettingsData;
  // 사운드 토글 함수
  toggleSound: () => void;
  // 테마 토글 함수 (향후 다크 모드 지원 시 사용)
  toggleTheme: () => void;
}

// 기본 설정 값
const DEFAULT_SETTINGS: SettingsData = {
  isSoundEnabled: true,
  theme: "light",
};

// Context 생성
// eslint-disable-next-line react-refresh/only-export-components
export const SettingsContext = createContext<SettingsContextType | null>(null);

/**
 * Settings Context Provider 컴포넌트
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // 설정 상태
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);

  // 컴포넌트 마운트 시 LocalStorage에서 설정 불러오기
  useEffect(() => {
    const savedSettings = localStorage.getItem("spinjoy_settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsedSettings,
        });
      } catch (error) {
        console.error("Failed to parse settings from localStorage:", error);
      }
    }
  }, []);

  // 설정 변경 시 LocalStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem("spinjoy_settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  // 사운드 설정 토글
  const toggleSound = () => {
    setSettings((prev) => ({
      ...prev,
      isSoundEnabled: !prev.isSoundEnabled,
    }));
  };

  // 테마 설정 토글 (향후 다크모드 구현 시 사용)
  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  // Context 값
  const value: SettingsContextType = {
    settings,
    toggleSound,
    toggleTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
