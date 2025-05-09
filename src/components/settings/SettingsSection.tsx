import React from "react";
import { useSettings } from "@/hooks/useSettings";
import { useRoulette } from "@/hooks/useRoulette";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsSection: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useSettings();
  const { isAutoRemoveEnabled, setIsAutoRemoveEnabled } = useRoulette();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">설정</h2>

      <div className="space-y-4">
        {/* 당첨 항목 자동 제거 설정 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-remove">당첨 항목 자동 제거</Label>
            <p className="text-muted-foreground text-sm">
              룰렛 결과로 선택된 항목을 자동으로 제거합니다
            </p>
          </div>
          <Switch
            id="auto-remove"
            checked={isAutoRemoveEnabled}
            onCheckedChange={setIsAutoRemoveEnabled}
          />
        </div>

        {/* 사운드 설정 */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-toggle">사운드 효과</Label>
            <p className="text-muted-foreground text-sm">
              룰렛 회전 및 결과 발표 시 효과음을 재생합니다
            </p>
          </div>
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
        </div>
      </div>

      <div className="pt-4">
        <p className="text-muted-foreground text-xs">
          모든 룰렛 데이터는 현재 브라우저에 저장되며, 다른 기기와 동기화되지
          않습니다.
        </p>
      </div>
    </div>
  );
};

export default SettingsSection;
