// Campus buildings keyed to the 2016 official map legend.
// Each entry includes display name, building number, and a
// short list of walking-step instructions from common starting points.

export interface Building {
  id: string
  name: string
  number: string          // e.g. "17", "9", "14"
  category: 'admin' | 'academic' | 'housing' | 'chapel' | 'dining' | 'library' | 'athletics' | 'service'
  blurb: string
}

export const BUILDINGS: Building[] = [
  // Administrative
  { id: 'davis',         name: 'Davis Building',          number: '1',  category: 'admin',     blurb: 'Admissions, financial aid, registrar.' },
  { id: 'barton',        name: 'Barton Building',         number: '17', category: 'admin',     blurb: 'Administration, president\u2019s office.' },
  { id: 'maintenance',   name: 'Maintenance Building',    number: '16', category: 'service',   blurb: 'Facilities and operations.' },
  { id: '6710',          name: '6710 Building',           number: '23', category: 'service',   blurb: 'Northwest entrance overflow.' },
  { id: 'ness',          name: 'Ness Building',           number: '10', category: 'admin',     blurb: 'Miscellaneous offices.' },

  // Academic
  { id: 'hsc',           name: 'Health & Sciences Center',number: '18', category: 'academic',  blurb: 'Nursing, PA Medicine, health sciences.' },
  { id: 'pecota',        name: 'Pecota Student Center',   number: '11', category: 'academic',  blurb: 'Student life, leadership, organizations.' },
  { id: 'bronson',       name: 'Bronson Hall',            number: '10A',category: 'academic',  blurb: 'Classrooms and faculty offices.' },
  { id: 'rice',          name: 'Rice Hall',               number: '10B',category: 'academic',  blurb: 'Classrooms and faculty offices.' },
  { id: 'williams',      name: 'Williams Hall',           number: '10C',category: 'academic',  blurb: 'Classrooms and faculty offices.' },
  { id: 'fee',           name: 'Fee Hall',                number: '10D',category: 'academic',  blurb: 'Classrooms and faculty offices.' },
  { id: 'millard',       name: 'Millard Hall',            number: '12', category: 'academic',  blurb: 'Classrooms and faculty offices.' },
  { id: 'amundsen',      name: 'Amundsen Music Center',   number: '14', category: 'academic',  blurb: 'Music department, practice rooms.' },
  { id: 'studio-housing',name: 'F.I.R.s Apartments',     number: '7',  category: 'service',   blurb: 'Faculty / staff housing.' },
  { id: 'student-housing-east', name: 'Student Housing East', number: '8', category: 'housing',  blurb: 'Student apartments (Bronson / Davis / Rice area).' },

  // Chapel
  { id: 'chapel',        name: 'Butterfield Chapel',      number: '14',category: 'chapel',    blurb: 'Worship services, chapel, prayer.' },

  // Housing / Dorms
  { id: 'gray',          name: 'Gray Residence Hall',     number: '2A', category: 'housing',   blurb: 'Women\u2019s residence.' },
  { id: 'beatty',        name: 'Beatty Residence Hall',   number: '2B', category: 'housing',   blurb: 'Men\u2019s residence.' },
  { id: 'crowder',       name: 'Crowder Residence Hall',  number: '4A', category: 'housing',   blurb: 'Women\u2019s residence.' },
  { id: 'guy',           name: 'Guy Residence Hall',      number: '4B', category: 'housing',   blurb: 'Men\u2019s residence.' },
  { id: 'perks',         name: 'Perks Residence Hall',    number: '4C', category: 'housing',   blurb: 'Women\u2019s residence.' },
  { id: 'greeley',       name: 'Greeley Center',          number: '5',  category: 'admin',     blurb: 'Student center, study spaces.' },
  { id: 'studio-6a',     name: 'Studio 6A',               number: '6A', category: 'housing',   blurb: 'Apartment-style student housing.' },
  { id: 'studio-6b',     name: 'Studio 6B',               number: '6B', category: 'housing',   blurb: 'Apartment-style student housing.' },
  { id: 'studio-6c',     name: 'Studio 6C',               number: '6C', category: 'housing',   blurb: 'Apartment-style student housing.' },
  { id: 'studio-6d',     name: 'Studio 6D',               number: '6D', category: 'housing',   blurb: 'Apartment-style student housing.' },
  { id: 'studio-6e',     name: 'Studio 6E',               number: '6E', category: 'housing',   blurb: 'Apartment-style student housing.' },
  { id: 'studio-6f',     name: 'Studio 6F',               number: '6F', category: 'housing',   blurb: 'Apartment-style student housing.' },
  { id: 'studio-6g',     name: 'Studio 6G',               number: '6G', category: 'housing',   blurb: 'Apartment-style student housing.' },

  // Dining
  { id: 'caf',           name: 'Northwest Dining Hall',   number: '3',  category: 'dining',    blurb: 'The Caf. Breakfast, lunch, dinner.' },
  { id: 'cafe2',         name: 'Greeley Center Cafe',     number: '5',  category: 'dining',    blurb: 'Coffee, light bites, study space.' },

  // Library
  { id: 'library',       name: 'Hurst Library',           number: '9',  category: 'library',   blurb: 'Main library, study rooms, research help.' },

  // Athletics / Rec
  { id: 'pavilion',      name: 'Northwest Pavilion (Gym)', number: '13', category: 'athletics', blurb: 'Indoor athletics and the Eagles\u2019 home gym.' },
  { id: 'duplex',        name: 'Duplex Faculty / Staff',  number: '6',  category: 'service',   blurb: 'Faculty / staff housing.' }
]

