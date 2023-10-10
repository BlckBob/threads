'use server'

import { revalidatePath } from 'next/cache'
import { connectToDB } from '../mongoose'

import User from '../models/user.model'
import Thread from '../models/thread.model'
import Community from '../models/community.model'

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB()

  // Calculate the number of posts to skip from the page number and page size.
  const skipAmount = pageSize * (pageNumber - 1)

  // Create a query to fetch the posts that have no parent (top-level threads)
  const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: 'author',
      model: User,
    })
    .populate({
      path: 'children',
      populate: {
        path: 'author',
        model: User,
        select: '_id name parentId image',
      },
    })

  // Count the total number of top-level posts (threads)
  const totalPostsCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  })
  const posts = await postQuery.exec()
  const isNext = totalPostsCount > skipAmount + posts.length

  return { posts, isNext }
}

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}
export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params): Promise<void> {
  connectToDB()

  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    })

    // Update user model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id/*  as string  */},
    })

    revalidatePath(path)
  } catch (error) {
    let errMsg = 'Unknown error'
    if (error instanceof Error) {
      errMsg = error.message
    }
    throw new Error(`Failed to create thread: ${errMsg}`)
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB()

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      }) // Pop the author field with _id and username
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image',
      }) // Pop the community field with _id and name
      .populate({
        path: 'children', // Pop the children field
        populate: [
          {
            path: 'author', // Pop the author field within children
            model: User,
            select: '_id id name parentId image', // Select only _id and username fields of the author
          },
          {
            path: 'children', // Pop the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: 'author', // Pop the author field within nested children
              model: User,
              select: '_id id name parentId image', // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec()

    return thread
  } catch (err) {
    let errMsg = 'Unknown error'
    if (err instanceof Error) {
      errMsg = err.message
    }
    throw new Error(`Failed to fetch thread: ${errMsg}`)
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    let errMsg = 'Unknown error'
    if (err instanceof Error) {
      errMsg = err.message
    }
    throw new Error(`Failed to fetch thread: ${errMsg}`)
  }
}
