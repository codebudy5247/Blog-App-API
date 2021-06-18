import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './Data/User.js'
import posts from './Data/Post.js'
import User from './models/userModel.js'
import Post from './models/blogModel.js'

import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    
    await Post.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const user1 = createdUsers[0]._id
    
    const samplePosts = posts.map((post) => {
      return { ...post, user: user1 }
    })

    await Post.insertMany(samplePosts)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
   
    await Post.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
