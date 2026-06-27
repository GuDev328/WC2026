import type { TabId } from '../types'

interface TabsProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TAB_CONFIG: { id: TabId; label: string; icon: string }[] = [
  { id: 'groups', label: 'Vòng Bảng', icon: '📊' },
  { id: 'bracket', label: 'Nhánh Đấu', icon: '🏟️' },
  { id: 'matches', label: 'Trận Đấu', icon: '⚽' },
]

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <nav className="flex justify-center gap-1 px-6 py-4">
      <div className="flex bg-[#18181b] rounded-xl p-1 border border-[#27272a] shadow-lg shadow-black/20">
        {TAB_CONFIG.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative px-5 py-2 text-xs font-medium rounded-lg transition-all  flex items-center gap-2 ${
                active
                  ? 'text-white bg-white/10 shadow-sm shadow-black/20'
                  : 'text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              <span className={active ? 'scale-110 transition-transform' : ''}>
                {tab.icon}
              </span>
              {tab.label}
              {/* Active indicator dot */}
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a78bfa]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
