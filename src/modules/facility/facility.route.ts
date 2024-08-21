import express from "express";
import { auth } from "../../middlewares/auth";
import { USER_Role } from "../users/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { FaciltyValidationSchema } from "./facility.validation";
import { FacilityController } from "./facility.controller";


const router = express.Router();

router.post(
    '/',
    auth(USER_Role.admin),
    validateRequest(FaciltyValidationSchema.createFacilityValidationSchema),
    FacilityController.createFacility
   
  );

  // Update an existing facility (Admin only)
router.put(
    '/:id',
    auth(USER_Role.admin),
    validateRequest(FaciltyValidationSchema.updateFacilityValidationSchema),
    FacilityController.updateFacility
);

// Soft delete a facility (Admin only)
router.delete(
    '/:id',
    auth(USER_Role.admin),
    FacilityController.deleteFacility
);

// Get all facilities
router.get(
    '/',
    FacilityController.getAllFacilities
);

  
export const FaciltyRoutes = router;


