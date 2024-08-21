import { z } from 'zod';

 const createFacilityValidationSchema = z.object({
    body:z.object({
        name: z.string(),
        description: z.string(),
        pricePerHour: z.number().positive("Price per hour must be a positive number"),
        location: z.string(),
        isDeleted: z.boolean().optional(), 
    })
});

const updateFacilityValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(), 
        description: z.string().optional(),
        pricePerHour: z.number().positive("Price per hour must be a positive number").optional(), 
        location: z.string().optional(), 
        isDeleted: z.boolean().optional(), 
    })
});


export const FaciltyValidationSchema={
    createFacilityValidationSchema,
    updateFacilityValidationSchema
}
