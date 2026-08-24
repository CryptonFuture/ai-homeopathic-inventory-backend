import express from "express";

import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  checkMedicineWithAI
} from "../controllers/medicineController.js";


const router = express.Router();


router.get(
  "/",
  getMedicines
);

router.post(
  "/",
  addMedicine
);

router.put(
  "/:id",
  updateMedicine
);

router.delete(
  "/:id",
  deleteMedicine
);


router.post(
  "/check-ai",
  checkMedicineWithAI
);


export default router;