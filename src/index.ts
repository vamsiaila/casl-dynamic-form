import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import routes from './routes';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use('/api', routes);

const main = async () => {
  try {
    await mongoose.connect(process.env.DB_URL || '');
    console.info('database connected successfully');
    app.listen(PORT, () => console.info(`app listening on port ${PORT}`));
  } catch (error) {
    console.info('application failed to start');
    console.error(error);
  }
};

main().then();
