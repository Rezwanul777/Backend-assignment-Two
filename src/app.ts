import express, {Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandelar';
import notFound from './middlewares/notFound';
import { AuthRoutes } from './modules/auth/auth.route';
import { FaciltyRoutes } from './modules/facility/facility.route';
import { BookingRoutes } from './modules/booking/booking.routes';
import { BookingController } from './modules/booking/booking.controller';


const app: Application = express();

app.use(express.json());
app.use(cors());


app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use("/api/auth", AuthRoutes);
app.use("/api/facility", FaciltyRoutes);
app.use("/api/bookings", BookingRoutes);

// Register the check-availability route directly at the /api level
app.get("/api/check-availability", BookingController.checkAvailability);

// Error Handling middleware
app.use(globalErrorHandler);

//Not Found
app.use(notFound);


export default app;