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
      key={state}
      animationData={state === "active" ? activeAnimation : idleAnimation}
      autoplay
      loop
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      style={{ width: "100%", height: "100%" }}
      className={className}
      aria-hidden="true"
    />
  );
}