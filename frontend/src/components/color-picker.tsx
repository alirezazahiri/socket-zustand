import { useCanvasColorStore } from "@/stores/canvas/hooks";

export const COLORS = [
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
];

export default function ColorPicker() {
  const { drawingColor, setDrawingColor } = useCanvasColorStore();

  const handleColorChange = (color: string) => {
    setDrawingColor(color);
  };

  return (
    <div className="flex gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange(color)}
          className={`w-8 h-8 rounded-full border border-foreground ${
            drawingColor === color ? "border-2" : ""
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