export function getBuilding(id: string) {
  return BUILDINGS.find(b => b.id === id)
}

// ===== Walking directions =====
// The campus is small enough that every "from X to Y" trip is 2-5 minutes
// at a normal pace. These directions describe landmarks and turns along
// the actual paved walkways shown on the 2016 map.

interface Step {
  text: string
  hint?: string  // optional landmark / sign
}

interface Directions {
  from: string
  to: string
  totalMin: number     // estimated minutes
  distanceM: number    // rough meters
  steps: Step[]
}

const M = (n: number) => `~${n} min`
const METERS = (n: number) => `~${n} m`

// Helpers for common segments
const exitBartonNorth = (to: string): Step[] => [
  { text: 'Exit Barton Building through the main entrance facing Barton Loop.', hint: 'Barton Loop' },
  { text: 'Turn left (west) and follow the walkway along the loop.' },
  { text: `Continue toward your destination (${to}).` }
]

// "From Barton to X" generator
function fromBarton(to: Building): Directions {
  // Determine direction by quadrant of the destination
  const hsc: Directions = {
    from: 'Barton', to: 'HSC',
    totalMin: 3, distanceM: 200,
    steps: [
      { text: 'Exit Barton Building through the main entrance onto Barton Loop.', hint: 'Barton Loop' },
      { text: 'Turn left (north) and follow the loop around the southwest corner of the campus.' },
      { text: 'At the tennis court, continue north (straight) past 10A / 10B (Bronson, Rice) on your right.' },
      { text: 'Cross NE 68th Way and the HSC (Health & Sciences Center) will be on your right.', hint: 'Building 18' }
    ]
  }

  const chapel: Directions = {
    from: 'Barton', to: 'Chapel',
    totalMin: 2, distanceM: 150,
    steps: [
      { text: 'Exit Barton Building through the main entrance onto Barton Loop.' },
      { text: 'Turn left (west) and walk straight along the loop for about 60 meters.' },
      { text: 'Butterfield Chapel is on your right, just past the Pavilion (Gym).', hint: 'Building 14' }
    ]
  }

  const dorms: Directions = {
    from: 'Barton', to: 'Dorms (Gray / Beatty)',
    totalMin: 4, distanceM: 320,
    steps: [
      { text: 'Exit Barton Building onto Barton Loop.' },
      { text: 'Turn left (west) and walk along the loop past the Chapel and Pavilion (Gym).' },
      { text: 'Continue west on NE 55th Way, crossing 108th Ave NE at the main crosswalk.' },
      { text: 'Beatty (2B) is the first building on the right; Gray (2A) is just behind it.', hint: 'Residence halls (north side of campus)' }
    ]
  }

  const dormsSouth: Directions = {
    from: 'Barton', to: 'Dorms (Crowder / Guy / Perks)',
    totalMin: 3, distanceM: 220,
    steps: [
      { text: 'Exit Barton Building onto Barton Loop.' },
      { text: 'Turn left (west) and walk along the loop past the Chapel.' },
      { text: 'Cross the central quad (Hurst Library 9 will be on your right).' },
      { text: 'Crowder (4A) and Guy (4B) are the two connected buildings on your right. Perks (4C) is just behind them.', hint: 'Residence halls (central)' }
    ]
  }

  const caf: Directions = {
    from: 'Barton', to: 'Northwest Dining Hall (Caf)',
    totalMin: 4, distanceM: 280,
    steps: [
      { text: 'Exit Barton Building onto Barton Loop.' },
      { text: 'Turn left (west) and walk along the loop past the Chapel and Pavilion.' },
      { text: 'Continue west on NE 55th Way. Davis Building (1) will be on your right.' },
      { text: 'Northwest Dining Hall is the large building just past Davis, on your right.', hint: 'Building 3 — The Caf' }
    ]
  }

  const library: Directions = {
    from: 'Barton', to: 'Hurst Library',
    totalMin: 2, distanceM: 150,
    steps: [
      { text: 'Exit Barton Building onto Barton Loop.' },
      { text: 'Turn left (west) and walk along the loop past the Chapel (Building 14).' },
      { text: 'Continue west; Hurst Library is the large building on the right side of the central quad.', hint: 'Building 9' }
    ]
  }

  const pecota: Directions = {
    from: 'Barton', to: 'Pecota Student Center',
    totalMin: 3, distanceM: 200,
    steps: [
      { text: 'Exit Barton Building onto Barton Loop.' },
      { text: 'Turn left (west) and walk along the loop past the Chapel.' },
      { text: 'Cross NE 66th Way and continue north past the small parking lot.' },
      { text: 'Pecota Student Center is the building on your left, just south of the HSC.', hint: 'Building 11' }
    ]
  }

  switch (to.id) {
    case 'hsc':          return hsc
    case 'chapel':       return chapel
    case 'gray':
    case 'beatty':
    case 'studio-6a':
    case 'studio-6b':
    case 'studio-6c':
    case 'studio-6d':
    case 'studio-6e':
    case 'studio-6f':
    case 'studio-6g':
      return dorms
    case 'crowder':
    case 'guy':
    case 'perks':
      return dormsSouth
    case 'caf':          return caf
    case 'library':      return library
    case 'pecota':       return pecota
    case 'pavilion':     return {
      from: 'Barton', to: 'Pavilion (Gym)',
      totalMin: 2, distanceM: 120,
      steps: [
        { text: 'Exit Barton Building onto Barton Loop.' },
        { text: 'Turn left (west); the Pavilion Gym is the next building on your left.', hint: 'Building 13' }
      ]
    }
    default:             return {
      from: 'Barton', to: to.name,
      totalMin: 3, distanceM: 200,
      steps: exitBartonNorth(to.name)
    }
  }
}

