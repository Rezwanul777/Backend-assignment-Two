import { Schema, model } from 'mongoose';
import { TFacility } from './facility.intecrface';


const facilitySchema = new Schema<TFacility>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    location: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }, // Default to false, indicating the facility is not deleted
}, {
    timestamps: true 
});

export const Facility = model<TFacility>('Facility', facilitySchema);


