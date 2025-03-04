
import { format } from "date-fns";
import AnalogClock from "./AnalogClock";

interface ClockDisplayProps {
  time: Date;
  title: string;
}

const ClockDisplay = ({ time, title }: ClockDisplayProps) => {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-2xl font-thin font-dosis text-muted-foreground" style={{ marginTop: "50px", fontWeight: 100 }}>{title}</p>
      <AnalogClock time={time} />
      <p className="mt-4 text-4xl font-dosis text-foreground" style={{ fontWeight: 400 }}>
        {format(time, "HH:mm")}
      </p>
    </div>
  );
};

export default ClockDisplay;
