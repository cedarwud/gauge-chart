// src/app/api/data/route.ts

import { NextResponse } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

// Initialize Socket.IO server
let io: SocketIOServer | null = null;

export async function POST(req: Request) {
  try {
    // Parse incoming data
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
      } else {
        if (data.channel === 2) {
          radarData.accumulatedPower += radarData.power;
        } else if (data.channel === 3) {
          usrpData.accumulatedPower += usrpData.power;
        } else {
          totalPower =
            totalPower + radarData.accumulatedPower + usrpData.accumulatedPower;
        }
      }
    }

    const responseData = {
      radarData,
      usrpData,
      totalPower,
    };

    // Emit the data via Socket.IO if connected
    if (io) {
      io.emit("newData", responseData);
    } else {
      console.warn("Socket.io is not initialized.");
    }

    return NextResponse.json({
      message: "Data sent successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Failed to process data" },
      { status: 500 }
    );
  }
}

// WebSocket (Socket.IO) setup - add this somewhere in your project, maybe _middleware.ts or similar
if (!io) {
  const httpServer = new HttpServer();
  io = new SocketIOServer(httpServer);

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Start the server on a different port for Socket.IO if needed
  httpServer.listen(3001, () => {
    console.log("Socket.IO server running on port 3001");
  });
}
