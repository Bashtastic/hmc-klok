import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface DateDisplayProps {
  date: Date;
  moonPhase: string;
  moonDescription: string;
}

const DateDisplay = ({ date, moonPhase, moonDescription }: DateDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-32">
      <div className="flex items-center justify-center space-x-8">
        <p className="text-3xl font-light tracking-wide text-foreground">
          {format(date, "d MMMM yyyy", { locale: nl })}
        </p>
        <span className="text-foreground text-6xl">{moonPhase}</span>
      </div>
      <span className="text-foreground text-3xl">{moonDescription}</span>
    </div>
  );
};

export default DateDisplay;