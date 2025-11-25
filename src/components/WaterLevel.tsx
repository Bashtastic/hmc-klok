import { memo } from "react";

interface WaterLevelProps {
  percentage: number;
}

const WaterLevel = memo(({ percentage }: WaterLevelProps) => {
  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute bottom-0 left-0 right-0 w-full transition-[height] duration-1000 ease-in-out"
        style={{
          height: `${clampedPercentage}%`,
          backgroundImage: `url('/lovable-uploads/dbeaa465-ae14-4dcb-a618-291da5e4ef64.png')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </div>
  );
});

WaterLevel.displayName = "WaterLevel";

export default WaterLevel;