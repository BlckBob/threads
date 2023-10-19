import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const userData = {
    id: user.id,
    objectId: userInfo?._id as string,
    username: userInfo
      ? (userInfo?.username as string)
      : (user.username as string),
    name: userInfo ? (userInfo?.name as string) : user.firstName || '',
    bio: userInfo ? (userInfo?.bio as string) : '',
    image: userInfo ? (userInfo?.image as string) : (user.imageUrl as string),
  };

  return (
    <>
      <h1 className='head-text'>Edit Profile</h1>
      <p className='mt-3 text-base-regular text-light-2'>Make any changes</p>

      <section className='mt-12'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </>
  );
}
