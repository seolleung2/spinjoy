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
          <div className="flex w-full flex-col items-center gap-6">
            {/* 룰렛 휠 컴포넌트 */}
            <div className="relative aspect-square w-full max-w-md">
              <RouletteWheel />
            </div>

            {/* 결과 컴포넌트 */}
            {selectedItem && <SpinResult />}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteSection;
