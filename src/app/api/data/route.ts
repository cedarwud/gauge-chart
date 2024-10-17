// app/api/data/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
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
    for (const data of reqBody) {
      if (data.channel === 0) {
        if (data.type === "BATTERY_VOLTAGE") radarData.voltage = data.voltage;
        if (data.type === "ELECTRIC_CURRENT") radarData.current = data.current;
        if (data.type === "ELECTRICAL_CONSUMPTION")
          radarData.power = data.power;
      } else if (data.channel === 1) {
        if (data.type === "BATTERY_VOLTAGE") usrpData.voltage = data.voltage;
        if (data.type === "ELECTRIC_CURRENT") usrpData.current = data.current;
        if (data.type === "ELECTRICAL_CONSUMPTION") usrpData.power = data.power;
      } else {
        if (data.channel === 2) {
          radarData.accumulatedPower += radarData.power;
        } else if (data.channel === 3) {
          usrpData.accumulatedPower += usrpData.power;
        } else {
          totalPower = radarData.accumulatedPower + usrpData.accumulatedPower;
        }
      }
    }

    const data = {
      radarData,
      usrpData,
      totalPower,
    };

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}
