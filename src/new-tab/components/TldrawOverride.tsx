import { useState } from "react";
import {
  stopEventPropagation,
  Tldraw,
  TLEditorComponents,
  track,
  useEditor,
} from "tldraw";
import "tldraw/tldraw.css";
import { Button } from "./Button";

export default function TldrawOverride() {
  return (
    <div>
      {/* <div style={{ position: 'fixed', inset: 0 }}> */}
      <Tldraw components={components} />
    </div>
  );
}

function MyComponent() {
  const [state, setState] = useState(0);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 50,
          width: 200,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "goldenrod",
          zIndex: 0,
          userSelect: "unset",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)",
        }}
        onPointerDown={stopEventPropagation}
        onPointerMove={stopEventPropagation}
      >
        <p>The count is {state}! </p>
        <button onClick={() => setState((s) => s - 1)}>-1</button>
        <p>
          These components are on the canvas. They will scale with camera zoom
          like shapes.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 150,
          width: 200,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "pink",
          zIndex: 99999999,
          userSelect: "unset",
          boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)",
        }}
        onPointerDown={stopEventPropagation}
        onPointerMove={stopEventPropagation}
      >
        <p>The count is {state}! </p>
        <button onClick={() => setState((s) => s + 1)}>+1</button>
        <p>
          Create and select a shape to see the in front of the canvas component
        </p>
		<button className="btn">Button</button>
        <button className="btn btn-primary">Button</button>
      </div>
    </>
  );
}

//[2]
const MyComponentInFront = track(() => {
  const editor = useEditor();
  const selectionRotatedPageBounds = editor.getSelectionRotatedPageBounds();
  if (!selectionRotatedPageBounds) return null;

  const pageCoordinates = editor.pageToViewport(
    selectionRotatedPageBounds.point
  );

  return (
    <div
      style={{
        position: "absolute",
        top: Math.max(64, pageCoordinates.y - 64),
        left: Math.max(64, pageCoordinates.x),
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 10,
        background: "#efefef",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <p>This won’t scale with zoom.</p>
      <Button>DaisyUI BTN</Button>
      <button className="btn">Button</button>
      <button className="btn btn-primary">Button</button>
    </div>
  );
});

// [3]
const components: TLEditorComponents = {
  OnTheCanvas: MyComponent,
  InFrontOfTheCanvas: MyComponentInFront,
};
