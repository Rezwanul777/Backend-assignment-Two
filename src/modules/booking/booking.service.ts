import AppError from '../../errors/AppError';

import { TBooking } from './booking.interface';
import { Booking } from './booking.model';
import { startOfDay, endOfDay } from 'date-fns';
import httpStatus from 'http-status';


const createBookingInDB = async (payload: TBooking): Promise<TBooking> => {
    // Check for conflicts
    const timeConflict = await Booking.findOne({
        facility: payload.facility,
        date: payload.date,
        isBooked: 'confirmed',
        $or: [
            
                // Case 1: The requested start time 
                {
                    startTime: { $lt: payload.endTime },
                    endTime: { $gt: payload.startTime },
                },
                // Case 2: The requested end time 
                {
                    startTime: { $lt: payload.endTime },
                    endTime: { $gt: payload.startTime },
                },
                // Case 3: The requested time if existing booking
                {
                    startTime: { $gte: payload.startTime },
                    endTime: { $lte: payload.endTime },
                },
            
        ],
    });

    if (timeConflict) {
        throw new AppError(httpStatus.CONFLICT, 'Time slot is already booked');
    }

    const newBooking = await Booking.create(payload);
    return newBooking;
};


const checkAvailability = async (date: Date): Promise<{ startTime: string, endTime: string }[]> => {
    const bookings = await Booking.find({
        date: { $gte: startOfDay(date), $lte: endOfDay(date) },
        isBooked: 'confirmed',
    }).sort('startTime');

    const availableSlots: { startTime: string, endTime: string }[] = [];

    const startOfDayTime = startOfDay(date).setHours(0, 0, 0, 0);
    const endOfDayTime = endOfDay(date).setHours(23, 59, 59, 999);

    let lastEndTime = startOfDayTime;

    for (const booking of bookings) {
        if (booking.startTime.getTime() > lastEndTime) {
            availableSlots.push({
                startTime: new Date(lastEndTime).toISOString().substr(11, 5),
                endTime: new Date(booking.startTime).toISOString().substr(11, 5),
            });
        }
        lastEndTime = booking.endTime.getTime();
    }

    if (lastEndTime < endOfDayTime) {
        availableSlots.push({
            startTime: new Date(lastEndTime).toISOString().substr(11, 5),
            endTime: new Date(endOfDayTime).toISOString().substr(11, 5),
        });
    }

    return availableSlots;
};



const getAllBookingsFromDB = async (): Promise<TBooking[]> => {
    return await Booking.find().populate('facility').populate('user');
};

const getBookingsByUserFromDB = async (userId: string): Promise<TBooking[]> => {
    return await Booking.find({ user: userId }).populate('facility');
};

const cancelBookingInDB = async (id: string, userId: string): Promise<TBooking | null> => {
    const booking = await Booking.findById(id);

    if (!booking) {
        throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.user.toString() !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to cancel this booking');
    }

    booking.isBooked = 'canceled';
    await booking.save();

    return booking;
};

export const BookingServices = {
    createBookingInDB,
    checkAvailability,
    getAllBookingsFromDB,
    getBookingsByUserFromDB,
    cancelBookingInDB,
};
