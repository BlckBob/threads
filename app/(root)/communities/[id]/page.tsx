import { currentUser } from '@clerk/nextjs'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser()
  if (!user) return null

  return (
    <section>
      
    </section>
  )
}
