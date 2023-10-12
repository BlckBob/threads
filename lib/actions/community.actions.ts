'use server'

import { connectToDB } from '../mongoose'
import Community from '../models/community.model'
import Thread from '../models/thread.model'
import User from '../models/user.model'
import { AnyNsRecord } from 'dns'

export async function fetchCommunityPosts(id: string) {
  connectToDB()

  try {
    const communityPosts = await Community.findById(id).populate({
      path: 'threads',
      model: Thread,
      populate: [
        {
          path: 'author',
          model: User,
          select: 'name image id', // Select the "name" and "_id" fields from the "User" model
        },
        {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'image _id', // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    })

    return communityPosts
  } catch (error: any) {
    const errMsg: string =
      error instanceof Error ? error.message : String(error) || 'Unknown error'
    throw new Error(`Error fetching community posts: ${errMsg}`)
  }
}
