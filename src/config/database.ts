import mongoose, { type ConnectOptions } from 'mongoose';

interface MongooseOptions extends ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

const connectToDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI ?? '';
    const options: MongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(uri, options);
    console.log('Connected to MongoDB!');
  } catch (error: unknown) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export default connectToDatabase;
