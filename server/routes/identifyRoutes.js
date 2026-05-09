import express from "express";
import multer from "multer";
import { identifySpecies } from "../controllers/identifyController.js";

const router = express.Router();

// Dùng memoryStorage vì chỉ cần forward buffer sang AI service
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), identifySpecies);

export default router;
