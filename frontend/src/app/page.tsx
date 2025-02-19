import Actions from "@/components/Actions";
import Canvas from "@/components/Canvas";
import { CanvasProvider } from "@/providers/canvas.provider";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <h1>Collaborative Drawing Board</h1>
      </header>
      <main>
        <CanvasProvider>
          <Canvas />
          <Actions />
        </CanvasProvider>
      </main>
      <footer>
        <h1>Draw together in real-time</h1>
      </footer>
    </div>
  );
}
