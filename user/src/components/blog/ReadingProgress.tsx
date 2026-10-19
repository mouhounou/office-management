import { useEffect, useState } from "react";

/** Fine barre cyan en haut de l'écran qui suit la lecture de l'article. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = document.getElementById(targetId);
      if (!target) return;
      const { top, height } = target.getBoundingClientRect();
      const total = height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -top / total)) : 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId]);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1" aria-hidden>
      <div
        className="h-full origin-left gradient-cyan transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
