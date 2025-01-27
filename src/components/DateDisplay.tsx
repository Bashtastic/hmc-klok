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
      <span className="text-foreground" style={{ fontSize: "3rem" }}>{moonDescription}</span>
      <span className="text-foreground" style={{ fontSize: "6rem" }}>{moonPhase}</span>
      <span className="text-foreground" style={{ fontSize: "3rem" }}>{format(date, "d MMMM yyyy", { locale: nl })}</span>
    </div>
  );
};




export default DateDisplay;