import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface DateDisplayProps {
  date: Date;
}

const DateDisplay = ({ date }: DateDisplayProps) => {
  return (
    <p className="text-foreground text-3xl font-light tracking-wide">
      {format(date, "d MMMM yyyy", { locale: nl })}
    </p>
  );
};

export default DateDisplay;