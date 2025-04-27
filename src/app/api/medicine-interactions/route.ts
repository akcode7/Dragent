import { NextRequest, NextResponse } from "next/server";
import { checkMedicineInteractions } from "@/lib/api/groq";

export async function POST(request: NextRequest) {
  try {
    const { medicineNames } = await request.json();
    
    if (!Array.isArray(medicineNames) || medicineNames.length < 2) {
      return NextResponse.json(
        { error: "Please provide at least two medicine names" },
        { status: 400 }
      );
    }

    const interactionResult = await checkMedicineInteractions(medicineNames);
    return NextResponse.json(interactionResult);
  } catch (error) {
    console.error("Error checking medicine interactions:", error);
    return NextResponse.json(
      { error: "Failed to check medicine interactions" },
      { status: 500 }
    );
  }
}