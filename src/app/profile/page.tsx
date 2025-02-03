"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchUserProfile, updateUserProfile } from "../../lib/slices/userSlice"
import ProfileForm from "../../components/ProfileForm"
import { selectAuthState } from "@/features/auth/authSelectors"

export default function Profile() {
  const dispatch = useAppDispatch()
  // const { user, loading, error } = useAppSelector(selectAuthState);

  const { user } = useAppSelector((state) => state.auth)
  // const { profile, loading, error } = useAppSelector((state) => state.user)
  const { profile, loading, error } = useAppSelector(selectAuthState);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile(user.uid))
    }
  }, [dispatch, user])

  const handleUpdateProfile = (profileData: Partial<typeof profile>) => {
    dispatch(updateUserProfile(profileData))
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>No profile data</div>

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">User Profile</h1>
      <ProfileForm profile={profile} onSubmit={handleUpdateProfile} />
    </main>
  )
}

