import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  deviceName?: string;
  isCompact?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  deviceName = 'Pixel 9 Pro · Android 15',
  isCompact = false,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Device wrapper */}
      <div
        className={`relative bg-[#0d0d16] text-slate-100 rounded-[44px] p-3 shadow-2xl ring-1 ring-white/10 border-4 border-[#252538] transition-all duration-300 ${
          isCompact ? 'w-[360px] h-[720px]' : 'w-[400px] h-[820px] max-w-full'
        }`}
      >
        {/* Outer Phone Bezel & Screen Container */}
        <div className="relative w-full h-full bg-[#0a0a12] rounded-[36px] overflow-hidden flex flex-col shadow-inner border border-slate-800/80">
          {/* Status Bar */}
          <div className="h-10 px-6 flex items-center justify-between z-30 select-none bg-transparent">
            {/* Clock */}
            <span className="text-xs font-semibold tracking-tight text-slate-200">
              {timeStr || '12:30'}
            </span>

            {/* Front Camera Punch-hole */}
            <div className="w-3.5 h-3.5 bg-black rounded-full ring-2 ring-[#1e1e2d] mx-auto shadow-inner" />

            {/* Status Icons */}
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Screen Body */}
          <div className="flex-1 relative flex flex-col overflow-hidden">
            {children}
          </div>

          {/* Android Navigation Gesture Bar */}
          <div className="h-5 flex items-center justify-center bg-transparent z-30 pointer-events-none">
            <div className="w-32 h-1 bg-slate-400/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Device Info Badge */}
      <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{deviceName}</span>
      </div>
    </div>
  );
};
