import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.js';
import morgan from 'morgan';
import logRouter from './routes/log.js';
import FinancialRecordRouter from './routes/financialRecordRoutes.js';
import chartRoutes from "./routes/chartRoutes.js";
import authRouter from './routes/auth.js';
import cashflowRouter from './routes/cashflow.js';

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use("/files", express.static("files"));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization'
  );
  next();
});
app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));
// app.use('/api/financial-records',FinancialRecordRouter)
app.use("/api/charts", chartRoutes);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/api/logs', logRouter);
app.use('/api/cashflow', cashflowRouter);




app.get('/live', (req, res) => res.json({ message: 'Message from server' }));

app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Not Found' })
);

const startServer = async () => {
  try {
    console.log('Mongo DB conn. string...', process.env.MONGO_CONNECT);
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_CONNECT).then(() => console.log("db connected"));
    app
      .listen(port, () => console.log(`Server is listening on port: ${port}`))
      .on('error', (e) => {
        console.log('Error happened check: ', e.message);
      });
  } catch (error) {
    console.log(error);
  }
};


startServer();