// "From X to Barton" generator (reverse of above)
function toBarton(from: Building): Directions {
  return {
    from: from.name, to: 'Barton',
    totalMin: 3, distanceM: 200,
    steps: [
      { text: `Leave ${from.name} and head south toward Barton Loop.` },
      { text: 'At Barton Loop, turn right (east) — the Barton Building is the large administrative building on the right side of the loop.', hint: 'Building 17' }
    ]
  }
}

// Generic "from any X to any Y" - simple cardinal directions
function genericDirections(from: Building, to: Building): Directions {
  // Estimate by relative position
  const fromX = buildingX(from)
  const fromY = buildingY(from)
  const toX   = buildingX(to)
  const toY   = buildingY(to)
  const dx = toX - fromX
  const dy = toY - fromY
  const distance = Math.round(Math.hypot(dx, dy) * 0.7) // rough walking conversion
  const minutes  = Math.max(1, Math.round(distance / 80))   // ~80m per minute

  const steps: Step[] = [
    { text: `Exit ${from.name} and head toward ${to.name}.` }
  ]
  if (Math.abs(dx) > 60) {
    const dir = dx > 0 ? 'east' : 'west'
    steps.push({ text: `Walk ${dir} across campus toward the ${to.category} buildings.` })
  }
  if (Math.abs(dy) > 60) {
    const dir = dy > 0 ? 'south' : 'north'
    steps.push({ text: `Then head ${dir} toward ${to.name}.` })
  }
  steps.push({ text: `${to.name} will be on your ${dx < 0 ? 'left' : 'right'}.`, hint: `Building ${to.number}` })

  return { from: from.name, to: to.name, totalMin: minutes, distanceM: distance, steps }
}

function buildingX(b: Building): number {
  // Approximate x-coordinate on a 0-1000 map, derived from the layout above
  const map: Record<string, number> = {
    'davis': 200, 'barton': 850, 'maintenance': 760, '6710': 90, 'ness': 720,
    'hsc': 600, 'pecota': 520, 'bronson': 680, 'rice': 700, 'williams': 700, 'fee': 720, 'millard': 720,
    'amundsen': 700, 'studio-housing': 740, 'student-housing-east': 800,
    'chapel': 480, 'gray': 280, 'beatty': 320, 'crowder': 360, 'guy': 380, 'perks': 420,
    'greeley': 130, 'studio-6a': 320, 'studio-6b': 540, 'studio-6c': 540, 'studio-6d': 540, 'studio-6e': 540, 'studio-6f': 760, 'studio-6g': 740,
    'caf': 360, 'cafe2': 130, 'library': 460, 'pavilion': 380, 'duplex': 280
  }
  return map[b.id] ?? 500
}

function buildingY(b: Building): number {
  // Approximate y-coordinate (north small, south large)
  const map: Record<string, number> = {
    'davis': 200, 'barton': 720, 'maintenance': 110, '6710': 60, 'ness': 580,
    'hsc': 480, 'pecota': 500, 'bronson': 120, 'rice': 110, 'williams': 110, 'fee': 80, 'millard': 500,
    'amundsen': 530, 'studio-housing': 360, 'student-housing-east': 200,
    'chapel': 600, 'gray': 180, 'beatty': 200, 'crowder': 320, 'guy': 320, 'perks': 320,
    'greeley': 380, 'studio-6a': 100, 'studio-6b': 130, 'studio-6c': 130, 'studio-6d': 130, 'studio-6e': 130, 'studio-6f': 110, 'studio-6g': 60,
    'caf': 200, 'cafe2': 380, 'library': 420, 'pavilion': 510, 'duplex': 320
  }
  return map[b.id] ?? 400
}

export function getDirections(fromId: string, toId: string): Directions | null {
  const from = getBuilding(fromId)
  const to   = getBuilding(toId)
  if (!from || !to) return null
  if (from.id === to.id) return null

  if (from.id === 'barton') return fromBarton(to)
  if (to.id   === 'barton') return toBarton(from)
  return genericDirections(from, to)
}
