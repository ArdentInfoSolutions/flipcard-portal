import { useState } from "react"

interface ProfileFormProps {
  profile: {
    name: string
    email: string
    bio: string
    photo: string
    place: string
    interests: string[]
  }
  onSubmit: (profileData: Partial<ProfileFormProps["profile"]>) => void
}

export default function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState(profile)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="bio" className="block mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="place" className="block mb-1">
          Place
        </label>
        <input
          type="text"
          id="place"
          name="place"
          value={formData.place}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Update Profile
      </button>
    </form>
  )
}

