import { useMemo } from 'react'

function useNotFoundMeta() {
  return useMemo(
    () => ({
      title: 'This route is off the MT103 grid',
      description: 'The destination you were trying to reach does not exist in this UI-only experience.',
      cta: 'Return to dashboard',
    }),
    [],
  )
}

export default useNotFoundMeta
