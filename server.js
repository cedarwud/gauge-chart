// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server: SocketIOServer } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let io = null;

app.prepare().then(() => {
  // Create an HTTP server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    if (req.method === "POST" && parsedUrl.pathname === "/api/data") {
      console.log(123);
      // Handle POST request to /api/data
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        try {
          const reqBody = JSON.parse(body);

          // Initialize data structures
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

          // Process the data
          for (const data of reqBody.data) {
            if (data.channel === 0) {
              if (data.type === "BATTERY_VOLTAGE")
                radarData.voltage = data.value;
              if (data.type === "ELECTRIC_CURRENT")
                radarData.current = data.value;
              if (data.type === "ELECTRICAL_CONSUMPTION")
                radarData.power = data.value;
            } else if (data.channel === 1) {
              if (data.type === "BATTERY_VOLTAGE")
                usrpData.voltage = data.value;
              if (data.type === "ELECTRIC_CURRENT")
                usrpData.current = data.value;
              if (data.type === "ELECTRICAL_CONSUMPTION")
                usrpData.power = data.value;
            } else if (data.channel === 2) {
              radarData.accumulatedPower += radarData.power;
            } else if (data.channel === 3) {
              usrpData.accumulatedPower += usrpData.power;
            } else {
              totalPower +=
                radarData.accumulatedPower + usrpData.accumulatedPower;
            }
          }

          const responseData = {
            radarData,
            usrpData,
            totalPower,
          };

          // Emit the processed data via Socket.IO
          if (io) {
            io.emit("newData", responseData);
          }

          // Send HTTP response
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Data sent successfully",
              data: responseData,
            })
          );
        } catch (error) {
          console.error("Error processing data:", error);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to process data" }));
        }
      });
    } else {
      // Handle all other requests with Next.js
      handle(req, res, parsedUrl);
    }
  });

  // Initialize Socket.IO server
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Update this with the correct origin for CORS handling
      methods: ["GET", "POST"],
    },
  });

  // Handle Socket.IO connections
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Start the server on the specified port
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
