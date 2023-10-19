import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import AccountProfile from '@/components/forms/AccountProfile';

async function page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect('/');

  const userData = {
    id: user.id,
    objectId: userInfo?._id/*  as string */,
    username: userInfo
      ? (userInfo?.username as string)
      : (user.username as string),
    name: userInfo ? (userInfo?.name as string) : user.firstName || '',
    bio: userInfo ? (userInfo?.bio as string) : '',
    image: userInfo ? (userInfo?.image as string) : (user.imageUrl as string),
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use Threads.
      </p>

      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  );
}

export default page;
