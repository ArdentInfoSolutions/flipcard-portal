import WebItemFeed from "@/components/WebItemFeed"

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-4">Website Feed</h1>
      <WebItemFeed />
    </main>
  )
}