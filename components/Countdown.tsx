"use client";

import { useState, useEffect } from "react";
import { LAUNCH_DATE } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = LAUNCH_DATE - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-gradient-to-br from-green-500/20 to-green-900/20 border border-green-500/30 rounded-2xl p-6 md:p-8 lg:p-10 backdrop-blur-sm min-w-[100px] md:min-w-[140px] lg:min-w-[160px]">
          <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-green-400 tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
        </div>
        <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-2xl -z-10"></div>
      </div>
      <div className="text-gray-400 text-sm md:text-base lg:text-lg mt-3 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
      <TimeBlock value={timeLeft.days} label="Days" />
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <TimeBlock value={timeLeft.minutes} label="Minutes" />
      <TimeBlock value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default Countdown;
