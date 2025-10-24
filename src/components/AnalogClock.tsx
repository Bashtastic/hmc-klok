
import { useEffect, useRef } from "react";
import { getThemeColors } from "../utils/colorDefinitions";

interface AnalogClockProps {
  time: Date;
  dstMessage?: string | null;
}

const AnalogClock = ({ time, dstMessage }: AnalogClockProps) => {
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

    // Detect if dark mode is active
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Get theme colors based on mode
    const colors = getThemeColors(isDarkMode);

    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isDarkMode ? colors.clockFace.background : colors.clockFace.background; // Clock face background color
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = isDarkMode ? colors.clockFace.border : colors.clockFace.border; // Clock face border color
    ctx.stroke();

    // Draw hour markers and numbers - 2x larger
    ctx.lineWidth = 4; // Doubled from 2
    ctx.font = "bold 40px Arial"; // Doubled from 20px
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = colors.hourMarkers; // Hour markers and numbers color

    // Set consistent margin from edge for both hour markers and numbers
    const marginFromEdge = 15; // Increased margin for better spacing
    
    // Additional margin specifically for the "12" marker
    const twelveMarkerExtraMargin = 10; // Extra space for "12" marker
    
    // Get text metrics for "12" to adjust vertical alignment
    const textMetrics = ctx.measureText("12");
    // Estimate the height (not perfect in Canvas API)
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const isMainHour = i % 3 === 0;
      
      if (isMainHour) {
        const number = i === 0 ? "12" : i.toString();
        // Calculate position based on angle and adjust for text size
        // The font size itself needs to be accounted for in the margin
        const textAdjustment = 10; // Additional adjustment to account for text size
        
        // Add extra margin for "12" marker
        const extraMarginForTwelve = i === 0 ? twelveMarkerExtraMargin : 0;
        
        const numberX = centerX + (radius - marginFromEdge - textAdjustment - extraMarginForTwelve) * Math.cos(angle);
        const numberY = centerY + (radius - marginFromEdge - textAdjustment - extraMarginForTwelve) * Math.sin(angle);
        ctx.fillText(number, numberX, numberY);
      } else {
        // Hour markers with consistent margin from edge
        const markerLength = 20; // Length of marker
        const startX = centerX + (radius - marginFromEdge) * Math.cos(angle);
        const startY = centerY + (radius - marginFromEdge) * Math.sin(angle);
        const endX = centerX + (radius - marginFromEdge - markerLength) * Math.cos(angle);
        const endY = centerY + (radius - marginFromEdge - markerLength) * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = colors.hourMarkers; // Hour markers stroke color
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
    ctx.strokeStyle = colors.hourHand; // Hour hand color
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
    ctx.strokeStyle = colors.minuteHand; // Minute hand color
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
    ctx.strokeStyle = colors.secondHand; // Second hand color - red
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
    ctx.fillStyle = colors.centerDot; // Center dot color - light gray
    ctx.fill();

    // Draw DST message if present
    if (dstMessage) {
      const hours = time.getHours();
      // Between 3 and 9 hours: top half, between 9 and 3 hours: bottom half
      const isTopHalf = hours >= 3 && hours < 9;
      
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = colors.hourMarkers;
      
      // Calculate Y position based on time
      const textY = isTopHalf ? centerY - 60 : centerY + 60;
      
      // Split message into multiple lines if needed
      const words = dstMessage.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > 120 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Draw each line
      lines.forEach((line, index) => {
        const lineY = textY + (index - (lines.length - 1) / 2) * 18;
        ctx.fillText(line, centerX, lineY);
      });
    }
  }, [time, dstMessage]);

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
