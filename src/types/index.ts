export interface Team {
  id: string
  name: string
  nameVi: string
  flag: string
  fifaCode: string
  iso2: string
}

export interface Group {
  id: string
  name: string
  teams: Team[]
}

export interface GroupStanding {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED'

export interface GoalEvent {
  teamId: string
  scorerName: string
  minute: string
  ownGoal: boolean
  penalty: boolean
}

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number | null
  awayScore: number | null
  status: MatchStatus
  stage: 'GROUP' | 'R32' | 'R16' | 'QUARTER' | 'SEMI' | 'FINAL' | 'THIRD_PLACE'
  groupName?: string
  roundName?: string
  date: string
  venue: string
  minute?: number
  name?: string
  matchNumber?: number
  goals?: GoalEvent[]
}

export interface BracketSlot {
  id: string
  matchId: string
  homeTeamId: string | null
  awayTeamId: string | null
  homeScore: number | null
  awayScore: number | null
  winner: string | null
  nextMatchId: string | null
  stage: Match['stage']
  roundName: string
}

export interface TournamentData {
  groups: Group[]
  standings: Record<string, GroupStanding[]>
  groupMatches: Match[]
  bracket: BracketSlot[]
}

export interface LiveScoreResponse {
  matches: Match[]
  lastUpdated: number
}

export type TabId = 'groups' | 'bracket' | 'matches'
