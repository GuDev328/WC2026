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
    <nav className="flex justify-center gap-1 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex w-full sm:w-auto bg-[#18181b] rounded-xl p-1 border border-[#27272a] shadow-lg shadow-black/20">
        {TAB_CONFIG.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 sm:flex-initial justify-center px-2 sm:px-5 py-2.5 sm:py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 touch-target ${
                active
                  ? 'text-white bg-white/10 shadow-sm shadow-black/20'
                  : 'text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              <span className={active ? 'scale-110 transition-transform' : ''}>
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label === 'Vòng Bảng' ? 'Bảng' : tab.label === 'Nhánh Đấu' ? 'Nhánh' : 'Trận'}</span>
              {/* Active indicator */}
              {active && (
                <span className="absolute bottom-0 left-1 right-1 sm:left-1/2 sm:-translate-x-1/2 sm:w-8 h-0.5 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#a78bfa]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
