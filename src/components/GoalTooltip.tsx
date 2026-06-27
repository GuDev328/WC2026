import { memo, useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { GoalEvent } from '../types'
import TEAMS from '../data/teams'
import { fetchMatchGoals } from '../services/api'
import { flagUrl } from '../utils/flag'

let portalEl: HTMLDivElement | null = null
function getPortalEl() {
  if (!portalEl) {
    portalEl = document.createElement('div')
    document.body.appendChild(portalEl)
  }
  return portalEl
}

interface GoalTooltipProps {
  matchId: string
  children: React.ReactNode
}

export default memo(function GoalTooltip({ matchId, children }: GoalTooltipProps) {
  const [goals, setGoals] = useState<GoalEvent[] | null>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const loadRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const hoverRef = useRef({ inTrigger: false, inTooltip: false })

  const load = useCallback(() => {
    if (loadRef.current) return
    loadRef.current = true
    fetchMatchGoals(matchId).then(setGoals)
  }, [matchId])

  const show = useCallback(() => {
    hoverRef.current.inTrigger = true
    clearTimeout(timerRef.current)
    load()
    const el = triggerRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      const halfWidth = 140 // max-w-[280px] / 2
      let left = r.left + r.width / 2
      const margin = 8
      if (left - halfWidth < margin) left = halfWidth + margin
      if (left + halfWidth > window.innerWidth - margin) left = window.innerWidth - halfWidth - margin
      setPos({ x: left, y: r.bottom + 6 })
    }
    setOpen(true)
  }, [load])

  const tryHide = useCallback((from: 'trigger' | 'tooltip') => {
    if (from === 'trigger') hoverRef.current.inTrigger = false
    if (from === 'tooltip') hoverRef.current.inTooltip = false
    timerRef.current = setTimeout(() => {
      if (!hoverRef.current.inTrigger && !hoverRef.current.inTooltip) {
        setOpen(false)
      }
    }, 150)
  }, [])

  const enterTooltip = useCallback(() => {
    hoverRef.current.inTooltip = true
    clearTimeout(timerRef.current)
  }, [])

  // Click-outside dismiss (for touch devices)
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current && triggerRef.current.contains(target)) return
      const tooltipEl = document.querySelector('[data-goal-tooltip]')
      if (tooltipEl && tooltipEl.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])

  const loaded = goals !== null
  const hasGoals = loaded && goals.length > 0

  return (
    <div ref={triggerRef} className="inline-flex items-center cursor-pointer py-1 px-0.5 -my-1 -mx-0.5" onMouseEnter={show} onMouseLeave={() => tryHide('trigger')} onTouchStart={(e) => { e.stopPropagation(); open ? setOpen(false) : show() }}>
      <div className={`absolute -inset-1 rounded-md transition-opacity bg-white/[0.03] ring-1 ring-white/5 ${open ? 'opacity-100' : 'opacity-0'}`} />
      <span className="relative z-10 ">{children}</span>
      <span className={`relative z-10 w-2.5 h-2.5 flex items-center justify-center ml-0.5 transition-opacity flex-shrink-0 ${open ? 'opacity-100' : 'opacity-0'}`}>
        <svg width="7" height="4" viewBox="0 0 7 4" fill="none"><path d="M1 0.5L3.5 3L6 0.5" stroke="#52525b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>

      {open && createPortal(
        <div
          data-goal-tooltip
          className="fixed z-[9999] animate-fade-up"
          style={{ top: pos.y, left: pos.x, transform: 'translate(-50%, 0)' }}
          onMouseEnter={enterTooltip}
          onMouseLeave={() => tryHide('tooltip')}
        >
          <div className="bg-[#18181b] border border-[#3f3f46] rounded-xl p-3 shadow-2xl shadow-black/90 min-w-[220px] max-w-[280px]">
            <div className="text-[9px] text-[#52525b] uppercase tracking-wider mb-2.5 font-semibold flex items-center gap-2">
              ⚽ Cầu thủ ghi bàn
              <button type="button" onClick={() => setOpen(false)} className="ml-auto text-[#52525b] hover:text-white  text-sm leading-none">✕</button>
            </div>

            {!loaded ? (
              <div className="flex items-center gap-2 text-[11px] text-[#52525b] py-1">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#3f3f46] border-t-[#22d3ee] animate-spin" />
                Đang tải...
              </div>
            ) : !hasGoals ? (
              <p className="text-[11px] text-[#52525b] py-1">Chưa có dữ liệu bàn thắng</p>
            ) : (
              <div className="space-y-1.5">
                {goals!.map((g, i) => {
                  const team = TEAMS[g.teamId]
                  const name = g.scorerName || 'Không rõ'
                  return (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <span className="w-12 text-right tabular-nums font-mono text-[10px] text-[#a1a1aa] flex-shrink-0">{g.minute}'</span>
                      <span className="text-center flex-shrink-0 text-[11px]">{g.penalty ? '🎯' : g.ownGoal ? '😵' : '⚽'}</span>
                      <img src={flagUrl(team?.iso2 || 'xx')} alt="" className="w-3.5 h-2.5 object-cover rounded-sm flex-shrink-0 opacity-70" />
                      <span className="text-[#e4e4e7] font-medium truncate flex-1">{name.length > 24 ? name.substring(0, 22) + '…' : name}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>,
        getPortalEl(),
      )}
    </div>
  )
})
