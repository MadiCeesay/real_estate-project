// 24-hour time slots accepted by the booking API (HH:MM)
export const VIEWING_TIME_SLOTS = [
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '01:00 PM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '16:00', label: '04:00 PM' },
  { value: '17:00', label: '05:00 PM' },
]

export const formatViewingTime = (time24) => {
  if (!time24) return ''
  const slot = VIEWING_TIME_SLOTS.find((s) => s.value === time24)
  if (slot) return slot.label
  const [h, m] = time24.split(':').map(Number)
  if (Number.isNaN(h)) return time24
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${String(hour12).padStart(2, '0')}:${String(m || 0).padStart(2, '0')} ${period}`
}
