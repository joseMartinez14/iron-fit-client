export type ClassItem = {
  id: string
  title: string
  start: string
  end: string
  instructor: string
  spotsLeft?: number
  full?: boolean
  reserved?: boolean
  description?: string
}

export const days = [
  { key: 'mon', label: 'Mon\n29 Jul', dateLabel: 'Monday, July 29' },
  { key: 'tue', label: 'Tue\n30 Jul', dateLabel: 'Tuesday, July 30' },
  { key: 'wed', label: 'Wed\n31 Jul', dateLabel: 'Wednesday, July 31' },
  { key: 'thu', label: 'Thu\n1 Aug', dateLabel: 'Thursday, August 1' },
  { key: 'fri', label: 'Fri\n2 Aug', dateLabel: 'Friday, August 2' },
]

export type Day = typeof days[number]

export const sampleSchedule: Record<string, ClassItem[]> = {
  mon: [
    {
      id: '1',
      title: 'Morning HIIT',
      start: '6:30 AM',
      end: '7:30 AM',
      instructor: 'Coach Michael',
      spotsLeft: 3,
      reserved: true,
      description:
        'A high-intensity interval training session focused on cardio bursts and bodyweight strength moves.',
    },
    {
      id: '2',
      title: 'Lunch Power Yoga',
      start: '12:00 PM',
      end: '1:00 PM',
      instructor: 'Coach Emma',
      spotsLeft: 8,
      description:
        'A flowing yoga class to build strength and mobility—perfect reset for midday.',
    },
    {
      id: '3',
      title: 'Strength Training',
      start: '5:30 PM',
      end: '6:30 PM',
      instructor: 'Coach David',
      spotsLeft: 2,
      description:
        'Compound lifts and guided sets with attention to form and progressive overload.',
    },
    {
      id: '4',
      title: 'Evening Spin',
      start: '7:00 PM',
      end: '8:00 PM',
      instructor: 'Coach Sophia',
      full: true,
      description:
        'Low-impact, high-energy cycling class with rhythm-based intervals and climbs.',
    },
  ],
}

export type Participant = { id: string; name: string }

const participantsByClass: Record<string, Participant[]> = {
  '1': [
    { id: 'u1', name: 'Alex P.' },
    { id: 'u2', name: 'Jamie R.' },
    { id: 'u3', name: 'Taylor S.' },
    { id: 'u4', name: 'Chris L.' },
    { id: 'u5', name: 'Jordan K.' },
  ],
  '2': [
    { id: 'u6', name: 'Morgan H.' },
    { id: 'u7', name: 'Riley M.' },
    { id: 'u8', name: 'Sam D.' },
  ],
  '3': [
    { id: 'u9', name: 'Dana W.' },
    { id: 'u10', name: 'Casey T.' },
  ],
  '4': [
    { id: 'u11', name: 'Pat V.' },
    { id: 'u12', name: 'Lee Q.' },
    { id: 'u13', name: 'Avery N.' },
    { id: 'u14', name: 'Robin J.' },
    { id: 'u15', name: 'Sky E.' },
    { id: 'u16', name: 'Quinn B.' },
  ],
}

export function getClassById(id: string): ClassItem | undefined {
  for (const key of Object.keys(sampleSchedule)) {
    const found = sampleSchedule[key]?.find((c) => c.id === id)
    if (found) return found
  }
  return undefined
}

export function getParticipantsForClass(id: string): Participant[] {
  return participantsByClass[id] ?? []
}

