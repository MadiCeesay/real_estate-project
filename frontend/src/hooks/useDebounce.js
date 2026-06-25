import { useState, useEffect } from 'react'

// Used in search inputs and filters to avoid firing an API call on every
// keystroke — waits `delay` ms after the user stops typing.
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
