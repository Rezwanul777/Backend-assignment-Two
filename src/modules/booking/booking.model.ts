import { model, Schema } from "mongoose";
import { TBooking } from "./booking.interface";



const bookingSchema = new Schema<TBooking>({
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    facility: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
    payableAmount: { type: Number, required: true },
    isBooked: { type: String, enum: ['confirmed', 'unconfirmed', 'canceled'], default: 'unconfirmed' },
  }, {
    timestamps: true
  });
  
  // // Middleware to calculate 
  // bookingSchema.pre('save', async function(next) {
  //   const booking = this as TBooking;
  
  //   // Fetch the facility to get the pricePerHour
  //   const facility = await Facility.findById(booking.facility);
  //   if (facility) {
  //       const hours = (booking.endTime.getTime() - booking.startTime.getTime()) 
  //       booking.payableAmount = hours * facility.pricePerHour;
  //   }
  //   next();
  // });
  
  export const Booking = model<TBooking>('Booking', bookingSchema);