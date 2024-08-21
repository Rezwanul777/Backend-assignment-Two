import httpStatus from "http-status";
import config from "../../config";
import { TUser } from "../users/user.interface";
import { TFacility } from "./facility.intecrface";
import AppError from "../../errors/AppError";
import { Facility } from "./facility.model";


const createFacilityIntoDB = async (payload: TFacility): Promise<TFacility> => {
    const newFacility = await Facility.create(payload);

    if (!newFacility) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create facility');
    }

    return newFacility;
};

const updateFacilityInDB = async (id: string, payload: Partial<TFacility>): Promise<TFacility | null> => {
    const updatedFacility = await Facility.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    if (!updatedFacility) {
        throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    return updatedFacility;
};

const deleteFacilityInDB = async (id: string): Promise<TFacility | null> => {
    const deletedFacility = await Facility.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
        runValidators: true,
    });

    if (!deletedFacility) {
        throw new AppError(httpStatus.NOT_FOUND, 'Facility not found');
    }

    return deletedFacility;
};

// Get all facilities
const getAllFacilitiesFromDB = async (): Promise<TFacility[]> => {
    const facilities = await Facility.find({ isDeleted: false });
    return facilities;
};

export const FacilityServices={
    createFacilityIntoDB,
    updateFacilityInDB,
    deleteFacilityInDB,
    getAllFacilitiesFromDB
    
}