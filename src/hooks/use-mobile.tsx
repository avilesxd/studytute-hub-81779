import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * The `useIsMobile` custom hook in TypeScript React determines if the current viewport is on a mobile device based on a specified breakpoint.
 * @returns The `useIsMobile` function returns a boolean value indicating whether the current viewport width is considered as mobile based on
 * the `MOBILE_BREAKPOINT` value.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
