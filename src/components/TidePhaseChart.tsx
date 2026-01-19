import { useMemo } from "react";

interface TideLocationData {
  location: string;
  percentage: number;
  isRising: boolean; // true if rising (after LW), false if falling (after HW)
}

interface TidePhaseChartProps {
  tideData: TideLocationData[];
  onTroughPositionChange?: (positionPercent: number) => void;
  onPeakPositionChange?: (positionPercent: number) => void;
}

const TOTAL_BARS = 48;

// Only VLIS has a fixed position (as visual anchor)
const VLIS_BAR_POSITION = 4;

// Calculate bar position for a location based on its tide percentage and the overall phase
const calculateBarPosition = (
  percentage: number,
  isRising: boolean,
  phaseOffset: number
): number => {
  // Calculate the cycleProgress for this location (same logic as in phaseOffset calculation)
  let cycleProgress: number;
  if (isRising) {
    cycleProgress = 0.75 + (percentage / 100) * 0.5;
    if (cycleProgress > 1) cycleProgress -= 1;
  } else {
    cycleProgress = 0.25 + (percentage / 100) * 0.5;
  }

  // Find the bar where this cycleProgress would appear in the wave
  // The wave formula is: angle = (phaseOffset - progress - 0.25) * 2 * PI
  // We solve for progress: progress = phaseOffset - cycleProgress
  const barProgress = phaseOffset - cycleProgress;
  let barIndex = Math.round(barProgress * (TOTAL_BARS - 1));

  // Normalize to valid range (0 to TOTAL_BARS-1)
  while (barIndex < 0) barIndex += TOTAL_BARS;
  while (barIndex >= TOTAL_BARS) barIndex -= TOTAL_BARS;

  return barIndex;
};

// Location-specific colors: [light theme, dark theme]
const LOCATION_COLORS: { [key: string]: { light: string; dark: string; textColor?: string } } = {
  IJMH: { light: "hsl(0, 70%, 45%)", dark: "hsl(0, 75%, 27%)" },        // Red
  HOEK: { light: "hsl(140, 60%, 35%)", dark: "hsl(140, 53%, 29%)" },    // Green
  DENH: { light: "hsl(280, 60%, 45%)", dark: "hsl(280, 50%, 35%)" },    // Purple
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

const TidePhaseChart = ({ tideData, onTroughPositionChange, onPeakPositionChange }: TidePhaseChartProps) => {
  // Calculate the wave phase offset based on tide data
  // Use VLIS as reference to determine overall phase
  const phaseOffset = useMemo(() => {
    if (tideData.length === 0) return 0;
    
    // Use VLIS as reference (or first available location)
    const referenceData = tideData.find(d => d.location === "VLIS") || tideData[0];
    
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
    
    // The phase offset positions the wave so that VLIS bar shows the correct tide state
    // Using + barProgress to invert wave direction (tide propagates left to right)
    const barProgress = VLIS_BAR_POSITION / (TOTAL_BARS - 1);
    return cycleProgress + barProgress;
  }, [tideData]);

  // Calculate bar positions for each location
  const locationBars = useMemo(() => {
    return tideData.map((data) => {
      // VLIS keeps fixed position as anchor
      if (data.location === "VLIS") {
        return { ...data, barIndex: VLIS_BAR_POSITION };
      }

      // Other locations get dynamic position based on their tide percentage
      const barIndex = calculateBarPosition(
        data.percentage,
        data.isRising,
        phaseOffset
      );
      return { ...data, barIndex };
    });
  }, [tideData, phaseOffset]);

  // Calculate anchor position at 30% after high water
  // Peak (HW) is at angle = 0, so 30% after HW is at angle = -0.30 * 2π
  // Adding 0.05 to phaseOffset shifts from 25% to 30% after HW
  const anchorPosition = useMemo(() => {
    let pos = phaseOffset + 0.05;
    // Normalize to 0-1 range
    while (pos < 0) pos += 1;
    while (pos > 1) pos -= 1;
    return pos;
  }, [phaseOffset]);

  // Calculate peak position (where the wave is at maximum height)
  // Peak is at where angle = 0, which means phaseOffset - progress - 0.25 = 0
  // So progress = phaseOffset - 0.25
  const peakPosition = useMemo(() => {
    let pos = phaseOffset - 0.25;
    // Normalize to 0-1 range
    while (pos < 0) pos += 1;
    while (pos > 1) pos -= 1;
    return pos;
  }, [phaseOffset]);

  // Notify parent of anchor position change
  useMemo(() => {
    if (onTroughPositionChange) {
      onTroughPositionChange(anchorPosition);
    }
  }, [anchorPosition, onTroughPositionChange]);

  // Notify parent of peak position change
  useMemo(() => {
    if (onPeakPositionChange) {
      onPeakPositionChange(peakPosition);
    }
  }, [peakPosition, onPeakPositionChange]);

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
