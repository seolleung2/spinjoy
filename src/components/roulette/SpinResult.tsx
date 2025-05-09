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
    <Card className="border-primary animate-fadeIn mx-auto w-full max-w-md border-2 border-yellow-400 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-center gap-2 text-center">
          <span className="animate-bounce text-red-500">🎉</span>
          <span>당첨 결과</span>
          <span className="animate-bounce text-red-500 delay-150">🎉</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-6 text-center">
        <div className="flex items-center justify-center">
          <div className="w-full animate-pulse rounded-lg border-2 border-yellow-300 bg-gradient-to-r from-yellow-100 to-amber-100 px-8 py-6 shadow-inner dark:from-yellow-900/50 dark:to-amber-900/50">
            <div className="flex flex-col items-center">
              <div className="text-primary/70 mb-2 text-sm font-medium">
                선택된 항목:
              </div>
              <p className="text-primary rounded-md bg-yellow-50 px-4 py-2 text-3xl font-bold shadow-inner">
                {selectedItem.name}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-yellow-600">🏆</span>
                <span className="text-muted-foreground text-xs font-medium">
                  회전이 완료되었습니다
                </span>
                <span className="text-yellow-600">🏆</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {!isAutoRemoveEnabled && (
        <CardFooter className="justify-center pt-0 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveItem}
            className="flex items-center gap-1 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
