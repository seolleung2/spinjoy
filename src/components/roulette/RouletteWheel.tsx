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

// 색상의 밝기를 계산하는 함수 (RGB 값에 따른 밝기)
const getColorBrightness = (hexColor: string): number => {
  // HEX를 RGB로 변환
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // 밝기 계산 (인간의 눈에 맞춰 가중치 적용)
  return (r * 299 + g * 587 + b * 114) / 1000;
};

// 색상을 더 밝게 만드는 함수
const lightenColor = (hexColor: string, percent: number): string => {
  // HEX를 RGB로 변환
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);

  // 각 색상 채널을 밝게 조정 (255에 가까워질수록 밝아짐)
  const newR = Math.min(255, r + (255 - r) * (percent / 100));
  const newG = Math.min(255, g + (255 - g) * (percent / 100));
  const newB = Math.min(255, b + (255 - b) * (percent / 100));

  // RGB를 다시 HEX 형식으로 변환
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

const RouletteWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { items, isSpinning, spinAngle, selectedItem } = useRoulette();

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
    const radius = (Math.min(width, height) / 2) * 0.85; // 약간의 여백을 줌

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 외부 테두리 그리기 (뚜렷한 경계선)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#f8f9fa"; // 밝은 배경색
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#343a40"; // 진한 테두리
    ctx.stroke();

    // 룰렛 섹션 그리기
    const totalItems = items.length;
    const arcSize = (2 * Math.PI) / totalItems;

    items.forEach((item, index) => {
      // 각 항목은 12시 방향(상단)에서 시작하여 시계 방향으로 배치
      // Canvas의 좌표계: 0도는 3시 방향이고 시계 방향으로 각도가 증가함
      // 12시 방향이 시작점이 되도록 -π/2(90도) 조정
      const startAngle = index * arcSize;
      const endAngle = (index + 1) * arcSize;
      const colorIndex = index % COLORS.length;
      const isCurrentlySelected =
        selectedItem && !isSpinning && selectedItem.id === item.id;

      // 섹션 그리기
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      // 12시 방향이 시작점(0도)이 되도록 -π/2 조정
      // 항목은 캔버스 상에서 시계방향으로 그려지며, 시계방향으로 회전함
      ctx.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2 + startAngle,
        -Math.PI / 2 + endAngle,
      );
      ctx.closePath();

      // 항목 색상 설정
      ctx.fillStyle = COLORS[colorIndex];

      // 선택된 항목은 더 강조되게 처리
      if (isCurrentlySelected) {
        ctx.save();
        // 강한 그림자 효과 추가
        ctx.shadowColor = "rgba(255, 215, 0, 0.9)";
        ctx.shadowBlur = 25;

        // 더 밝은 색상으로 채우기 (현재보다 20% 더 밝게)
        const origColor = COLORS[colorIndex];
        ctx.fillStyle = lightenColor(origColor, 20);
      }

      ctx.fill();

      if (isCurrentlySelected) {
        ctx.restore(); // 효과 원상복구
      }

      // 테두리 그리기 (선택된 항목은 더 굵고 눈에 띄는 테두리)
      if (isCurrentlySelected) {
        ctx.strokeStyle = "#FFD700"; // 금색 테두리
        ctx.lineWidth = 4; // 더 굵은 테두리
      } else {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
      }
      ctx.stroke();

      // 텍스트 그리기
      ctx.save();
      ctx.translate(centerX, centerY);
      // 텍스트 회전 - 12시 방향이 0도이므로 -π/2 + 각도로 조정
      ctx.rotate(-Math.PI / 2 + startAngle + arcSize / 2);
      ctx.textAlign = "right";

      // 텍스트 색상 계산
      const isDarkColor = getColorBrightness(COLORS[colorIndex]) < 128;
      ctx.fillStyle = isDarkColor ? "#FFFFFF" : "#000000";

      // 선택된 항목은 더 굵게 표시
      ctx.font = isCurrentlySelected ? "bold 14px Arial" : "bold 13px Arial";

      // 텍스트 표시
      const maxTextWidth = radius * 0.75;
      let displayText = item.name;
      if (ctx.measureText(displayText).width > maxTextWidth) {
        // 긴 텍스트는 잘라서 ...로 표시
        const maxChars = Math.floor(
          15 * (maxTextWidth / ctx.measureText(displayText).width),
        );
        displayText = displayText.substring(0, maxChars) + "...";
      }

      ctx.fillText(displayText, radius * 0.75, 5); // y 위치를 조금 조정하여 중앙에 더 가깝게
      ctx.restore();
    });

    // 중앙 원 그리기
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.15, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#343a40";
    ctx.stroke();

    // 중앙 로고 표시
    ctx.fillStyle = "#343a40";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SpinJoy", centerX, centerY);
  }, [items, spinAngle, isSpinning, selectedItem]);

  return (
    <div className="relative h-full w-full">
      {/* 상단 고정 포인터 - 더 명확하고 큰 디자인 */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center">
          {/* 포인터 화살표 - 더 큰 사이즈와 애니메이션 */}
          <div className="animate-pulse-slow h-0 w-0 border-t-[40px] border-r-[25px] border-l-[25px] border-t-red-600 border-r-transparent border-l-transparent drop-shadow-xl filter transition-all duration-300"></div>
          {/* 당첨 표시 배경 강화 */}
          <div className="rounded-full border-2 border-yellow-300 bg-gradient-to-r from-red-600 to-red-700 px-5 py-1 text-sm font-bold text-white shadow-lg">
            당첨
          </div>
        </div>

        {/* 포인터 중심선 - 명확한 중심점 표시 */}
        <div className="absolute top-0 left-1/2 h-[50px] w-[2px] -translate-x-1/2 bg-red-500"></div>
      </div>

      {/* 수직 기준선 - 선택 위치를 명확하게 표시 */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-5 w-[2px] -translate-x-1/2 bg-red-500 opacity-40"></div>

      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          transform: `rotate(${spinAngle}deg)`, // 시계 방향으로 회전
          transition: isSpinning
            ? "transform 5s cubic-bezier(0.15, 0.85, 0.25, 1)" // 더 자연스러운 회전 효과
            : "transform 0.5s cubic-bezier(0, 0, 0.2, 1)", // 멈출 때 부드럽게 감속
          boxShadow: isSpinning ? "0 0 15px rgba(0,0,0,0.2)" : "none",
        }}
        width={400}
        height={400}
      />
    </div>
  );
};

export default RouletteWheel;
