import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    potency: {
      type: String,
      default: ""
    },

    quantity: {
      type: Number,
      default: 0,
      min: 0
    },

    category: {
      type: String,
      default: "Homeopathic"
    }
  },
  {
    timestamps: true
  }
);

medicineSchema.index(
  {
    name: 1,
    potency: 1
  },
  {
    unique: true
  }
);

export default mongoose.model(
  "Medicine",
  medicineSchema
);