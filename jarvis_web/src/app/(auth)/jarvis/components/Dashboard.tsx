"use client";

import { JarvisAvatar } from "./JarvisAvatar";
import { IntroCard } from "./IntroCard";
import { JarvisFunctions } from "./JarvisFunctions";
import { TimeDate } from "./TimeDate";
import { Subtitles } from "./Subtitles";
import { ConnectionStatus } from "./ConnectionStatus";

export function Dashboard() {
  return (
    <div className="w-full h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[50px_50px] pointer-events-none" />

      {/* Glow effects */}
      {/* <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" /> */}

      {/* Main Container */}
      <div className="relative w-full h-full flex gap-6 p-6">
        {/* LEFT PANEL */}
        <div className="w-1/4 flex flex-col justify-between overflow-y-auto pr-2">
          {/* Top: Intro and About */}
          <div className="shrink-0">
            <IntroCard />
          </div>

          {/* Bottom: Functions */}
          <div className="shrink-0">
            <JarvisFunctions />
          </div>
        </div>

        {/* CENTER - VRM AVATAR */}
        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-900/40">
          <JarvisAvatar />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/4 flex flex-col justify-between overflow-y-auto pl-2">
          {/* Top: Time and Date */}
          <div className="shrink-0">
            <TimeDate />
          </div>

          {/* Bottom: Subtitles */}
          <div className="flex-1 flex flex-col min-h-0">
            <Subtitles />
          </div>
        </div>
      </div>

      {/* Connection Status Indicator */}
      <ConnectionStatus />
    </div>
  );
}
