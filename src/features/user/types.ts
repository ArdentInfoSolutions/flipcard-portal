import type { UserProfile } from "../../lib/types"

export interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}