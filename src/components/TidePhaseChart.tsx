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

const TidePhaseChart = ({ tideData }: TidePhaseChartProps) => {
  // Wave pattern: HW at bar ~12 (25%), LW at bar ~36 (75%)
  const HW_BAR = Math.round(TOTAL_BARS * 0.25); // ~12
  const LW_BAR = Math.round(TOTAL_BARS * 0.75); // ~36

  // Calculate which bar index each location should be at
  const locationBars = useMemo(() => {
    return tideData.map((data) => {
      let barIndex: number;
      
      if (data.isRising) {
        // Rising tide (after LW, going to HW): position from LW (bar 36) towards end
        // 0% = just after LW (bar 36), 100% = approaching next HW (bar 47)
        const risingRange = TOTAL_BARS - 1 - LW_BAR; // ~11 bars
        barIndex = LW_BAR + Math.round((data.percentage / 100) * risingRange);
      } else {
        // Falling tide (after HW, going to LW): position from HW (bar 12) to LW (bar 36)
        // 0% = just after HW (bar 12), 100% = at LW (bar 36)
        const fallingRange = LW_BAR - HW_BAR; // ~24 bars
        barIndex = HW_BAR + Math.round((data.percentage / 100) * fallingRange);
      }
      
      return {
        ...data,
        barIndex: Math.max(0, Math.min(TOTAL_BARS - 1, barIndex)),
      };
    });
  }, [tideData, HW_BAR, LW_BAR]);

  // Create bar heights for the wave pattern matching reference:
  // Start rising -> HW (peak at ~1/4) -> falling -> LW (bottom at ~3/4) -> rising again
  const barHeights = useMemo(() => {
    const heights: number[] = [];
    for (let i = 0; i < TOTAL_BARS; i++) {
      const progress = i / (TOTAL_BARS - 1);
      // Use cosine shifted so peak is at 1/4 and bottom at 3/4
      // angle = (progress - 0.25) * 2π
      const angle = (progress - 0.25) * 2 * Math.PI;
      const cosValue = Math.cos(angle);
      // Scale between 15% and 100% height
      const minHeight = 15;
      const maxHeight = 100;
      heights.push(minHeight + ((cosValue + 1) / 2) * (maxHeight - minHeight));
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
