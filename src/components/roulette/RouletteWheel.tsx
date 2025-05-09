import React, { useRef, useEffect } from "react";
import { useRoulette } from "@/hooks/useRoulette";

// 색상 배열 - 룰렛 섹션에 사용될 색상들
const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8AC926",
  "#1982C4",
  "#6A4C93",
  "#F15BB5",
];

const RouletteWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { items, isSpinning, spinAngle } = useRoulette();

  // 룰렛 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = (Math.min(width, height) / 2) * 0.9; // 약간의 여백을 줌

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 룰렛 섹션 그리기
    const totalItems = items.length;
    const arcSize = (2 * Math.PI) / totalItems;

    items.forEach((item, index) => {
      const startAngle = index * arcSize;
      const endAngle = (index + 1) * arcSize;
      const colorIndex = index % COLORS.length;

      // 섹션 그리기
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS[colorIndex];
      ctx.fill();
      ctx.stroke();

      // 텍스트 그리기
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arcSize / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px Arial";

      // 텍스트를 줄바꿈하여 표시
      const maxTextWidth = radius * 0.8;
      let displayText = item.name;
      if (ctx.measureText(displayText).width > maxTextWidth) {
        displayText = displayText.substring(0, 15) + "...";
      }

      ctx.fillText(displayText, radius * 0.8, 0);
      ctx.restore();
    });

    // 중앙 원 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.stroke();

    // 화살표 그리기
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 5, centerY);
    ctx.lineTo(centerX + radius - 15, centerY - 10);
    ctx.lineTo(centerX + radius - 15, centerY + 10);
    ctx.closePath();
    ctx.fillStyle = "#000000";
    ctx.fill();
  }, [items, spinAngle]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{
        transform: `rotate(${spinAngle}deg)`,
        transition: isSpinning
          ? "transform 5s cubic-bezier(0.0, 0.0, 0.2, 1)"
          : "none",
      }}
      width={400}
      height={400}
    />
  );
};

export default RouletteWheel;
