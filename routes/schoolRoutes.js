import { Router } from "express";
import { addSchool, listSchools } from "../controllers/schoolController.js";

const router = Router();

// Add a new school
router.post("/addSchool", addSchool);

// List all schools sorted by proximity
router.get("/listSchools", listSchools);

export default router;
