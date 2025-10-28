import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import mongoose from 'mongoose';

const port = process.env.PORT;
const mongo = process.env.MONGO_URI;

mongoose.connect(mongo!).then(() => {
  console.log('Mongo connected');
  app.listen(port, () => console.log('Server running'));
}).catch(err => {
  console.error('Mongo connection error', err);
  process.exit(1);
});
