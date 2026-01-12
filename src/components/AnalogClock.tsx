
import { useEffect, useRef, useMemo } from "react";
import { getThemeColors } from "../utils/colorDefinitions";

interface AnalogClockProps {
  time: Date;
  dstMessage?: string | null;
}

const AnalogClock = ({ time, dstMessage }: AnalogClockProps) => {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null);
  const scaleRef = useRef(window.devicePixelRatio);
  
  // Detect if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Memoize theme colors - only recalculate when dark mode changes
  const colors = useMemo(() => getThemeColors(isDarkMode), [isDarkMode]);

  // Draw static elements (clock face, markers, numbers, DST message)
  useEffect(() => {
    const canvas = staticCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = scaleRef.current;
    canvas.width = 300 * scale;
    canvas.height = 300 * scale;
    ctx.scale(scale, scale);

    const radius = 150;
    const centerX = 150;
    const centerY = 150;

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

    // Draw DST message if present (behind markers and hands)
    if (dstMessage) {
      const hours = time.getHours();
      // Between 3 and 9 hours: top half, between 9 and 3 hours: bottom half
      const isTopHalf = hours >= 3 && hours < 9;
      
      ctx.font = "bold 18px 'RO Sans', sans-serif"; // 15% smaller than 21px
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Calculate Y position based on time
      const textY = isTopHalf ? centerY - 50 : centerY + 50;
      
      // Split message into multiple lines if needed
      const words = dstMessage.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > 200 && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Calculate box dimensions
      const lineHeight = 22;
      const padding = 5;
      let maxWidth = 0;
      lines.forEach(line => {
        const metrics = ctx.measureText(line);
        if (metrics.width > maxWidth) maxWidth = metrics.width;
      });
      
      const boxWidth = maxWidth + padding * 2 + 10; // 20px extra width
      const boxHeight = lines.length * lineHeight + padding * 2;
      const boxX = centerX - boxWidth / 2;
      const boxY = textY - boxHeight / 2;
      const borderRadius = 8;
      
      // Draw rounded rectangle with white background
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(boxX + borderRadius, boxY);
      ctx.lineTo(boxX + boxWidth - borderRadius, boxY);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + borderRadius);
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - borderRadius);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - borderRadius, boxY + boxHeight);
      ctx.lineTo(boxX + borderRadius, boxY + boxHeight);
      ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - borderRadius);
      ctx.lineTo(boxX, boxY + borderRadius);
      ctx.quadraticCurveTo(boxX, boxY, boxX + borderRadius, boxY);
      ctx.closePath();
      ctx.fill();
      
      // Draw red border
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw text in red
      ctx.fillStyle = '#ff0000';
      lines.forEach((line, index) => {
        const lineY = textY + (index - (lines.length - 1) / 2) * lineHeight;
        ctx.fillText(line, centerX, lineY);
      });
    }

    // Draw hour markers and numbers - 2x larger
    ctx.lineWidth = 4; // Doubled from 2
    ctx.font = "bold 40px 'RO Sans', sans-serif"; // Doubled from 20px
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
  }, [dstMessage, colors, isDarkMode]);

  // Draw dynamic elements (hands) - redraws every second
  useEffect(() => {
    const canvas = dynamicCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = scaleRef.current;
    canvas.width = 300 * scale;
    canvas.height = 300 * scale;
    ctx.scale(scale, scale);

    const radius = 150;
    const centerX = 150;
    const centerY = 150;

    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);

    // Get time components
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // Draw hour hand
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 12;
    ctx.strokeStyle = colors.hourHand;
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
    ctx.strokeStyle = colors.minuteHand;
    const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minuteAngle),
      centerY + radius * 0.7 * Math.sin(minuteAngle)
    );
    ctx.stroke();

    // Draw second hand (no milliseconds - timer only updates every 1000ms)
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = colors.secondHand;
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
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
    ctx.fillStyle = colors.centerDot;
    ctx.fill();
  }, [time, colors]);

  return (
    <div style={{ position: "relative", width: "300px", height: "300px" }}>
      <canvas
        ref={staticCanvasRef}
        width="300"
        height="300"
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "300px", 
          height: "300px" 
        }}
        className="shadow-lg rounded-full"
      />
      <canvas
        ref={dynamicCanvasRef}
        width="300"
        height="300"
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "300px", 
          height: "300px" 
        }}
      />
    </div>
  );
};

export default AnalogClock;
