import { useState, useCallback } from 'react'
import type { TabId } from '../types'

interface UseTabsReturn {
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
}

export function useTabs(defaultTab: TabId = 'groups'): UseTabsReturn {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)
  return { activeTab, setActiveTab: useCallback((tab) => setActiveTab(tab), []) }
}
