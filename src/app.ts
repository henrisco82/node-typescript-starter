import express, { type Application } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './config/database';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

connectToDatabase();

const app: Application = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(9000, () => {
  console.log('Server started on port 9000');
});
