import express from 'express';
import { BookingController } from './booking.controller';
import { auth } from '../../middlewares/auth';
import { USER_Role } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidationSchema } from './booking.validation';

const router = express.Router();




// Create a booking (User only)
router.post(
    '/',
    auth(USER_Role.user),
    validateRequest(BookingValidationSchema.createBookingValidationSchema),
    BookingController.createBooking
);

// Get all bookings (Admin only)
router.get(
    '/',
    auth(USER_Role.admin),
    BookingController.getAllBookings
);

// Get bookings by user (User only)
router.get(
    '/user',
    auth(USER_Role.user),
    BookingController.getBookingsByUser
);

// Cancel a booking (User only)
router.delete(
    '/:id',
    auth(USER_Role.user),
    BookingController.cancelBooking
);

export const BookingRoutes = router;
