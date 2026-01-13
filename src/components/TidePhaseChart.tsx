import { useMemo } from "react";

interface TideLocationData {
  location: string;
  percentage: number;
  isRising: boolean; // true if rising (after LW), false if falling (after HW)
}

interface TidePhaseChartProps {
  tideData: TideLocationData[];
}

const TOTAL_BARS = 32;
const HALF_BARS = TOTAL_BARS / 2;

const TidePhaseChart = ({ tideData }: TidePhaseChartProps) => {
  // Calculate which bar index each location should be at
  const locationBars = useMemo(() => {
    return tideData.map((data) => {
      // If isRising (after LW), we're going from 0% (low) to 100% (high)
      // If falling (after HW), we're going from 100% (high) to 0% (low)
      // The percentage indicates progress from prev extreme to next extreme
      
      let barIndex: number;
      
      if (data.isRising) {
        // Rising tide: bars 0-11 (left half, going up)
        // 0% = bar 0 (bottom left), 100% = bar 11 (top/peak)
        barIndex = Math.floor((data.percentage / 100) * (HALF_BARS - 1));
      } else {
        // Falling tide: bars 12-23 (right half, going down)
        // 0% = bar 12 (just past peak), 100% = bar 23 (bottom right)
        barIndex = HALF_BARS + Math.floor((data.percentage / 100) * (HALF_BARS - 1));
      }
      
      return {
        ...data,
        barIndex: Math.max(0, Math.min(TOTAL_BARS - 1, barIndex)),
      };
    });
  }, [tideData]);

  // Create bar heights for the wave pattern (sine wave-like)
  const barHeights = useMemo(() => {
    const heights: number[] = [];
    for (let i = 0; i < TOTAL_BARS; i++) {
      // Create a wave pattern: rises from left, peaks in middle, falls to right
      // Using sine function for smooth wave
      const progress = i / (TOTAL_BARS - 1);
      const sineValue = Math.sin(progress * Math.PI);
      // Scale between 20% and 100% height
      heights.push(20 + sineValue * 80);
    }
    return heights;
  }, []);

  // Check which bars have locations
  const barsWithLocations = useMemo(() => {
    const result: { [key: number]: string[] } = {};
    locationBars.forEach((loc) => {
      if (!result[loc.barIndex]) {
        result[loc.barIndex] = [];
      }
      result[loc.barIndex].push(loc.location);
    });
    return result;
  }, [locationBars]);

  return (
    <div className="flex items-end justify-center gap-1 h-40" style={{ fontFamily: "'RO Sans', sans-serif" }}>
      {barHeights.map((height, index) => {
        const locationsAtBar = barsWithLocations[index] || [];
        const isActive = locationsAtBar.length > 0;
        
        return (
          <div
            key={index}
            className={`relative flex items-center justify-center transition-colors duration-300`}
            style={{
              width: "28px",
              height: `${height}%`,
              borderRadius: "3px",
              backgroundColor: isActive 
                ? "hsl(var(--foreground))" 
                : "hsl(var(--muted-foreground) / 0.4)",
            }}
          >
            {isActive && (
              <div 
                className="absolute flex flex-col items-center justify-center gap-0.5"
                style={{
                  transform: "rotate(-90deg)",
                  whiteSpace: "nowrap",
                }}
              >
                {locationsAtBar.map((loc) => (
                  <span
                    key={loc}
                    className="text-[15px] font-black tracking-wider"
                    style={{ 
                      color: "hsl(var(--background))",
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TidePhaseChart;
