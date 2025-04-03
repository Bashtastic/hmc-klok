
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
    canvas.width = 300 * scale;
    canvas.height = 300 * scale;

    // Normalize coordinate system to use CSS pixels
    ctx.scale(scale, scale);

    const radius = 150;
    const centerX = 150;
    const centerY = 150;

    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    const isDarkMode = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDarkMode ? "hsl(222, 47%, 11%)" : "#F1F1F1";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = isDarkMode ? "hsl(217, 49.10%, 41.60%)" : "#999999";
    ctx.stroke();

    // Draw hour markers and numbers - 2x larger
    ctx.lineWidth = 4; // Doubled from 2
    ctx.font = "bold 40px Arial"; // Doubled from 20px
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "hsl(220, 13%, 40%)";

    // Set equal margin from edge for both hour markers and numbers
    const marginFromEdge = 20; // Equal margin from edge
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const isMainHour = i % 3 === 0;
      
      if (isMainHour) {
        // Adjust number position to have equal margin from edge as the hour markers
        const numberX = centerX + (radius - marginFromEdge) * Math.cos(angle);
        const numberY = centerY + (radius - marginFromEdge) * Math.sin(angle);
        const number = i === 0 ? "12" : i.toString();
        ctx.fillText(number, numberX, numberY);
      } else {
        // Hour markers with equal margin from edge
        const markerLength = 20; // Length of marker
        const startX = centerX + (radius - marginFromEdge) * Math.cos(angle);
        const startY = centerY + (radius - marginFromEdge) * Math.sin(angle);
        const endX = centerX + (radius - marginFromEdge - markerLength) * Math.cos(angle);
        const endY = centerY + (radius - marginFromEdge - markerLength) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "hsl(220, 13%, 40%)";
        ctx.stroke();
      }
    }

    // Get time components
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Draw hour hand
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    ctx.strokeStyle = isDarkMode ? "hsl(142, 76%, 36%)" : "hsl(217, 91%, 60%)";
    const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.5 * Math.cos(hourAngle),
      centerY + radius * 0.5 * Math.sin(hourAngle)
    );
    ctx.stroke();

    // Draw minute hand
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = "hsl(0, 0.00%, 22.00%)";
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minuteAngle),
      centerY + radius * 0.7 * Math.sin(minuteAngle)
    );
    ctx.stroke();

    // Draw second hand
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = "hsl(0, 150%, 50%)";
    const secondAngle = ((seconds + milliseconds / 1500) * 6 - 90) * (Math.PI / 180);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.8 * Math.cos(secondAngle),
      centerY + radius * 0.8 * Math.sin(secondAngle)
    );
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(0, 0%, 89%)";
    ctx.fill();
  }, [time]);

  return (
    <canvas
      ref={canvasRef}
      width="300"
      height="300"
      style={{ width: "300px", height: "300px" }}
      className="shadow-lg rounded-full"
    />
  );
};

export default AnalogClock;
