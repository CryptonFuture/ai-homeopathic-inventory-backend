import axios from "axios";

export const analyzeMedicineWithAI = async (
  medicine,
  medicines
) => {
  try {
    const response = await axios.post(
      `${process.env.PYTHON_AI_URL}/analyze-medicine`,
      {
        medicine,
        medicines: medicines.map((item) => ({
          id: item._id.toString(),
          name: item.name,
          potency: item.potency,
          quantity: item.quantity
        }))
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Python AI Error:",
      error.response?.data || error.message
    );

    throw new Error(
      "AI service is currently unavailable"
    );
  }
};