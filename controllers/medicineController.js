import Medicine from "../models/Medicine.js";

import {
  analyzeMedicineWithAI
} from "../services/aiService.js";


// ===============================
// GET ALL MEDICINES
// ===============================

export const getMedicines = async (
  req,
  res
) => {
  try {
    const medicines = await Medicine.find()
      .sort({
        name: 1
      });

    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// ADD MEDICINE
// ===============================

export const addMedicine = async (
  req,
  res
) => {
  try {
    const {
      name,
      potency,
      quantity,
      category
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Medicine name is required"
      });
    }

    const medicine =
      await Medicine.create({
        name,
        potency,
        quantity,
        category
      });

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "This medicine with same potency already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// UPDATE MEDICINE
// ===============================

export const updateMedicine = async (
  req,
  res
) => {
  try {

    const medicine =
      await Medicine.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      data: medicine
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// DELETE MEDICINE
// ===============================

export const deleteMedicine = async (
  req,
  res
) => {
  try {

    const medicine =
      await Medicine.findByIdAndDelete(
        req.params.id
      );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      message: "Medicine deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ===============================
// AI CHECK MEDICINE
// ===============================

export const checkMedicineWithAI = async (
  req,
  res
) => {
  try {

    const { medicine } = req.body;

    if (!medicine || !medicine.trim()) {
      return res.status(400).json({
        success: false,
        message: "Medicine name is required"
      });
    }

    const medicines =
      await Medicine.find();

    const aiResult =
      await analyzeMedicineWithAI(
        medicine,
        medicines
      );

    // AI could not find medicine

    if (!aiResult.found) {
      return res.json({
        success: true,

        searchedMedicine: medicine,

        matchedMedicine: null,

        status: "NOT_AVAILABLE",

        color: "red",

        quantity: 0,

        confidence:
          aiResult.confidence || 0,

        message:
          "Medicine is not available in inventory"
      });
    }


    // Find medicine from MongoDB

    const matchedMedicine =
      medicines.find(
        (item) =>
          item._id.toString() ===
          aiResult.medicine_id
      );


    // Medicine not found

    if (!matchedMedicine) {
      return res.json({
        success: true,

        searchedMedicine: medicine,

        status: "NOT_AVAILABLE",

        color: "red",

        quantity: 0,

        confidence:
          aiResult.confidence,

        message:
          "Medicine is not available"
      });
    }


    // Stock available

    const isAvailable =
      matchedMedicine.quantity > 0;


    return res.json({

      success: true,

      searchedMedicine: medicine,

      matchedMedicine:
        `${matchedMedicine.name} ${matchedMedicine.potency || ""}`,

      status:
        isAvailable
          ? "AVAILABLE"
          : "NOT_AVAILABLE",

      color:
        isAvailable
          ? "green"
          : "red",

      quantity:
        matchedMedicine.quantity,

      confidence:
        aiResult.confidence,

      message:
        isAvailable
          ? "Medicine is available in inventory"
          : "Medicine exists but is currently out of stock"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};