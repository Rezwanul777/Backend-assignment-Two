

import { z } from 'zod';

const createBookingValidationSchema = z.object({
    body: z.object({
        facility: z.string(),
       
        date: z.string({}).refine((val) => !isNaN(Date.parse(val)), {
            message: 'Invalid date format',
        }),
        startTime: z.string({
            
        }).refine((val) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(val), {
            message: 'Invalid start time format (expected HH:mm)',
        }),
        endTime: z.string({
            required_error: 'End time is required',
        }).refine((val) => /^([01]\d|2[0-3]):?([0-5]\d)$/.test(val), {
            message: 'Invalid end time format (expected HH:mm)',
        }),
    })
});

export const BookingValidationSchema = {
    createBookingValidationSchema,
};
