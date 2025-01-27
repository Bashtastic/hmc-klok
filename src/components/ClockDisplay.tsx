import { format } from "date-fns";
import AnalogClock from "./AnalogClock";

interface ClockDisplayProps {
  time: Date;
  title: string;
}

const ClockDisplay = ({ time, title }: ClockDisplayProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-4xl font-semibold text-foreground">{title}</h2>
      <AnalogClock time={time} />
      <p className="text-2xl font-light tracking-wide text-foreground">
        {format(time, "HH:mm:ss")}
      </p>
    </div>
  );
};

export default ClockDisplay;