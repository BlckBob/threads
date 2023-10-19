import mongoose from 'mongoose';

let isConnected: boolean = false; // mongoose DB connection status

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL)
    return console.log('=> no MONGODB_URL provided');
  if (isConnected) return console.log('=> using existing MongoDB connection');

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true;

    console.log('=> connected to MongoDB');
  } catch (error: any) {
    const errMsg: string =
      error instanceof Error ? error.message : String(error) || 'Unknown error';
    console.log(`=> error connecting to MongoDB: ${errMsg}`);
  }
};
