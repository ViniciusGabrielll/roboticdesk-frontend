import { useEffect, useRef } from "react";

type Props = {
  className?: string;
};

export default function BackgroundEffect({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dotsRef = useRef<
    { x: number; y: number; baseX: number; baseY: number }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const parent = canvas.parentElement!;

    let animationId: number;
    let mouse = { x: -1000, y: -1000 };

    const spacing = 30;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // grid de bolinhas
      const cols = Math.floor(rect.width / spacing);
      const rows = Math.floor(rect.height / spacing);

      const dots = [];
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          dots.push({
            x: i * spacing,
            y: j * spacing,
            baseX: i * spacing,
            baseY: j * spacing,
          });
        }
      }

      dotsRef.current = dots;
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = parent.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      dotsRef.current.forEach((dot) => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 80;

        // repelir
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          dot.x += (dx / dist) * force * 3;
          dot.y += (dy / dist) * force * 3;
        }

        dot.x += (dot.baseX - dot.x) * 0.05;
        dot.y += (dot.baseY - dot.y) * 0.05;

        const maxFade = 200;
        const cornerDist = Math.sqrt(dot.x * dot.x + dot.y * dot.y);
        const alpha = Math.min(cornerDist / maxFade, 1);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `#f5f7fa`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}
