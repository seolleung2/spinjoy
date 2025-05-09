import React from "react";
import { RouletteProvider } from "./RouletteContext";
import { SettingsProvider } from "./SettingsContext";

/**
 * 모든 Context Provider를 한 번에 연결하는 루트 Provider 컴포넌트
 * 애플리케이션의 최상위에서 이 컴포넌트를 사용하여 모든 Context를 함께 제공
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <RouletteProvider>{children}</RouletteProvider>
    </SettingsProvider>
  );
}
