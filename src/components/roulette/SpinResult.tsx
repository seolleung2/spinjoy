import React from "react";
import { useRoulette } from "@/hooks/useRoulette";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";

const SpinResult: React.FC = () => {
  const { selectedItem, removeItem, isAutoRemoveEnabled } = useRoulette();

  if (!selectedItem) return null;

  // 결과 항목 제거 핸들러
  const handleRemoveItem = () => {
    if (selectedItem) {
      removeItem(selectedItem.id);
    }
  };

  return (
    <Card className="border-primary mx-auto w-full max-w-md border-2 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-center">결과</CardTitle>
      </CardHeader>
      <CardContent className="py-6 text-center">
        <p className="text-3xl font-bold">{selectedItem.name}</p>
      </CardContent>
      {!isAutoRemoveEnabled && (
        <CardFooter className="justify-center pt-0 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveItem}
            className="flex items-center gap-1"
          >
            <Trash2Icon className="h-4 w-4" />
            <span>이 항목 제거하기</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SpinResult;
