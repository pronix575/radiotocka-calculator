import { useEffect } from "react";
import { CalculatorContainer } from "./calculator";

function App() {
  useEffect(() => {
    if (window.parent === window) return;

    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "resize", height }, "*");
    };

    sendHeight();
    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight);
    const interval = window.setInterval(sendHeight, 500);

    return () => {
      window.removeEventListener("load", sendHeight);
      window.removeEventListener("resize", sendHeight);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <CalculatorContainer />
    </>
  );
}

export default App;
