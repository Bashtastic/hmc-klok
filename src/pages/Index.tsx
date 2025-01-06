import { useState, useEffect } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import AnalogClock from "../components/AnalogClock";

const Index = () => {
  const [time, setTime] = useState(new Date());
  const isDST = time.getTimezoneOffset() < new Date(time.getFullYear(), 0, 1).getTimezoneOffset();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const utcTime = toZonedTime(time, 'UTC');
  const cetTime = toZonedTime(time, 'Europe/Paris');
  const metTime = toZonedTime(time, 'Etc/GMT-1');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {/* UTC Clock */}
          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm font-medium text-gray-600">UTC</p>
            <AnalogClock time={utcTime} />
            <p className="mt-4 text-2xl font-light tracking-wide">
              {format(utcTime, "HH:mm")}
            </p>
          </div>

          {/* MET Clock (only during DST) */}
          {isDST && (
            <div className="flex flex-col items-center">
              <p className="mb-2 text-sm font-medium text-gray-600">MET</p>
              <AnalogClock time={metTime} />
              <p className="mt-4 text-2xl font-light tracking-wide">
                {format(metTime, "HH:mm")}
              </p>
            </div>
          )}

          {/* CET Clock */}
          <div className="flex flex-col items-center">
            <p className="mb-2 text-sm font-medium text-gray-600">CET</p>
            <AnalogClock time={cetTime} />
            <p className="mt-4 text-2xl font-light tracking-wide">
              {format(cetTime, "HH:mm")}
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