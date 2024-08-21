import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FacilityServices } from "./facilty.services";

const createFacility = catchAsync(async (req, res) => {
    const facilityData = req.body;
    const result = await FacilityServices.createFacilityIntoDB(facilityData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Facility added successfully',
        data: result,
    });
});

const updateFacility = catchAsync(async (req, res) => {
    const facilityId = req.params.id;
    const facilityData = req.body;
    const result = await FacilityServices.updateFacilityInDB(facilityId, facilityData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Facility updated successfully',
        data: result,
    });
});

const deleteFacility = catchAsync(async (req, res) => {
    const facilityId = req.params.id;
    const result = await FacilityServices.deleteFacilityInDB(facilityId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Facility deleted successfully',
        data: result,
    });
});

// Get all facilities controller
const getAllFacilities = catchAsync(async (req, res) => {
    const facilities = await FacilityServices.getAllFacilitiesFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Facilities retrieved successfully',
        data: facilities,
    });
});





export const FacilityController={
    createFacility,
    updateFacility,
    deleteFacility,
    getAllFacilities
    
}