import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs'
import Searchbar from '@/components/shared/Searchbar'
import Pagination from '@/components/shared/Pagination'
// TODO: import CommunityCard from "@/components/cards/CommunityCard";
import { fetchUser } from '@/lib/actions/user.actions'
// TODO: import { fetchCommunities } from "@/lib/actions/community.actions";

export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const user = await currentUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <>
      <h1 className='head-texrt'>Communities</h1>

      <div className='mt-5'>
        <Searchbar routeType='communities' />
      </div>

      <section className='flex flex-wrap mt-9 gap-4'>
        {true ? <p className='no-result'>No Result</p> : <></>}
      </section>

      <Pagination
        path='communities'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={true /* result.isNext */}
      />
    </>
  )
}
