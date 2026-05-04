"use client";

import { useState } from "react";
import { HiSparkles, HiEnvelope, HiQuestionMarkCircle } from "react-icons/hi2";
import { FaGift, FaRocket } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { BsCheckCircleFill } from "react-icons/bs";
import Countdown from "./Countdown";
import {
  SITE_NAME,
  SITE_TAGLINE,
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_DESCRIPTION,
  PROMO_DISCOUNT,
  PROMO_TEXT,
  CTA_EMAIL_PLACEHOLDER,
  CTA_BUTTON_TEXT,
  CTA_RAFFLE_TEXT,
} from "@/lib/constants";
import LiveSignupTicker from "./LiveSignupTicker";
import { toast } from "sonner";
import Image from "next/image";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.alreadyExists) {
        toast.warning("You're already on the waitlist 🚀");
      } else {
        setIsSubmitted(true);
        toast.success("You're in! Check your email 🎉");
      }

      setTimeout(() => {
        setEmail("");
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-1/2 translate-x-1/2  h-full object-cover"
      >
        <source src="/hero-1.mp4" type="video/mp4" />
      </video> */}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-900/20"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[150px]"></div>

      {/* Header with Logo and FAQ */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 md:px-8 py-4 md:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between  -translate-y-8">
          {/* Logo */}
          <Image
            src="/eft-logo.png"
            alt="EFT Logo"
            width={0}
            height={0}
            sizes="100vw"
            className="h-20 sm:h-22 md:h-28 w-auto object-contain"
            priority
          />
          {/* FAQ Button */}
          <a
            href="https://prop-help.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 hover:border-green-500/60 rounded-full px-3 sm:px-5 md:px-6 py-2 md:py-2.5 backdrop-blur-md transition-all duration-300 group"
          >
            <HiQuestionMarkCircle className="text-green-400 text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold text-xs sm:text-sm md:text-base">
              FAQ
            </span>
          </a>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8 mt-30 sm:mt-10">
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6">
          {/* Main Title */}
          <div className="text-center max-w-4xl px-2">
            {/* <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-3">
              <span className="text-white">{HERO_TITLE}</span>
            </h2> */}
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold  leading-tight">
              <span className="text-white">
                {HERO_SUBTITLE.split("Here")[0]}
              </span>
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-lg text-gray-300 mt-3 sm:mt-4 max-w-3xl mx-auto px-4">
              Trade with confidence. Keep up to 100% of profits. Zero risk to
              your capital.
            </p>
          </div>

          {/* Promo Badge */}
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-green-600 text-black font-bold text-xs sm:text-sm md:text-base lg:text-xl px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-4 rounded-full shadow-2xl shadow-green-500/60 animate-pulse">
            <FaGift className="text-base sm:text-xl md:text-2xl flex-shrink-0" />
            <span className="whitespace-nowrap">
              {PROMO_TEXT} - Get {PROMO_DISCOUNT}
            </span>
          </div>

          {/* Countdown */}
          <div className="w-full px-2">
            <Countdown />
          </div>

          {/* Email Signup */}
          <div className="w-full max-w-2xl px-2">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2 sm:mb-3"
            >
              <div className="relative flex-1">
                <HiEnvelope className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-green-400 text-lg sm:text-xl" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={CTA_EMAIL_PLACEHOLDER}
                  required
                  disabled={isLoading}
                  className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base rounded-full bg-black/40 border border-green-500/40 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-black font-bold rounded-full hover:from-green-400 hover:to-green-500 transition-all duration-300 shadow-lg shadow-green-500/40 hover:shadow-green-500/60 hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                    Submitting...
                  </>
                ) : isSubmitted ? (
                  <>
                    <BsCheckCircleFill className="text-base sm:text-lg" />
                    Subscribed!
                  </>
                ) : (
                  CTA_BUTTON_TEXT
                )}
              </button>
            </form>
            <p className="text-center text-xs sm:text-sm text-green-400 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <HiSparkles className="text-sm sm:text-base" />
              <span>{CTA_RAFFLE_TEXT}</span>
            </p>
          </div>

          <LiveSignupTicker />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl px-2">
            <div className=" p-4 sm:p-5 text-center transition-all duration-300 group">
              <IoShieldCheckmark className="text-3xl sm:text-4xl md:text-5xl text-green-400 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg mb-1">
                No Risk Trading
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Trade with our capital, keep profits
              </p>
            </div>
            <div className=" p-4 sm:p-5 text-center transition-all duration-300 group">
              <RiMoneyDollarCircleFill className="text-3xl sm:text-4xl md:text-5xl text-green-400 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg mb-1">
                100% Profit Split
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Keep all simulated profits
              </p>
            </div>
            <div className=" p-4 sm:p-5 text-center transition-all duration-300 group">
              <FaRocket className="text-3xl sm:text-4xl md:text-5xl text-green-400 mb-2 sm:mb-3 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg mb-1">
                Launch Special
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                50% off first challenge
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
