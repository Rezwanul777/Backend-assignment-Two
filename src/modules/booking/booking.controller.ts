import { Request, Response } from 'express';

import { parseISO, setHours, setMinutes } from 'date-fns';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { BookingServices } from './booking.service';

import { Facility } from '../facility/facility.model';
import AppError from '../../errors/AppError';

// const createBooking = catchAsync(async (req: Request, res: Response) => {
//     if (!req.user) {
//         throw new Error('User not authenticated');
//     }

//     const bookingData = {
//         ...req.body,
//         user: req.user._id
//     };

//     const result = await BookingServices.createBookingInDB(bookingData);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Booking created successfully',
//         data: result,
//     });
// });

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const { facility, date, startTime, endTime } = req.body;

    // Parse the date from the string
    const bookingDate = parseISO(date);

    // Parse the startTime and endTime from the string and combine them with the bookingDate
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const bookingStartTime = setMinutes(setHours(bookingDate, startHours), startMinutes);
    const bookingEndTime = setMinutes(setHours(bookingDate, endHours), endMinutes);

    // Fetch the facility to get the pricePerHour
    const facilityDetails = await Facility.findById(facility);
    if (!facilityDetails) {
        throw new AppError(404, 'Facility not found');
    }

    // Calculate the payableAmount
    const hours = (bookingEndTime.getTime() - bookingStartTime.getTime()) / 36e5;
    const payableAmount = hours * facilityDetails.pricePerHour;

    const bookingData = {
        facility,
        date: bookingDate,
        startTime: bookingStartTime,
        endTime: bookingEndTime,
        payableAmount,
        user: req.user._id, // Assuming the user is attached to the request
        isBooked: 'confirmed'
    };

    const result = await BookingServices.createBookingInDB(bookingData);
    sendResponse(res, {
        
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});

const checkAvailability = catchAsync(async (req: Request, res: Response) => {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const availableSlots = await BookingServices.checkAvailability(date);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Availability checked successfully',
        data: availableSlots,
    });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const bookings = await BookingServices.getAllBookingsFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        data: bookings,
    });
});

const getBookingsByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user._id; // Assuming the user is attached to the request
    const bookings = await BookingServices.getBookingsByUserFromDB(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Bookings retrieved successfully',
        data: bookings,
    });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const userId = req.user._id; // Assuming the user is attached to the request
    const result = await BookingServices.cancelBookingInDB(bookingId, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking cancelled successfully',
        data: result,
    });
});

export const BookingController = {
    createBooking,
    getAllBookings,
    getBookingsByUser,
    cancelBooking,
    checkAvailability
};
