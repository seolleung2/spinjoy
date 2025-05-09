import React, { useState } from "react";
import {
  PlusIcon,
  RefreshCwIcon,
  SaveIcon,
  FolderOpenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoulette } from "@/hooks/useRoulette";
import ItemsList from "./ItemsList.tsx";
import SaveRouletteDialog from "./SaveRouletteDialog.tsx";
import LoadRouletteDialog from "./LoadRouletteDialog.tsx";

const ItemInputSection: React.FC = () => {
  const { addItem, items, clearItems } = useRoulette();
  const [newItemText, setNewItemText] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);

  // 항목 추가 핸들러
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addItem({ name: newItemText.trim() });
      setNewItemText("");
    }
  };

  // 모든 항목 초기화 핸들러
  const handleClearItems = () => {
    if (items.length === 0) return;

    if (window.confirm("모든 항목을 초기화하시겠습니까?")) {
      clearItems();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">항목 관리</h2>

      {/* 항목 입력 폼 */}
      <form onSubmit={handleAddItem} className="flex items-center space-x-2">
        <div className="flex-1">
          <Label htmlFor="new-item" className="sr-only">
            새 항목
          </Label>
          <Input
            id="new-item"
            type="text"
            placeholder="항목 이름 입력"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
        </div>
        <Button type="submit" size="icon" disabled={!newItemText.trim()}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </form>

      {/* 항목 액션 버튼들 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsSaveDialogOpen(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <SaveIcon className="h-4 w-4" />
            <span>저장</span>
          </Button>
          <Button
            onClick={() => setIsLoadDialogOpen(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <FolderOpenIcon className="h-4 w-4" />
            <span>불러오기</span>
          </Button>
        </div>
        <Button
          onClick={handleClearItems}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          disabled={items.length === 0}
        >
          <RefreshCwIcon className="h-4 w-4" />
          <span>초기화</span>
        </Button>
      </div>

      {/* 항목 목록 */}
      <ItemsList />

      {/* 저장/불러오기 다이얼로그 */}
      <SaveRouletteDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
      />
      <LoadRouletteDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
      />
    </div>
  );
};

export default ItemInputSection;
