
import { format } from "date-fns";
import AnalogClock from "./AnalogClock";

interface ClockDisplayProps {
  time: Date;
  title: string;
}

const ClockDisplay = ({ time, title }: ClockDisplayProps) => {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-2xl font-medium text-muted-foreground font-dosis font-thin" style={{ marginTop: "50px" }}>{title}</p>
      <AnalogClock time={time} />
      <p className="mt-4 text-4xl tracking-wide text-foreground font-dosis font-normal">
        {format(time, "HH:mm")}
      </p>
    </div>
  );
};

export default ClockDisplay;
