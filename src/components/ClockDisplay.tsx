import { format } from "date-fns";
import AnalogClock from "./AnalogClock";

interface ClockDisplayProps {
  time: Date;
  title: string;
}

const ClockDisplay = ({ time, title }: ClockDisplayProps) => {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-sm font-medium text-muted-foreground">{title}</p>
      <AnalogClock time={time} />
      <p className="mt-4 text-2xl font-light tracking-wide text-foreground">
        {format(time, "HH:mm")}
      </p>
    </div>
  );
};

export default ClockDisplay;