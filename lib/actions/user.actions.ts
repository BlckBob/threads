'use server'

import { revalidatePath } from 'next/cache'
import { connectToDB } from '../mongoose'
import User from '../models/user.model'
import Thread from '../models/thread.model'
import Community from '../models/community.model'
import mongoose, { FilterQuery, SortOrder } from 'mongoose'

interface Params {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> {
  connectToDB()

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    )

    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    const errMsg: string =
      error instanceof Error ? error.message : String(error) || 'Unknown error'
    throw new Error(`Failed to create/update user: ${errMsg}`)
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB()

    return await User.findOne({ id: userId })
    // .populate({
    //     path: 'communities',
    //     model: 'Community',
    // })
  } catch (error: any) {
    const errMsg: string =
      error instanceof Error ? error.message : String(error) || 'Unknown error';
    throw new Error(`Failed to fetch user: ${errMsg}`)
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB()

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: [
        {
          path: 'community',
          model: Community,
          select: 'name id image _id', // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id', // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    })
    return threads
  } catch (error: any) {
    const errMsg: string =
      error instanceof Error ? error.message : String(error) || 'Unknown error'
    throw new Error(`Failed to fetch threads by user: ${errMsg}`)
  }
}

// Almost similar to Thread (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}) {
  connectToDB()

  try {
    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i')

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    }

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.length > 0) {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext }
  } catch (error: any) {
    const errMsg: string =
      error instanceof Error ? error.message : String(error) || 'Unknown error'
    throw new Error(`Failed to fetch users: ${errMsg}`)
  }
}

interface IThreadMod {
  text: string
  author: mongoose.Types.ObjectId
  createdAt: Date
  children: mongoose.Types.ObjectId[]
  community?: mongoose.Types.ObjectId | undefined
  parentId?: string | undefined
}

export async function fetchActivity(userId: string) {
  connectToDB()

  try {
    // Find all threads created by the user
    const userThreads: IThreadMod[] = await Thread.find({ author: userId })

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds: mongoose.Types.ObjectId[] = []

    for (let i = 0; i < userThreads.length; i++) {
      const userThread = userThreads[i]
      childThreadIds.push(...userThread.children)
    }
    // const childThreadIds: mongoose.Types.ObjectId[] = (
    //   [] as mongoose.Types.ObjectId[]
    // ).concat(...userThreads.map((userThread) => userThread.children))
    // const childThreadIds: mongoose.Types.ObjectId[] = userThreads.reduce(
    //   (acc, userThread) => {
    //     return acc.concat(userThread.children)
    //   },
    //   [] as mongoose.Types.ObjectId[],
    // )

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id', // "name" and "_id" fields from the "User" model
    })

    return replies
  } catch (error: any) {
    const errMsg: string =
      error instanceof Error ? error.message : String(error) || 'Unknown error'
    throw new Error(`Failed to fetch replies: ${errMsg}`)
  }
}
