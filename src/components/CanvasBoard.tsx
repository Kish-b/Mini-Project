import React, { useRef, useState } from "react";

interface CanvasBoardProps {
  setOutput: (output: string) => void;
}

const CanvasBoard: React.FC<CanvasBoardProps> = ({ setOutput }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  // Start drawing
  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  // Draw on the canvas
  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => setDrawing(false);

  // Clear the canvas & result
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setOutput(""); // Clear the result display
  };

  // Analyze the drawing and send to backend
  const analyzeDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "drawing.png");

      try {
        const response = await fetch("http://127.0.0.1:8000/analyze/", {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json", // Prevents auto-downloading of files
          },
        });

        const data = await response.json();
        console.log("🔹 API Response:", data.result); // Print result in console
        setOutput(data.result);
      } catch (error) {
        console.error("❌ Error:", error);
      }
    }, "image/png");
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        style={{ background: "black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing} // Prevents drawing issues when mouse leaves canvas
      />
      <div className="buttons">
        <button onClick={analyzeDrawing}>Run</button>
        <button onClick={clearCanvas}>Reset</button>
      </div>
    </div>
  );
};

export default CanvasBoard;