"use client";

import { useEffect, useState, useMemo, useRef } from "react";

type User = {
  email: string;
  name: string;
  country: string;
  time: number;
  action: string;
};

const ACTIONS = ["joined", "started trial", "signed up", "just subscribed"];

// ✅ No Date.now() at module scope — use offsets, resolve on client only
const RECENT_SIGNUP_OFFSETS = [
  {
    email: "alex@example.com",
    name: "Alex",
    country: "US",
    offsetMs: 1000 * 60 * 2,
    action: "joined",
  },
  {
    email: "emma@example.com",
    name: "Emma",
    country: "UK",
    offsetMs: 1000 * 60 * 5,
    action: "started trial",
  },
];

const getRecentSignups = (): User[] =>
  RECENT_SIGNUP_OFFSETS.map((u) => ({
    email: u.email,
    name: u.name,
    country: u.country,
    action: u.action,
    time: Date.now() - u.offsetMs,
  }));

const getFlagEmoji = (countryCode: string) =>
  countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const getTimeAgo = (timestamp: number, now: number) => {
  if (now === 0) return "just now"; // ✅ SSR-safe fallback
  const diffSec = Math.floor((now - timestamp) / 1000);
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  return `${Math.floor(diffSec / 3600)} hr ago`;
};

const formatName = (email: string) => {
  const base = email.split("@")[0];
  return base
    .replace(/[0-9]/g, "")
    .split(/[._-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const LiveSignupTicker = () => {
  // ✅ Start with empty arrays — populated after mount to avoid SSR mismatch
  const [data, setData] = useState<User[]>([]);
  const [displayList, setDisplayList] = useState<User[]>([]);
  // ✅ now = 0 on server, real value set in useEffect after hydration
  const [now, setNow] = useState(0);
  const displayListRef = useRef<User[]>([]);

  // ✅ Populate initial data and now only on the client
  useEffect(() => {
    const initial = getRecentSignups();
    setData(initial);
    setDisplayList(initial);
    displayListRef.current = initial;
    setNow(Date.now());
  }, []);

  // ✅ Clock tick — client only
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
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
      const recentSignups = getRecentSignups(); // ✅ fresh timestamps on client
      const merged = [...formatted, ...recentSignups].slice(0, 30);
      setData(merged);
      setDisplayList(merged);
      displayListRef.current = merged;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchUsers, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const simulate = () => {
      timeout = setTimeout(
        () => {
          setData((prev) => {
            if (prev.length === 0) return prev;
            const randomUser = prev[Math.floor(Math.random() * prev.length)];
            const newEntry: User = {
              ...randomUser,
              time: Date.now() - Math.random() * 60000,
              action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)],
            };
            return [newEntry, ...prev].slice(0, 30);
          });
          simulate();
        },
        5000 + Math.random() * 7000,
      );
    };
    simulate();
    return () => clearTimeout(timeout);
  }, []);

  const tickerItems = useMemo(
    () => [...displayList, ...displayList],
    [displayList],
  );

  return (
    <div className="w-full overflow-hidden py-3 bg-black/60 border-y border-green-500/20 backdrop-blur-xl">
      <div className="ticker">
        <div className="ticker-track" key="ticker-track">
          {tickerItems.map((user, index) => (
            <div key={`${user.email}-${index}`} className="ticker-item group">
              <span className="text-lg opacity-90">
                {getFlagEmoji(user.country)}
              </span>
              <span className="text-white font-medium group-hover:text-green-400 transition">
                {user.name}
              </span>
              <span className="text-green-400/90">{user.action}</span>
              {/* ✅ suppressHydrationWarning as safety net for time spans */}
              <span
                className="text-gray-400 text-xs opacity-80"
                suppressHydrationWarning
              >
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
          animation: scroll 80s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
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
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default LiveSignupTicker;
