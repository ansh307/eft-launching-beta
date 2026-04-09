"use client";

import { useEffect, useState } from "react";
import { RECENT_SIGNUPS } from "@/lib/constants";

const getFlagEmoji = (countryCode: string) => {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const getTimeAgo = (timestamp: number, now: number) => {
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour} hr ago`;
};

const LiveSignupTicker = () => {
  const [data, setData] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());

  // ⏱ update time
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 🚀 fetch real users + merge
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/waitlist");
      const users = await res.json();

      const formatted = users.map((u: any) => ({
        name: u.email.split("@")[0], // simple name
        country: "US", // (optional: enhance later via IP)
        time: new Date(u.createdAt).getTime(),
      }));

      const merged = [...formatted, ...RECENT_SIGNUPS];

      // duplicate for infinite scroll
      setData([...merged, ...merged]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();

    // 🔁 poll every 5 sec (simple real-time)
    const interval = setInterval(fetchUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden py-3 bg-black/40 border-y border-green-500/20 backdrop-blur-md">
      <div className="ticker">
        <div className="ticker-track">
          {[...data, ...data].map((user, index) => (
            <div key={index} className="ticker-item">
              <span className="text-lg">{getFlagEmoji(user.country)}</span>
              <span className="text-white font-medium">{user.name}</span>
              <span className="text-green-400">just subscribed</span>
              <span className="text-gray-400 text-xs">
                • {getTimeAgo(user.time, now)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ticker {
          overflow: hidden;
          width: 100%;
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: scroll 100s linear infinite;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 60px;
          white-space: nowrap;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default LiveSignupTicker;
