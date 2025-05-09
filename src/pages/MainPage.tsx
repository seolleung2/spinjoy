import React from "react";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import RouletteSection from "@/components/roulette/RouletteSection";
import ItemInputSection from "@/components/items/ItemInputSection";
import SettingsSection from "@/components/settings/SettingsSection";

const MainPage: React.FC = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* 룰렛 섹션 - 모바일에서는 전체 너비, 태블릿 이상에서는 8/12 너비 */}
          <div className="md:col-span-8">
            <Card className="h-full p-4">
              <RouletteSection />
            </Card>
          </div>

          {/* 오른쪽 사이드 영역 - 입력과 설정 영역 */}
          <div className="space-y-6 md:col-span-4">
            {/* 항목 입력 영역 */}
            <Card className="p-4">
              <ItemInputSection />
            </Card>

            {/* 설정 영역 */}
            <Card className="p-4">
              <SettingsSection />
            </Card>
          </div>
        </div>
      </main>

      <footer className="text-muted-foreground py-4 text-center text-sm">
        <p>© 2025 SpinJoy. 모든 룰렛 데이터는 로컬에 저장됩니다.</p>
      </footer>
    </div>
  );
};

export default MainPage;
