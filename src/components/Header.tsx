import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  lastUpdated: number | null
  error: string | null
  onRefresh: () => void
  liveCount: number
}

export default function Header({ lastUpdated, error, onRefresh, liveCount }: HeaderProps) {
  const [timeAgo, setTimeAgo] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    function update() {
      if (lastUpdated === null) { setTimeAgo(''); return }
      const diff = Math.floor((Date.now() - lastUpdated) / 1000)
      if (diff < 30) setTimeAgo('vừa xong')
      else if (diff < 60) setTimeAgo(`${diff}s trước`)
      else if (diff < 3600) setTimeAgo(`${Math.floor(diff / 60)}ph trước`)
      else setTimeAgo(`${Math.floor(diff / 3600)}h trước`)
    }
    update()
    timerRef.current = setInterval(update, 10_000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [lastUpdated])

  return (
    <header className="sticky top-0 z-50 glass border-b border-[#27272a]/40 safe-top">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between px-3 sm:px-6 py-2 sm:py-3 gap-y-2">
        <div className="flex items-center gap-3">
          {/* Animated WC Trophy Logo */}
          <div className="relative flex-shrink-0">
            <svg width="34" height="38" viewBox="0 0 36 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-trophy">
              <path d="M6 12h4l4-12h8l4 12h4s2 0 2 2v2c0 4-3 8-7 10l2 6h-6l-3-6-3 6h-6l2-6c-4-2-7-6-7-10v-2s1-2 2-2z"
                fill="url(#tGrad)" stroke="url(#tStroke)" strokeWidth="0.5" />
              <path d="M6 14C3 14 1 16 1 18s2 4 5 4" fill="none" stroke="url(#tStroke)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M30 14c3 0 5 2 5 4s-2 4-5 4" fill="none" stroke="url(#tStroke)" strokeWidth="1.5" strokeLinecap="round" />
              <text x="18" y="21" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="800">★</text>
              <defs>
                <linearGradient id="tGrad" x1="18" y1="0" x2="18" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f59e0b" /><stop offset="0.5" stopColor="#fbbf24" /><stop offset="1" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="tStroke" x1="18" y1="0" x2="18" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f59e0b" stopOpacity="0.6" /><stop offset="1" stopColor="#d97706" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute -inset-2 rounded-full bg-[#f59e0b]/5 blur-xl -z-10 animate-breathe" />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-tight leading-tight flex items-center gap-2">
              <span className="gradient-text">WORLD CUP</span>
              <span className="text-white">2026</span>
              {liveCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#f43f5e] bg-[#f43f5e]/10 px-1.5 py-0.5 rounded-md animate-fade-in">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f43f5e] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#f43f5e]" />
                  </span>
                  {liveCount} <span className="hidden sm:inline">LIVE</span>
                </span>
              )}
            </h1>
            <p className="text-[10px] text-[#3f3f46] tracking-widest uppercase">
              Canada · Mexico · Hoa Kỳ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {error && (
            <span className="text-[10px] bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20 px-2 py-1 rounded-md animate-fade-in">
              ⚠ {error}
            </span>
          )}
          <div className="flex items-center gap-3 text-[10px] text-[#3f3f46]">
            {timeAgo && (
              <span className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                {timeAgo}
              </span>
            )}
            {lastUpdated && (
              <span>
                {new Date(lastUpdated).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="text-[11px] font-medium bg-white/5 hover:bg-white/10 text-[#a1a1aa] border border-[#27272a] hover:border-[#3f3f46] px-3 py-2.5 sm:py-1.5 rounded-lg transition-all active:scale-95 ripple touch-target flex items-center justify-center"
          >
            ↻ Làm mới
          </button>
        </div>
      </div>
    </header>
  )
}
