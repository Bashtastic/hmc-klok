import { useEffect, useRef } from "react";

interface AnalogClockProps {
  time: Date;
}

const AnalogClock = ({ time }: AnalogClockProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set actual size in memory (scaled to account for extra pixel density)
    const scale = window.devicePixelRatio;
    canvas.width = 200 * scale;
    canvas.height = 200 * scale;

    // Normalize coordinate system to use CSS pixels
    ctx.scale(scale, scale);

    const radius = 90;
    const centerX = 100;
    const centerY = 100;

    // Clear canvas
    ctx.clearRect(0, 0, 200, 200);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.stroke();

    // Draw hour markers
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const startX = centerX + (radius - 15) * Math.cos(angle);
      const startY = centerY + (radius - 15) * Math.sin(angle);
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Get time components
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Draw hour hand
    const hourAngle = (hours + minutes / 60) * (Math.PI / 6) - Math.PI / 2;
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.5 * Math.cos(hourAngle),
      centerY + radius * 0.5 * Math.sin(hourAngle)
    );
    ctx.stroke();

    // Draw minute hand
    const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30) - Math.PI / 2;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minuteAngle),
      centerY + radius * 0.7 * Math.sin(minuteAngle)
    );
    ctx.stroke();

    // Draw second hand
    const secondAngle =
      (seconds + milliseconds / 1000) * (Math.PI / 30) - Math.PI / 2;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#4299e1";
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.8 * Math.cos(secondAngle),
      centerY + radius * 0.8 * Math.sin(secondAngle)
    );
    ctx.stroke();

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#4299e1";
    ctx.fill();
  }, [time]);

  return (
    <canvas
      ref={canvasRef}
      width="200"
      height="200"
      style={{ width: "200px", height: "200px" }}
      className="shadow-lg rounded-full"
    />
  );
};

export default AnalogClock;