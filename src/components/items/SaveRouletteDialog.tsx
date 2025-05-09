import React, { useState } from "react";
import { useRoulette } from "@/hooks/useRoulette";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveRouletteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SaveRouletteDialog: React.FC<SaveRouletteDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { saveCurrentRoulette, currentRoulette, items } = useRoulette();
  const [rouletteName, setRouletteName] = useState(currentRoulette?.name || "");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = () => {
    if (!rouletteName.trim()) {
      setErrorMessage("룰렛 이름을 입력해주세요.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("저장할 항목이 없습니다.");
      return;
    }

    saveCurrentRoulette(rouletteName);
    onOpenChange(false);
    setRouletteName("");
    setErrorMessage("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // 다이얼로그가 열릴 때 현재 룰렛 이름으로 초기화
      setRouletteName(currentRoulette?.name || "");
      setErrorMessage("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>룰렛 저장하기</DialogTitle>
          <DialogDescription>
            현재 룰렛을 저장하여 나중에 다시 불러올 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roulette-name" className="text-right">
              룰렛 이름
            </Label>
            <Input
              id="roulette-name"
              value={rouletteName}
              onChange={(e) => setRouletteName(e.target.value)}
              className="col-span-3"
              placeholder="예: 점심 메뉴 룰렛"
            />
          </div>

          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-muted-foreground text-right text-sm">
              항목 수
            </div>
            <div className="col-span-3 text-sm">{items.length}개</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={items.length === 0}>
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveRouletteDialog;
