import Lottie from "lottie-react";
import idleAnimation from "@/assets/lottie/voice-idle.json";
import activeAnimation from "@/assets/lottie/voice-active.json";

interface VoiceAnimationProps {
  state: "idle" | "active";
  className?: string;
}

export default function VoiceAnimation({ state, className }: VoiceAnimationProps) {
  return (
    <Lottie
      animationData={state === "active" ? activeAnimation : idleAnimation}
      autoplay
      loop
      className={className}
      aria-hidden="true"
    />
  );
}