import { useEffect, useState } from "react";

type MobileViewportState = {
  isKeyboardOpen: boolean;
  keyboardInset: number;
};

const KEYBOARD_OPEN_THRESHOLD = 120;

export function useMobileViewport(): MobileViewportState {
  const [state, setState] = useState<MobileViewportState>({
    isKeyboardOpen: false,
    keyboardInset: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateViewport = () => {
      const visualViewport = window.visualViewport;

      if (!visualViewport) {
        document.documentElement.style.setProperty(
          "--app-viewport-height",
          `${window.innerHeight}px`,
        );
        setState({
          isKeyboardOpen: false,
          keyboardInset: 0,
        });
        return;
      }

      const viewportHeight = Math.round(visualViewport.height);
      const keyboardInset = Math.max(
        window.innerHeight - visualViewport.height - visualViewport.offsetTop,
        0,
      );

      document.documentElement.style.setProperty(
        "--app-viewport-height",
        `${viewportHeight}px`,
      );

      setState({
        isKeyboardOpen: keyboardInset > KEYBOARD_OPEN_THRESHOLD,
        keyboardInset,
      });
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      document.documentElement.style.removeProperty("--app-viewport-height");
    };
  }, []);

  return state;
}
