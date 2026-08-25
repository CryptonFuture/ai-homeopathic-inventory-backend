from fastapi import FastAPI
from pydantic import BaseModel

from rapidfuzz import process, fuzz

import re


app = FastAPI(
    title="AI Homeopathic Medicine Service"
)


class MedicineItem(BaseModel):
    id: str
    name: str
    potency: str = ""
    quantity: int = 0


class MedicineRequest(BaseModel):
    medicine: str
    medicines: list[MedicineItem]


def normalize_text(text: str):
    text = text.lower()

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


@app.get("/")
def home():
    return {
        "message": "Python AI Medicine Service Running"
    }


@app.post("/analyze-medicine")
def analyze_medicine(data: MedicineRequest):

    # Check medicines list
    if not data.medicines:
        return {
            "found": False,
            "medicine_id": None,
            "matched_medicine": None,
            "confidence": 0
        }

    # Normalize user query
    query = normalize_text(data.medicine)

    medicine_map = {}
    choices = []

    # Prepare medicine list
    for item in data.medicines:

        full_name = (
            f"{item.name} {item.potency}"
        ).strip()

        normalized = normalize_text(full_name)

        choices.append(normalized)

        medicine_map[normalized] = item

    # Fuzzy matching
    result = process.extractOne(
        query,
        choices,
        scorer=fuzz.token_set_ratio
    )

    # No match found
    if not result:
        return {
            "found": False,
            "medicine_id": None,
            "matched_medicine": None,
            "confidence": 0
        }

    match, score, index = result

    # AI confidence threshold
    MIN_CONFIDENCE = 65

    # Confidence too low
    if score < MIN_CONFIDENCE:
        return {
            "found": False,
            "medicine_id": None,
            "matched_medicine": None,
            "confidence": round(score, 2)
        }

    # Get matched medicine
    medicine = medicine_map[match]

    return {
        "found": True,
        "medicine_id": medicine.id,
        "matched_medicine": (
            f"{medicine.name} {medicine.potency}"
        ).strip(),
        "confidence": round(score, 2)
    }