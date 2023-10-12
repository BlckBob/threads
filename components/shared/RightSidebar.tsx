import { currentUser } from '@clerk/nextjs'
import { fetchUsers } from '@/lib/actions/user.actions'

export default async function RightSidebar() {
  const user = await currentUser()
  if (!user) return null

  const similarMinds = await fetchUsers({
    userId: user.id,
    pageSize: 4,
  })

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>
          Suggested Communities
        </h3>
      </div>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
      </div>
    </section>
  )
}
