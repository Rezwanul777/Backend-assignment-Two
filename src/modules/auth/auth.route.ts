import express from "express";
import { authControllers } from "./auth.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/signup", authControllers.register);
router.post("/login",validateRequest(AuthValidation.loginValidationSchema), authControllers.login);

export const AuthRoutes = router;