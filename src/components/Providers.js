'use client'

import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export function Providers({ children }) {
  return (
    <SessionProvider>
      <SWRConfig
        value={{
          fetcher,
          revalidateOnFocus: false,
          dedupingInterval: 60000,
        }}
      >
        {children}
      </SWRConfig>
    </SessionProvider>
  )
}