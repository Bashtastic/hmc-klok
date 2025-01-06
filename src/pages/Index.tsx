import { useState, useEffect } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import AnalogClock from "../components/AnalogClock";

const Index = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center">
            <AnalogClock time={time} />
            <p className="mt-4 text-2xl font-light tracking-wide">
              {format(time, "HH:mm:ss")}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <AnalogClock time={time} />
            <p className="mt-4 text-2xl font-light tracking-wide">
              {format(time, "HH:mm:ss")}
            </p>
          </div>
        </div>
        <p className="text-center mt-12 text-3xl font-light tracking-wide">
          {format(time, "d MMMM", { locale: nl })}
        </p>
      </div>
    </div>
  );
};

export default Index;