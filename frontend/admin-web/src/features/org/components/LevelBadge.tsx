import { Tag } from '../../../components/ui'

interface LevelBadgeProps {
  /** Null when the designation is not in the hierarchy. */
  level: number | null
  /** Branch Manager (n+1) and Tenant Admin (n+2) are placed automatically. */
  reserved?: boolean
}

// "Level 3", or "Level 4 · reserved" for the levels the hierarchy places automatically.
export function LevelBadge({ level, reserved = false }: LevelBadgeProps) {
  if (level === null) return <span className="text-sm text-content-secondary">—</span>
  return <Tag tone={reserved ? 'brand' : 'neutral'}>{reserved ? `Level ${level} · reserved` : `Level ${level}`}</Tag>
}
