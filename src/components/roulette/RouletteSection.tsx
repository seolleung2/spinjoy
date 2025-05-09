import React from "react";
import { Button } from "@/components/ui/button";
import { useRoulette } from "@/hooks/useRoulette";
import RouletteWheel from "./RouletteWheel";
import SpinResult from "./SpinResult";

const RouletteSection: React.FC = () => {
  const { items, currentRoulette, spinRoulette, isSpinning, selectedItem } =
    useRoulette();

  // 룰렛 돌리기 핸들러
  const handleSpinClick = () => {
    if (items.length < 2) {
      alert("룰렛에는 최소 2개의 항목이 필요합니다.");
      return;
    }
    spinRoulette();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {currentRoulette?.name || "룰렛"}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSpinClick}
            disabled={isSpinning || items.length < 2}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            {isSpinning ? "돌아가는 중..." : "룰렛 돌리기"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              오른쪽에서 항목을 추가하여 룰렛을 만들어보세요.
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-8">
            {/* 룰렛 휠 컴포넌트 */}
            <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-full border-4 border-gray-200 p-2 shadow-lg">
              <RouletteWheel />
              <div className="pointer-events-none absolute top-0 left-0 z-0 flex h-full w-full items-center justify-center">
                <div className="text-muted-foreground text-2xl font-bold opacity-20">
                  SpinJoy
                </div>
              </div>
            </div>

            {/* 결과 컴포넌트 - 애니메이션 효과 추가 */}
            {selectedItem && (
              <div className="animate-fadeIn">
                <SpinResult />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteSection;
