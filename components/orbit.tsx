"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import { CanvasTexture, type Group } from "three";
import { defaultColors, onColor } from "@/lib/palettes";
type Paint = {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  text: string;
};
function Block({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  const material = (
    <meshStandardMaterial
      color={color}
      roughness={0.55}
      metalness={0.12}
      toneMapped={false}
    />
  );
  const radius = Math.min(...size) * 0.32;
  return Math.min(...size) >= 0.06 ? (
    <RoundedBox
      position={position}
      args={size}
      radius={radius}
      smoothness={3}
      bevelSegments={3}
    >
      {material}
    </RoundedBox>
  ) : (
    <mesh position={position}>
      <boxGeometry args={size} />
      {material}
    </mesh>
  );
}
/** Locally drawn labels: no font downloads or additional client dependencies. */
function ModelLabel({
  text,
  color,
  position,
  width = 0.7,
  rotation = [0, 0, 0],
}: {
  text: string;
  color: string;
  position: [number, number, number];
  width?: number;
  rotation?: [number, number, number];
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = onColor(color);
      context.beginPath();
      context.roundRect(4, 4, 504, 120, 18);
      context.fill();
      context.strokeStyle = color;
      context.lineWidth = 3;
      context.stroke();
      context.fillStyle = color;
      context.font = "600 66px monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, 256, 64);
    }
    return new CanvasTexture(canvas);
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, width / 4]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
/** An exploded website: structure, visual design, logic, and data become one interface. */
function Object3D({ paint, dragging }: { paint: Paint; dragging: boolean }) {
  const ref = useRef<Group>(null);
  const layers = useRef<Group>(null);
  const separation = useRef(0);
  const width = useThree((state) => state.size.width);
  const scale = Math.min(1.34, width / 290) * 0.75;
  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    if (ref.current)
      ref.current.rotation.y = 0.3 + Math.sin(time * 0.18) * 0.35;
    separation.current +=
      ((dragging ? 1 : 0) - separation.current) * (1 - Math.exp(-delta * 5));
    if (ref.current) {
      for (const part of ref.current.children) {
        // Capture each local position once; palette rerenders retain the same objects.
        const origin = (part.userData.assemblyOrigin ??= part.position.clone());
        const amount = separation.current;
        part.position.set(
          origin.x * (1 + amount * 0.18),
          origin.y * (1 + amount * 0.18),
          origin.z + (origin.z < 0 ? -1 : 1) * amount * 0.38,
        );
      }
    }
    if (layers.current)
      layers.current.position.z =
        0.12 + (Math.sin(time * 0.65) + 1) * 0.1 + separation.current * 0.55;
  });
  return (
    <group scale={scale}>
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.3}>
        <group ref={ref} rotation={[-0.12, 0.3, -0.08]}>
          {/* Clean structural cage: perimeter rails and an orthogonal layout grid. */}
          <group position={[0, 0.12, -0.42]}>
            {[-1.275, 1.275].flatMap((x) =>
              [-0.925, 0.925].map((y) => (
                <Block
                  key={`${x}-${y}`}
                  position={[x, y, 0.32]}
                  size={[0.025, 0.025, 0.72]}
                  color={paint.secondary}
                />
              )),
            )}
            {[-0.04, 0.68].flatMap((z) =>
              [-0.925, 0.925].map((y) => (
                <Block
                  key={`${z}-${y}`}
                  position={[0, y, z]}
                  size={[2.575, 0.025, 0.025]}
                  color={paint.secondary}
                />
              )),
            )}
            {[-0.04, 0.68].flatMap((z) =>
              [-1.275, 1.275].map((x) => (
                <Block
                  key={`${z}-${x}`}
                  position={[x, 0, z]}
                  size={[0.025, 1.85, 0.025]}
                  color={paint.secondary}
                />
              )),
            )}
            {[-0.64, 0, 0.64].map((x) => (
              <Block
                key={x}
                position={[x, 0, 0.02]}
                size={[0.015, 1.8, 0.015]}
                color={paint.accent}
              />
            ))}
            {[-0.46, 0, 0.46].map((y) => (
              <Block
                key={y}
                position={[0, y, 0.02]}
                size={[2.5, 0.015, 0.015]}
                color={paint.accent}
              />
            ))}
          </group>
          {/* Floor and ceiling close the room while its front remains an interface. */}
          {[-0.82, 1.06].map((y) => (
            <group key={y} position={[0, y, -0.1]}>
              <Block
                position={[0, 0, 0]}
                size={[2.62, 0.07, 0.8]}
                color={paint.surface}
              />
              <Block
                position={[0, 0, 0.41]}
                size={[2.62, 0.035, 0.025]}
                color={paint.secondary}
              />
              {[-0.8, 0, 0.8].map((x) => (
                <Block
                  key={x}
                  position={[x, 0.043, 0]}
                  size={[0.025, 0.015, 0.68]}
                  color={paint.primary}
                />
              ))}
            </group>
          ))}
          {/* Finished reverse: a backplane, circuit buses, and service modules. */}
          <Block
            position={[0, 0.12, -0.5]}
            size={[2.55, 1.85, 0.08]}
            color={paint.surface}
          />
          <Block
            position={[0, 0.12, -0.57]}
            size={[0.6, 0.65, 0.08]}
            color={paint.primary}
          />
          {[-0.63, -0.35, 0.35, 0.63].map((y) => (
            <Block
              key={y}
              position={[0, y + 0.12, -0.56]}
              size={[2.1, 0.025, 0.025]}
              color={paint.secondary}
            />
          ))}
          {[-0.95, 0.95].map((x) => (
            <group key={x}>
              <Block
                position={[x, 0.12, -0.57]}
                size={[0.025, 1.35, 0.025]}
                color={paint.accent}
              />
              {[-0.36, 0.18, 0.65].map((y) => (
                <Block
                  key={y}
                  position={[x, y, -0.63]}
                  size={[0.3, 0.22, 0.12]}
                  color={paint.secondary}
                />
              ))}
            </group>
          ))}
          <ModelLabel
            text="API"
            color={paint.text}
            position={[-0.78, -0.98, 0.085]}
            width={0.5}
          />
          {/* An edge-mounted server rack and network ports. */}
          {[0, 0.16, 0.32].map((y) => (
            <group key={y} position={[-0.78, -1.04 + y, -0.12]}>
              <Block
                position={[0, 0, 0]}
                size={[0.75, 0.12, 0.32]}
                color={paint.secondary}
              />
              <Block
                position={[-0.23, 0, 0.18]}
                size={[0.08, 0.04, 0.025]}
                color={paint.accent}
              />
              <Block
                position={[0.08, 0, 0.18]}
                size={[0.28, 0.025, 0.025]}
                color={paint.surface}
              />
            </group>
          ))}
          <Block
            position={[-0.78, -0.65, -0.25]}
            size={[0.025, 0.5, 0.025]}
            color={paint.primary}
          />
          {/* Structure rails connect the exploded interface to its skeleton. */}
          {[-1.15, 1.15].flatMap((x) =>
            [-0.62, 0.87].map((y) => (
              <Block
                key={`${x}-${y}`}
                position={[x, y, -0.05]}
                size={[0.025, 0.025, 0.8]}
                color={paint.secondary}
              />
            )),
          )}
          <group ref={layers}>
            <Block
              position={[0, 0.12, 0.12]}
              size={[2.55, 1.85, 0.12]}
              color={paint.surface}
            />
            <Block
              position={[0, 0.91, 0.2]}
              size={[2.45, 0.2, 0.06]}
              color={paint.secondary}
            />
            {[-1.08, -0.91, -0.74].map((x) => (
              <mesh key={x} position={[x, 0.91, 0.25]}>
                <sphereGeometry args={[0.035, 8, 8]} />
                <meshBasicMaterial color={paint.primary} />
              </mesh>
            ))}
            <Block
              position={[-0.56, 0.29, 0.22]}
              size={[1.03, 0.82, 0.08]}
              color={paint.primary}
            />
            {/* A miniature page: headline, copy, CTA and three content cards. */}
            {[0.5, 0.33, 0.16].map((y, i) => (
              <Block
                key={y}
                position={[0.55, y, 0.23]}
                size={[i === 0 ? 0.85 : 0.65, 0.06, 0.025]}
                color={i === 0 ? paint.text : paint.secondary}
              />
            ))}
            <Block
              position={[0.4, -0.05, 0.25]}
              size={[0.55, 0.16, 0.06]}
              color={paint.accent}
            />
            {[-0.81, 0, 0.81].map((x, i) => (
              <Block
                key={x}
                position={[x, -0.48, 0.24]}
                size={[0.67, 0.34, 0.09]}
                color={i === 1 ? paint.primary : paint.secondary}
              />
            ))}
            <ModelLabel
              text="INTERFACE"
              color={paint.surface}
              position={[0.35, 0.91, 0.25]}
              width={0.8}
            />
            <ModelLabel
              text="&lt;/&gt;"
              color={paint.surface}
              position={[-0.56, 0.3, 0.27]}
              width={0.8}
            />
            {/* A pixel arrow cursor points toward the call-to-action. */}
            <group position={[0.64, -0.11, 0.32]} rotation={[0, 0, -0.45]}>
              {[0, 1, 2].map((i) => (
                <Block
                  key={i}
                  position={[i * 0.045, -i * 0.045, 0]}
                  size={[0.045 * (i + 1), 0.045, 0.03]}
                  color={paint.text}
                />
              ))}
              <Block
                position={[0.08, -0.18, 0]}
                size={[0.045, 0.15, 0.03]}
                color={paint.text}
              />
            </group>
          </group>
          {/* A mounted color sample tray with an integrated nameplate. */}
          <group position={[0, 1.34, 0.05]}>
            <Block
              position={[0, 0, -0.09]}
              size={[1.65, 0.43, 0.08]}
              color={paint.surface}
            />
            {[paint.primary, paint.secondary, paint.accent].map((color, i) => (
              <Block
                key={i}
                position={[-0.53 + i * 0.53, 0, 0]}
                size={[0.4, 0.3, 0.15]}
                color={color}
              />
            ))}
            <Block
              position={[0, -0.29, -0.02]}
              size={[0.86, 0.23, 0.06]}
              color={paint.secondary}
            />
            <ModelLabel
              text="COLOR"
              color={paint.text}
              position={[0, -0.29, 0.016]}
              width={0.78}
            />
          </group>
          {/* Wall-mounted modules stay attached while each wall disassembles. */}
          <group position={[-1.3, 0.12, -0.1]}>
            <ModelLabel
              text="JS"
              color={paint.surface}
              position={[-0.22, 0, 0]}
              width={0.32}
              rotation={[0, -Math.PI / 2, 0]}
            />
            <ModelLabel
              text="LOGIC"
              color={paint.text}
              position={[-0.06, 0.55, 0]}
              width={0.6}
              rotation={[0, -Math.PI / 2, 0]}
            />
            <Block
              position={[0, 0, 0]}
              size={[0.075, 1.85, 0.8]}
              color={paint.surface}
            />
            {[-0.89, 0.89].map((y) => (
              <Block
                key={y}
                position={[0, y, 0]}
                size={[0.09, 0.025, 0.8]}
                color={paint.secondary}
              />
            ))}
            <Block
              position={[-0.05, 0, 0.36]}
              size={[0.035, 1.85, 0.035]}
              color={paint.secondary}
            />
            <Block
              position={[-0.12, 0, 0]}
              size={[0.18, 0.52, 0.4]}
              color={paint.accent}
            />
            {[-0.24, 0, 0.24].map((y) => (
              <group key={y}>
                <Block
                  position={[-0.065, y, 0]}
                  size={[0.025, 0.025, 0.68]}
                  color={paint.primary}
                />
                <Block
                  position={[-0.075, y, 0.29]}
                  size={[0.05, 0.08, 0.08]}
                  color={paint.secondary}
                />
              </group>
            ))}
          </group>
          <group position={[1.3, 0.12, -0.1]}>
            <ModelLabel
              text="DATA"
              color={paint.text}
              position={[0.06, 0.67, 0]}
              width={0.6}
              rotation={[0, Math.PI / 2, 0]}
            />
            <Block
              position={[0, 0, 0]}
              size={[0.075, 1.85, 0.8]}
              color={paint.surface}
            />
            {[-0.89, 0.89].map((y) => (
              <Block
                key={y}
                position={[0, y, 0]}
                size={[0.09, 0.025, 0.8]}
                color={paint.secondary}
              />
            ))}
            <Block
              position={[0.05, 0, 0.36]}
              size={[0.035, 1.85, 0.035]}
              color={paint.secondary}
            />
            {/* Data stack sits on a shelf fixed to the right wall. */}
            <Block
              position={[0.22, -0.52, 0]}
              size={[0.45, 0.05, 0.65]}
              color={paint.accent}
            />
            {[0, 0.18, 0.36].map((y, i) => (
              <mesh key={y} position={[0.24, -0.4 + y, 0]}>
                <cylinderGeometry args={[0.22, 0.22, 0.13, 24]} />
                <meshStandardMaterial
                  color={i === 1 ? paint.primary : paint.secondary}
                  roughness={0.45}
                  toneMapped={false}
                />
              </mesh>
            ))}
            <Block
              position={[0.05, 0.29, 0]}
              size={[0.025, 0.48, 0.025]}
              color={paint.accent}
            />
            {[-0.24, 0.24].map((z) => (
              <Block
                key={z}
                position={[0.05, 0.5, z / 2]}
                size={[0.025, 0.025, 0.24]}
                color={paint.primary}
              />
            ))}
          </group>
        </group>
      </Float>
    </group>
  );
}
export default function Orbit() {
  const [enabled, setEnabled] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [paint, setPaint] = useState<Paint>(defaultColors);
  useEffect(() => {
    const update = () => {
      const styles = getComputedStyle(document.documentElement);
      const read = (key: keyof Paint) =>
        styles.getPropertyValue(`--${key}`).trim() || defaultColors[key];
      setPaint({
        primary: read("primary"),
        secondary: read("secondary"),
        accent: read("accent"),
        surface: read("surface"),
        text: read("text"),
      });
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (query.matches) {
        setEnabled(false);
        return;
      }
      try {
        const canvas = document.createElement("canvas");
        setEnabled(!!canvas.getContext("webgl2"));
      } catch {
        setEnabled(false);
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return (
    <div
      className="orbit"
      aria-label="Interactive exploded website: structure, design, logic and data"
    >
      <div className="orbit-grid" />
      {enabled ? (
        <div className="orbit-stage">
          <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 4, 5]} intensity={3} />
            <Object3D paint={paint} dragging={dragging} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              onStart={() => setDragging(true)}
              onEnd={() => setDragging(false)}
            />
          </Canvas>
        </div>
      ) : (
        <div className="orbit-fallback">◇</div>
      )}
      <span className="orbit-coordinate">WEB_001 / ASSEMBLY</span>
      <span className="orbit-hint">
        {enabled
          ? "drag to disassemble · release to rebuild"
          : "structure · design · logic · data"}
      </span>
    </div>
  );
}
