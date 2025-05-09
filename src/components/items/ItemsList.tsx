import React, { useState } from "react";
import { useRoulette } from "@/hooks/useRoulette";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon, PencilIcon, CheckIcon } from "lucide-react";

const ItemsList: React.FC = () => {
  const { items, updateItem, removeItem } = useRoulette();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // 항목 편집 시작
  const startEditing = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  // 항목 편집 저장
  const saveEdit = (id: string) => {
    if (editText.trim()) {
      updateItem(id, { name: editText.trim() });
    }
    setEditingId(null);
  };

  // 편집 취소
  const cancelEdit = () => {
    setEditingId(null);
  };

  if (items.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">
          항목을 추가하여 룰렛을 만들어보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
      <p className="text-muted-foreground text-sm">
        전체 {items.length}개 항목
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="bg-muted/50 flex items-center justify-between rounded-md p-2"
          >
            {editingId === item.id ? (
              <div className="flex flex-1 items-center gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                  className="h-8 flex-1 py-1"
                />
                <div className="flex items-center">
                  <Button
                    onClick={() => saveEdit(item.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <span className="flex-1 truncate text-sm">{item.name}</span>
                <div className="flex items-center">
                  <Button
                    onClick={() => startEditing(item.id, item.name)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => removeItem(item.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemsList;
