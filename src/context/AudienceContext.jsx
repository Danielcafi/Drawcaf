import { createContext, useContext, useState } from 'react'

const AudienceContext = createContext()

export function AudienceProvider({ children }) {
  const [audience, setAudience] = useState('seller')

  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </AudienceContext.Provider>
  )
}

export function useAudience() {
  return useContext(AudienceContext)
}
