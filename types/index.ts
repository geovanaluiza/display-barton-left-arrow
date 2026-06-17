export type WorldKey =
  | 'home'
  | 'discover'
  | 'life'
  | 'events'
  | 'academics'
  | 'athletics'
  | 'faith'
  | 'president'
  | 'swoop-shop'

export type Category = 'athletics' | 'student-life' | 'faith' | 'events' | 'campus' | 'academics' | 'community' | 'general'

export interface Photo {
  src: string
  name: string
  category: Category
  date?: string
}

export interface EventItem {
  id: string
  title: string
  date: string
  time: string
  location: string
  category: 'chapel' | 'athletics' | 'arts' | 'social' | 'service' | 'academic'
  blurb: string
  image?: string
}

export interface StoryItem {
  id: string
  name: string
  program: string
  year: string
  quote: string
  image?: string
}

export interface TeamItem {
  id: string
  sport: string
  season: string
  record: string
  nextGame: string
  nextOpponent: string
  image?: string
}

export interface ClubItem {
  id: string
  name: string
  category: string
  members: number
  meeting: string
  blurb: string
  image?: string
}

export interface ProgramItem {
  id: string
  college: string
  programs: string[]
  tagline: string
  image?: string
}
