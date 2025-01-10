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
    ctx.fillStyle = "hsl(222, 47%, 11%)"; // Dark blue clock face
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "hsl(217, 33%, 17.5%)"; // Darker border
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
        // Draw numbers for 12, 3, 6, 9
        const numberX = centerX + (radius - 25) * Math.cos(angle - Math.PI / 2);
        const numberY = centerY + (radius - 25) * Math.sin(angle - Math.PI / 2);
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

    // Draw hour hand (50% thicker, blue in light theme, green in dark theme)
    const hourAngle = (hours + minutes / 60) * (Math.PI / 6) - Math.PI / 2;
    ctx.beginPath();
    ctx.lineWidth = 6; // 50% thicker (was 4)
    const isDarkMode = document.documentElement.classList.contains('dark');
    ctx.strokeStyle = isDarkMode ? "hsl(142, 76%, 36%)" : "hsl(217, 91%, 60%)"; // Green in dark mode, blue in light mode
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
    ctx.strokeStyle = "hsl(0, 0%, 89%)"; // Light gray hands
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minuteAngle),
      centerY + radius * 0.7 * Math.sin(minuteAngle)
    );
    ctx.stroke();

    // Draw second hand (red, thinner, and semi-transparent)
    const secondAngle =
      (seconds + milliseconds / 1000) * (Math.PI / 30) - Math.PI / 2;
    ctx.beginPath();
    ctx.lineWidth = 1; // 50% thinner (was 2)
    ctx.globalAlpha = 0.9; // 10% transparent
    ctx.strokeStyle = "hsl(0, 100%, 50%)"; // Red color
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.8 * Math.cos(secondAngle),
      centerY + radius * 0.8 * Math.sin(secondAngle)
    );
    ctx.stroke();
    ctx.globalAlpha = 1; // Reset transparency

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(0, 0%, 89%)"; // Light gray center dot
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