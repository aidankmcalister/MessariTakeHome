import { useState, useEffect } from "react";
import "./App.css";
import * as d3 from "d3";
import Plot from "./components/Plot";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    d3.csv("./assets/messariData.csv").then(setData);
  }, []);
  return (
    <section>
      <h1 className="text-3xl font-bold underline">Messari Take Home Test</h1>
      <Plot data={data} />{" "}
    </section>
  );
}
export default App;
