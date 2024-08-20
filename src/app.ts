import express, {Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandelar';
import notFound from './middlewares/notFound';
import { AuthRoutes } from './modules/auth/auth.route';


const app: Application = express();

app.use(express.json());
app.use(cors());


app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use("/api/auth", AuthRoutes);
app.use(globalErrorHandler);

//Not Found
app.use(notFound);


export default app;