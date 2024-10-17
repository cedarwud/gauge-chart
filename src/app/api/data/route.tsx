// src/app/api/data/route.tsx
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const reqBody = await req.json();

    const radarData = {
      voltage: 0,
      current: 0,
      power: 0,
      accumulatedPower: 0,
    };

    const usrpData = {
      voltage: 0,
      current: 0,
      power: 0,
      accumulatedPower: 0,
    };

    let totalPower = 0;

    // Process incoming data
    for (const data of reqBody.data) {
      if (data.channel === 0) {
        if (data.type === "BATTERY_VOLTAGE") radarData.voltage = data.value;
        if (data.type === "ELECTRIC_CURRENT") radarData.current = data.value;
        if (data.type === "ELECTRICAL_CONSUMPTION")
          radarData.power = data.value;
      } else if (data.channel === 1) {
        if (data.type === "BATTERY_VOLTAGE") usrpData.voltage = data.value;
        if (data.type === "ELECTRIC_CURRENT") usrpData.current = data.value;
        if (data.type === "ELECTRICAL_CONSUMPTION") usrpData.power = data.value;
      } else if (data.channel === 2) {
        radarData.accumulatedPower += radarData.power;
      } else if (data.channel === 3) {
        usrpData.accumulatedPower += usrpData.power;
      } else {
        totalPower =
          totalPower + radarData.accumulatedPower + usrpData.accumulatedPower;
      }
    }

    // Instead of emitting via Socket.IO, you can log the data or respond with the processed data.
    // You can also consider sending this data to an external server (like a hosted Socket.IO server)

    return NextResponse.json({
      message: "Data processed successfully",
      data: { radarData, usrpData, totalPower },
    });
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}
