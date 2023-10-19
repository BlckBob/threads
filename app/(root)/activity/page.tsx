import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import { fetchActivity, fetchUser } from '@/lib/actions/user.actions'

export default async function Page() {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const activities = await fetchActivity(userInfo._id)

  return (
    <>
      <h1 className='head-text'>Activity</h1>
      <section className='flex flex-col mt-10 gap-5'>
        {activities?.length === 0 ? (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        ) : (
          <>
            {activities.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className='activity-card'>
                  <Image
                    src={activity.author.image}
                    alt='User Logo'
                    width={20}
                    height={20}
                    className='rouded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='text-primary-500 mr-1'>
                      {activity.author.name}
                    </span>{' '}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        )}
      </section>
    </>
  )
}
