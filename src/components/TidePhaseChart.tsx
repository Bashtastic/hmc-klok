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

// Fixed bar positions for each location (these stay constant)
const LOCATION_BAR_POSITIONS: { [key: string]: number } = {
  VLIS: 7,
  HOEK: 9,
  IJMH: 13,
  HARL: 26,
  DLFZ: 30,
};

// Location-specific colors: [light theme, dark theme]
const LOCATION_COLORS: { [key: string]: { light: string; dark: string; textColor?: string } } = {
  IJMH: { light: "hsl(0, 70%, 45%)", dark: "hsl(0, 75%, 27%)" },        // Red
  HOEK: { light: "hsl(140, 60%, 35%)", dark: "hsl(140, 53%, 29%)" },    // Green
  DLFZ: { light: "hsl(220, 70%, 35%)", dark: "hsl(220, 70%, 55%)" },    // Dark blue
  HARL: { light: "hsl(44, 100%, 21%)", dark: "hsl(41, 100%, 15%)" },  
  VLIS: { light: "hsl(45, 100%, 50%)", dark: "hsl(45, 33%, 30%)", textColor: "white" },
};

const getLocationColor = (location: string, isDark: boolean): string => {
  const colors = LOCATION_COLORS[location];
  if (colors) {
    return isDark ? colors.dark : colors.light;
  }
  return isDark ? "hsl(var(--foreground))" : "hsl(var(--foreground))";
};

const getTextColor = (location: string): string => {
  const colors = LOCATION_COLORS[location];
  return colors?.textColor || "white";
};

const TidePhaseChart = ({ tideData }: TidePhaseChartProps) => {
  // Calculate the wave phase offset based on tide data
  // Use VLIS as reference to determine overall phase
  const phaseOffset = useMemo(() => {
    if (tideData.length === 0) return 0;
    
    // Use VLIS as reference (or first available location)
    const referenceData = tideData.find(d => d.location === "VLIS") || tideData[0];
    const refBarIndex = LOCATION_BAR_POSITIONS[referenceData.location] || 7;
    
    // Calculate where in the tide cycle this location is
    let cycleProgress: number;
    if (referenceData.isRising) {
      // Rising: 0% = at LW, 100% = at HW
      // In wave terms: LW is at phase 0.75, HW is at phase 0.25
      cycleProgress = 0.75 + (referenceData.percentage / 100) * 0.5;
      if (cycleProgress > 1) cycleProgress -= 1;
    } else {
      // Falling: 0% = at HW, 100% = at LW
      // In wave terms: HW is at phase 0.25, LW is at phase 0.75
      cycleProgress = 0.25 + (referenceData.percentage / 100) * 0.5;
    }
    
    // The phase offset positions the wave so that the reference bar shows the correct tide state
    // Using + barProgress to invert wave direction (tide propagates left to right)
    const barProgress = refBarIndex / (TOTAL_BARS - 1);
    return cycleProgress + barProgress;
  }, [tideData]);

  // Fixed bar positions for locations
  const locationBars = useMemo(() => {
    return tideData.map((data) => ({
      ...data,
      barIndex: LOCATION_BAR_POSITIONS[data.location] || 0,
    }));
  }, [tideData]);

  // Create bar heights for the wave pattern with phase offset
  const barHeights = useMemo(() => {
    const heights: number[] = [];
    for (let i = 0; i < TOTAL_BARS; i++) {
      const progress = i / (TOTAL_BARS - 1);
      // Apply phase offset with inverted direction (phaseOffset - progress)
      // This makes the wave travel from left to right, matching tide propagation
      const angle = (phaseOffset - progress - 0.25) * 2 * Math.PI;
      const cosValue = Math.cos(angle);
      // Scale between 22.5% and 150% height
      const minHeight = 22.5;
      const maxHeight = 150;
      heights.push(minHeight + ((cosValue + 1) / 2) * (maxHeight - minHeight));
    }
    return heights;
  }, [phaseOffset]);

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

  // Detect dark mode
  const isDark = typeof document !== 'undefined' && 
    document.documentElement.classList.contains('dark');

  return (
    <div className="flex items-end justify-center gap-1 h-40" style={{ fontFamily: "'RO Sans', sans-serif", transform: "scaleX(1.1)" }}>
      {barHeights.map((height, index) => {
        const locationsAtBar = barsWithLocations[index] || [];
        const isActive = locationsAtBar.length > 0;
        const primaryLocation = locationsAtBar[0];
        const barColor = isActive 
          ? getLocationColor(primaryLocation, isDark)
          : "hsl(var(--muted-foreground) / 0.4)";
        
        // All bars (including location bars) use the wave pattern height
        const barHeight = height;
        
        return (
          <div
            key={index}
            className={`relative flex items-center justify-center transition-colors duration-300`}
            style={{
              width: "31px",
              height: `${barHeight}%`,
              borderRadius: "3px",
              backgroundColor: barColor,
              zIndex: isActive ? 10 : 1,
              overflow: "hidden",
            }}
          >
            {isActive && (
              <div 
                className="absolute flex flex-col items-start gap-0.5"
                style={{
                  transform: "rotate(-90deg)",
                  whiteSpace: "nowrap",
                  left: "91%",
                  bottom: "4px",
                  transformOrigin: "left bottom",
                  zIndex: 20,
                }}
              >
                {locationsAtBar.map((loc) => (
                  <span
                    key={loc}
                    className="text-[15px] font-black tracking-wider"
                    style={{ 
                      color: getTextColor(loc),
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
