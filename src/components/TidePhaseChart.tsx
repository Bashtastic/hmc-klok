import { useMemo } from "react";

interface TideLocationData {
  location: string;
  percentage: number;
  isRising: boolean; // true if rising (after LW), false if falling (after HW)
}

interface TidePhaseChartProps {
  tideData: TideLocationData[];
}

const TOTAL_BARS = 48;
const FUNCTIONAL_BARS = 32;
const HALF_FUNCTIONAL = FUNCTIONAL_BARS / 2;
const OFFSET = 8; // Extra bars at start

const TidePhaseChart = ({ tideData }: TidePhaseChartProps) => {
  // Calculate which bar index each location should be at
  const locationBars = useMemo(() => {
    return tideData.map((data) => {
      // If isRising (after LW), we're going from 0% (low) to 100% (high)
      // If falling (after HW), we're going from 100% (high) to 0% (low)
      // The percentage indicates progress from prev extreme to next extreme
      
      let barIndex: number;
      
      if (data.isRising) {
        // Rising tide: functional bars 0-15, offset by OFFSET
        // 0% = bar OFFSET (bottom left), 100% = bar OFFSET+15 (top/peak)
        barIndex = OFFSET + Math.floor((data.percentage / 100) * (HALF_FUNCTIONAL - 1));
      } else {
        // Falling tide: functional bars 16-31, offset by OFFSET
        // 0% = bar OFFSET+16 (just past peak), 100% = bar OFFSET+31 (bottom right)
        barIndex = OFFSET + HALF_FUNCTIONAL + Math.floor((data.percentage / 100) * (HALF_FUNCTIONAL - 1));
      }
      
      return {
        ...data,
        barIndex: Math.max(0, Math.min(TOTAL_BARS - 1, barIndex)),
      };
    });
  }, [tideData]);

  // Create bar heights for the wave pattern (extended sine wave)
  const barHeights = useMemo(() => {
    const heights: number[] = [];
    for (let i = 0; i < TOTAL_BARS; i++) {
      // Create an extended wave pattern that shows partial waves at start/end
      // Map from -0.25 to 1.25 of a full wave cycle
      const progress = (i - OFFSET) / (FUNCTIONAL_BARS - 1);
      const sineValue = Math.sin(progress * Math.PI);
      // Scale between 20% and 100% height, clamp negative values
      heights.push(20 + Math.max(0, sineValue) * 80);
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
