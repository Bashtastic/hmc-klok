import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface DateDisplayProps {
  date: Date;
  moonPhase: string;
  moonDescription: string;
}

const DateDisplay = ({ date, moonPhase, moonDescription }: DateDisplayProps) => {
  return (
    <div className="flex items-center justify-center space-x-8">
      <span className="text-foreground text-3xl">{moonDescription}</span>
      <span className="text-foreground text-6xl">{moonPhase}</span>
      <p className="text-3xl font-light tracking-wide text-foreground">
        {format(date, "d MMMM yyyy", { locale: nl })}
      </p>
    </div>
  );
};

export default DateDisplay;