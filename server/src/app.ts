import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {Client} from 'pg';
import {categoriesRouter} from './routes/categories';
import {transactionsRouter} from './routes/transactions';

dotenv.config();
const app = express();

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@database:5432/household_budget'
})

app.use(express.json());
app.use(cors());

app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);

const connectDB = async () => {
  try {
    await client.connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the Household Budget App API');
}); 

export {client, app};