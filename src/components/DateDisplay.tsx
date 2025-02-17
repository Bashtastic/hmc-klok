
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface DateDisplayProps {
  date: Date;
  moonPhase: string;
  moonDescription: string;
}

const DateDisplay = ({ date, moonPhase, moonDescription }: DateDisplayProps) => {
  return (
    <div className="flex items-center justify-center w-full mt-[80px]">
      <div className="flex-1 flex justify-end">
        <span className="text-foreground pr-4" style={{ fontSize: "3rem" }}>{moonDescription}</span>
      </div>
      <span 
        className="text-foreground flex-shrink-0" 
        style={{ 
          fontSize: "6rem",
          fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', sans-serif"
        }}
      >
        {moonPhase}
      </span>
      <div className="flex-1 flex justify-start">
        <span className="text-foreground pl-4" style={{ fontSize: "3rem" }}>{format(date, "d MMMM yyyy", { locale: nl })}</span>
      </div>
    </div>
  );
};

export default DateDisplay;
