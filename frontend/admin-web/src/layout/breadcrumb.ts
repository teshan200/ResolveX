import { createContext, useContext, useEffect } from 'react'

type SetCrumb = (crumb: string[] | null) => void

export const BreadcrumbContext = createContext<SetCrumb>(() => {})

// Lets a detail page replace the top bar breadcrumb, e.g. "Companies > Harbour Grill".
export function useBreadcrumb(crumb: string[] | null) {
  const setCrumb = useContext(BreadcrumbContext)
  const key = crumb?.join('\u0000') ?? null

  useEffect(() => {
    setCrumb(key === null ? null : key.split('\u0000'))
    return () => setCrumb(null)
  }, [key, setCrumb])
}
