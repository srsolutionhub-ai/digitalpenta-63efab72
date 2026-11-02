import { useLottie } from "lottie-react";
import idleAnimation from "@/assets/lottie/voice-idle.json";
import activeAnimation from "@/assets/lottie/voice-active.json";

interface VoiceAnimationProps {
  state: "idle" | "active";
  className?: string;
}

export default function VoiceAnimation({ state, className }: VoiceAnimationProps) {
  const { View } = useLottie({
    animationData: state === "active" ? activeAnimation : idleAnimation,
    autoplay: true,
    loop: true,
    rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
  }, { width: "100%", height: "100%" });

  return (
    <div className={className} aria-hidden="true">{View}</div>
  );
}