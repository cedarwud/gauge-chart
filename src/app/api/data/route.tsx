// src/app/api/data/route.tsx
import { NextResponse } from "next/server";
import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Keep a reference to the Socket.IO server instance
let io: SocketIOServer | null = null;

export async function POST(req: Request) {
  if (!io) {
    // Create a simple HTTP server to run Socket.IO
    const httpServer = new HttpServer();

    // Initialize Socket.IO server
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*", // Update this with the correct origin for CORS handling
        methods: ["GET", "POST"],
      },
    });

    // Start listening on port 3001 (separate from Next.js server)
    httpServer.listen(3001, () => {
      console.log("Socket.IO server running on port 3001");
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }

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

    const responseData = {
      radarData,
      usrpData,
      totalPower,
    };

    // Emit the processed data via Socket.IO to all connected clients
    io.emit("newData", responseData);

    // Return the response
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
