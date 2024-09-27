import "./App.css";
import PlotComponent from "./components/PlotComponent";

function App() {
  return (
    <section className="flex flex-col items-center justify-center h-screen text-neutral-200 bg-[#14191D]">
      <h1 className="text-3xl font-bold">Messari Take Home Test</h1>
      <h1 className="text-lg mb-10">Aidan McAlister</h1>
      <PlotComponent />
      <p className="text-xs italic mt-10 opacity-80">
        The data presented may not be entirely accurate. In a professional
        setting, I would get clarification and ensure I have a proper
        understanding of what each number represents.
      </p>
    </section>
  );
}
export default App;
