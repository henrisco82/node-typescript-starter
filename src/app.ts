import express, { type Application } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import connectToDatabase from './config/database';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

connectToDatabase();

const app: Application = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://node-api-jlj0.onrender.com',
  'https://henry-proshop.onrender.com',
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(corsOptions));
app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'REST API for Swagger Documentation',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:9000/api/',
        description: 'Development server',
      },
      {
        url: 'https://node-api-jlj0.onrender.com/api/',
        description: 'Production server',
      },
    ],
  },
  apis: ['./specifications/*.yml'],
};

const specs = swaggerJSDoc(options);

const uiOptions = {
  explorer: true,
  customSiteTitle: 'Swagger UI',
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
    filter: true,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, uiOptions));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.use(notFound);
app.use(errorHandler);

app.listen(9000, () => {
  console.log('Server started on port 9000');
});

export default app;
