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
    canvas.width = 400 * scale;
    canvas.height = 400 * scale;

    // Normalize coordinate system to use CSS pixels
    ctx.scale(scale, scale);

    const radius = 180;
    const centerX = 200;
    const centerY = 200;

    // Clear canvas
    ctx.clearRect(0, 0, 400, 400);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    const isDarkMode = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDarkMode ? "hsl(222, 47%, 11%)" : "#F1F1F1";
    ctx.fill();
    ctx.lineWidth = 2; // Changed from original
    ctx.strokeStyle = isDarkMode ? "hsl(217, 33%, 17.5%)" : "hsl(217, 91%, 60%)"; // Dark blue in light mode
    ctx.stroke();

    // Draw hour markers and numbers
    ctx.lineWidth = 2;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "hsl(220, 13%, 40%)"; // Dark gray color for numbers

    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const isMainHour = i % 3 === 0;
      
      if (isMainHour) {
        // Draw numbers for 12, 3, 6, 9 at the same radius as the hour markers
        const numberX = centerX + (radius - 10) * Math.cos(angle - Math.PI / 2);
        const numberY = centerY + (radius - 10) * Math.sin(angle - Math.PI / 2);
        const number = i === 0 ? "12" : i.toString();
        ctx.fillText(number, numberX, numberY);
      } else {
        // Draw shorter markers for other hours
        const startX = centerX + (radius - 15) * Math.cos(angle);
        const startY = centerY + (radius - 15) * Math.sin(angle);
        const endX = centerX + (radius - 5) * Math.cos(angle);
        const endY = centerY + (radius - 5) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "hsl(220, 13%, 40%)"; // Dark gray hour markers
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
    ctx.strokeStyle = isDarkMode ? "hsl(142, 76%, 36%)" : "hsl(217, 33%, 17.5%)"; // Dark blue in light mode
    const hourAngle = (hours + minutes / 60) * (Math.PI / 6) - Math.PI / 2;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.5 * Math.cos(hourAngle),
      centerY + radius * 0.5 * Math.sin(hourAngle)
    );
    ctx.stroke();

    // Draw minute hand (now same color as hour hand in light mode)
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = isDarkMode ? "hsl(0, 0%, 89%)" : "hsl(217, 91%, 60%)"; // Same as hour hand in light mode
    const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30) - Math.PI / 2;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minuteAngle),
      centerY + radius * 0.7 * Math.sin(minuteAngle)
    );
    ctx.stroke();

    // Draw second hand (red, thinner, and semi-transparent)
    ctx.beginPath();
    ctx.lineCap = 'round'; // Add rounded end
    ctx.lineWidth = 2; // Doubled from 1
    ctx.globalAlpha = 0.9; // 10% transparent
    ctx.strokeStyle = "hsl(0, 100%, 50%)"; // Red color
    const secondAngle =
      (seconds + milliseconds / 1000) * (Math.PI / 30) - Math.PI / 2;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.8 * Math.cos(secondAngle),
      centerY + radius * 0.8 * Math.sin(secondAngle)
    );
    ctx.stroke();
    ctx.globalAlpha = 1; // Reset transparency

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI); // Doubled from 3
    ctx.fillStyle = "hsl(0, 0%, 89%)"; // Light gray center dot
    ctx.fill();

  }, [time]);

  return (
    <canvas
      ref={canvasRef}
      width="400"
      height="400"
      style={{ width: "400px", height: "400px" }}
      className="shadow-lg rounded-full"
    />
  );
};

export default AnalogClock;
