"use client";

import { useEffect, useState, useRef } from "react";

/* ================= TYPES ================= */

type User = {
  email: string;
  name: string;
  country: string;
  time: number;
  action: string;
};

/* ================= CONSTANTS ================= */

const ACTIONS = ["joined", "started trial", "signed up", "just subscribed"];

// ✅ MUST match User type
const RECENT_SIGNUPS: User[] = [
  {
    email: "alex@example.com",
    name: "Alex",
    country: "US",
    time: Date.now() - 1000 * 60 * 2,
    action: "joined",
  },
  {
    email: "emma@example.com",
    name: "Emma",
    country: "UK",
    time: Date.now() - 1000 * 60 * 5,
    action: "started trial",
  },
];

/* ================= HELPERS ================= */

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

const formatName = (email: string) => {
  const base = email.split("@")[0];
  return base
    .replace(/[0-9]/g, "")
    .split(/[._-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/* ================= COMPONENT ================= */

const LiveSignupTicker = () => {
  const [data, setData] = useState<User[]>([]);
  const [now, setNow] = useState(Date.now());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef(0);

  /* ⏱ update time */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* 🚀 fetch users */
  const fetchUsers = async () => {
    const nowTime = Date.now();

    if (nowTime - lastFetchRef.current < 10000) return;
    lastFetchRef.current = nowTime;

    try {
      const res = await fetch("/api/waitlist");
      const users: { email: string; createdAt: string }[] = await res.json();

      const formatted: User[] = users.map((u) => ({
        email: u.email,
        name: formatName(u.email),
        country: "US",
        time: new Date(u.createdAt).getTime(),
        action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
      }));

      setData((prev: User[]) => {
        const existingEmails = new Set(prev.map((u) => u.email));

        const newUsers: User[] = formatted.filter(
          (u) => !existingEmails.has(u.email),
        );

        const merged: User[] = [...newUsers, ...prev, ...RECENT_SIGNUPS];

        return [...merged.slice(0, 30), ...merged.slice(0, 30)];
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* 🧠 smart polling */
  useEffect(() => {
    fetchUsers();

    let interval = 5000;

    const startPolling = () => {
      intervalRef.current = setInterval(() => {
        fetchUsers();

        interval = Math.min(interval + 5000, 30000);

        if (intervalRef.current) clearInterval(intervalRef.current);
        startPolling();
      }, interval);
    };

    startPolling();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ⚡ simulate activity */
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev: User[]) => {
        if (prev.length === 0) return prev;

        const randomUser = prev[Math.floor(Math.random() * prev.length)];

        const newEntry: User = {
          ...randomUser,
          time: Date.now(),
          action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
        };

        const updated: User[] = [newEntry, ...prev];

        return [...updated.slice(0, 30), ...updated.slice(0, 30)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  /* 🛑 pause when tab inactive */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        fetchUsers();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="w-full overflow-hidden py-3 bg-black/60 border-y border-green-500/20 backdrop-blur-xl">
      <div className="ticker">
        <div className="ticker-track">
          {data.map((user, index) => (
            <div key={index} className="ticker-item group">
              <span className="text-lg opacity-90">
                {getFlagEmoji(user.country)}
              </span>

              <span className="text-white font-medium group-hover:text-green-400 transition">
                {user.name}
              </span>

              <span className="text-green-400/90">{user.action}</span>

              <span className="text-gray-400 text-xs opacity-80">
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
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: scroll 90s linear infinite;
          will-change: transform;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: 60px;
          white-space: nowrap;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.3s ease;
        }

        .ticker-item:hover {
          background: rgba(34, 197, 94, 0.08);
          transform: scale(1.05);
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
