import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { fetchUser } from '@/lib/actions/user.actions'
import PostThread from '@/components/forms/PostThread'

export default async function page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  // console.log(userInfo._id, typeof userInfo._id)
  // console.log(userInfo._id as string)
  // console.log(userInfo._id.toString(), typeof userInfo._id.toString())
  // console.log(userInfo._id.valueOf(), typeof userInfo._id.valueOf())
  // console.log(JSON.parse(JSON.stringify(userInfo._id)), typeof JSON.parse(JSON.stringify(userInfo._id)))
  // console.log(JSON.stringify(userInfo._id), typeof JSON.stringify(userInfo._id))

  return (
    <>
      <h1 className='head-text'>Create Thread</h1>

      <PostThread userId={JSON.stringify(userInfo._id)} />
    </>
  )
}
