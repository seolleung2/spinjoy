/**
 * SpinJoy 사운드 관리 유틸리티
 */

/**
 * 사운드 타입 정의
 */
export type SoundType = "spin" | "result" | "click";

// 사운드 효과 맵 (캐싱)
const soundEffects: Record<string, HTMLAudioElement> = {};

/**
 * 사운드 URL 맵
 * 나중에 사운드 파일을 추가하면 여기에 매핑합니다.
 */
const soundUrls: Record<SoundType, string> = {
  spin: "/sounds/spin.mp3",
  result: "/sounds/result.mp3",
  click: "/sounds/click.mp3",
};

/**
 * 사운드 사전 로드 함수
 * 앱 초기화 시 호출하여 사운드 파일을 미리 로드해 둡니다.
 */
export const preloadSounds = (): void => {
  Object.entries(soundUrls).forEach(([key, url]) => {
    const audio = new Audio(url);
    audio.preload = "auto";
    soundEffects[key] = audio;
  });
};

/**
 * 사운드 재생 함수
 * @param type 재생할 사운드 타입
 * @param isSoundEnabled 사운드 활성화 여부
 */
export const playSound = (type: SoundType, isSoundEnabled: boolean): void => {
  if (!isSoundEnabled) return;

  // 사운드 효과가 캐시에 없으면 생성
  if (!soundEffects[type]) {
    const audio = new Audio(soundUrls[type]);
    soundEffects[type] = audio;
  }

  try {
    // 기존에 재생 중이면 처음부터 다시 재생
    const sound = soundEffects[type];
    sound.currentTime = 0;
    sound.play().catch((error) => {
      console.error(`Failed to play sound ${type}:`, error);
    });
  } catch (error) {
    console.error(`Error playing sound ${type}:`, error);
  }
};
