import React, { useState } from "react";
import CanvasBoard from "./components/CanvasBoard";
import Controls from "./components/Controls";
import OutputDisplay from "./components/OutputDisplay";

const App: React.FC = () => {
  const [output, setOutput] = useState<string>("");

  return (
    <div className="app">
      <Controls />
      <OutputDisplay result={output} /> {/* ✅ Display result below Controls */}
      <CanvasBoard setOutput={setOutput} />
    </div>
  );
};

export default App;