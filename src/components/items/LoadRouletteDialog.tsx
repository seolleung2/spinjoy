import React from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrashIcon } from "lucide-react";

interface LoadRouletteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoadRouletteDialog: React.FC<LoadRouletteDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { savedRoulettes, loadRoulette, deleteRoulette } = useRoulette();

  // 룰렛 불러오기 핸들러
  const handleLoadRoulette = (id: string) => {
    loadRoulette(id);
    onOpenChange(false);
  };

  // 룰렛 삭제 핸들러
  const handleDeleteRoulette = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("이 룰렛을 삭제하시겠습니까?")) {
      deleteRoulette(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>저장된 룰렛 불러오기</DialogTitle>
          <DialogDescription>
            이전에 저장한 룰렛 중에서 선택하세요.
          </DialogDescription>
        </DialogHeader>

        {savedRoulettes.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">저장된 룰렛이 없습니다.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] rounded-md border p-2">
            <div className="space-y-2">
              {savedRoulettes.map((roulette) => (
                <div
                  key={roulette.id}
                  onClick={() => handleLoadRoulette(roulette.id)}
                  className="bg-muted/50 hover:bg-muted flex cursor-pointer items-center justify-between rounded-md p-3"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{roulette.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {roulette.items.length}개 항목 •{" "}
                      {new Date(roulette.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteRoulette(roulette.id, e)}
                    className="opacity-50 hover:opacity-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoadRouletteDialog;
