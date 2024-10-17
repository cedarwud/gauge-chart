"use client";

import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import GaugeChart from "react-gauge-chart";
import { debounce } from "lodash";
import "../assets/css/dashboard.css";

// Images for the devices
import awr1642Image from "../assets/images/radar.jpg"; // Add the image to your public folder or use a CDN
import usrpB210Image from "../assets/images/usrp.jpg"; // Add the image to your public folder or use a CDN

interface DeviceData {
  voltage: number;
  current: number;
  power: number;
  accumulatedPower: number;
}

const Dashboard: React.FC = () => {
  const [maxRadarVoltage, setMaxRadarVoltage] = useState(15);
  const [maxRadarCurrent, setMaxRadarCurrent] = useState(1000);
  const [maxRadarPower, setMaxRadarPower] = useState(10000);
  const [maxUsrpVoltage, setMaxUsrpVoltage] = useState(15);
  const [maxUsrpCurrent, setMaxUsrpCurrent] = useState(1000);
  const [maxUsrpPower, setMaxUsrpPower] = useState(10000);
  const [maxRadarAccPower, setMaxRadarAccPower] = useState(100);
  const [maxUsrpAccPower, setMaxUsrpAccPower] = useState(100);
  const [maxTotalAccPower, setMaxTotalAccPower] = useState(100);

  const [radarData, setRadarData] = useState<DeviceData>({
    voltage: 0,
    current: 0,
    power: 0,
    accumulatedPower: 0,
  });

  const [usrpData, setUsrpData] = useState<DeviceData>({
    voltage: 0,
    current: 0,
    power: 0,
    accumulatedPower: 0,
  });

  const [radarAccPower, setRadarAccPower] = useState<number>(0);
  const [usrpAccPower, setUsrpAccPower] = useState<number>(0);
  const [totalPower, setTotalPower] = useState<number>(0);

  useEffect(() => {
    const socket: Socket = io("https://gauge-chart-psi.vercel.app");
    socket.on("newData", (data) => {
      setRadarData(data.radarData);
      setUsrpData(data.usrpData);
      setTotalPower(data.totalPower);
    });

    const handleNewData = debounce((data) => {
      setRadarData(data.radarData);
      setUsrpData(data.usrpData);
      setRadarAccPower((prevData) => prevData + data.radarData.power);
      setUsrpAccPower((prevData) => prevData + data.usrpData.power);
      setTotalPower((prevData) => prevData + data.totalPower);

      setMaxRadarVoltage((prevData) => {
        if (data.radarData.voltage > prevData) {
          return data.radarData.voltage;
        }
        return prevData;
      });
      setMaxRadarCurrent((prevData) => {
        if (data.radarData.current > prevData) {
          return data.radarData.current;
        }
        return prevData;
      });
      setMaxRadarPower((prevData) => {
        if (data.radarData.power > prevData) {
          return data.radarData.power;
        }
        return prevData;
      });
      setMaxUsrpVoltage((prevData) => {
        if (data.usrpData.voltage > prevData) {
          return data.usrpData.voltage;
        }
        return prevData;
      });
      setMaxUsrpCurrent((prevData) => {
        if (data.usrpData.current > prevData) {
          return data.usrpData.current;
        }
        return prevData;
      });
      setMaxUsrpPower((prevData) => {
        if (data.usrpData.power > prevData) {
          return data.usrpData.power;
        }
        return prevData;
      });
      setMaxRadarAccPower((prevData) => {
        if (radarAccPower > prevData) {
          return radarAccPower;
        }
        return prevData;
      });
      setMaxUsrpAccPower((prevData) => {
        if (usrpAccPower > prevData) {
          return usrpAccPower;
        }
        return prevData;
      });
      setMaxTotalAccPower((prevData) => {
        if (totalPower > prevData) {
          return totalPower;
        }
        return prevData;
      });
    }, 1000); // Update every 3000ms

    socket.on("newData", handleNewData);

    return () => {
      socket.off("newData"); // Remove the event listener
      socket.disconnect(); // Disconnect the socket
    };
  }, []);

  // Dummy data update for illustration
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newDevice1 = {
  //       voltage: Math.random() * 6,
  //       current: Math.random() * 3,
  //       power: Math.random() * 1000,
  //       accumulatedPower: radarData.accumulatedPower + Math.random(),
  //     };

  //     const newDevice2 = {
  //       voltage: Math.random() * 6,
  //       current: Math.random() * 3,
  //       power: Math.random() * 1000,
  //       accumulatedPower: usrpData.accumulatedPower + Math.random(),
  //     };

  //     setRadarData(newDevice1);
  //     setUsrpData(newDevice2);
  //     setTotalPower(newDevice1.accumulatedPower + newDevice2.accumulatedPower);
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [radarData, usrpData]);

  return (
    <div className="dashboard-container">
      <h1>Base Station Dashboard</h1>
      <div className="device-section">
        <div>
          <p>AWR1642BOOST-ODS</p>
          <img
            src={awr1642Image.src}
            alt="AWR1642BOOST-ODS"
            className="device-image"
          />
        </div>
        <div>
          <p>USRP B210</p>
          <img
            src={usrpB210Image.src}
            alt="USRP B210"
            className="device-image"
          />
        </div>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h2>
            <i className="fas fa-bolt"></i> Radar Voltage
          </h2>
          <GaugeChart
            id="radarData-voltage"
            nrOfLevels={50}
            arcsLength={[0.2, 0.3, 0.5]} // Split into segments as needed
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green, Yellow, Red
            percent={radarData.voltage / maxRadarVoltage} // Still using a percentage for fill
            formatTextValue={() => `${radarData.voltage.toFixed(2)} V`} // Show real value as text
            textColor="#000000"
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-wave-square"></i> Radar Current
          </h2>
          <GaugeChart
            id="radarData-current"
            nrOfLevels={50}
            arcsLength={[0.2, 0.4, 0.4]} // Adjust arcs to represent safe, moderate, and high current ranges
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for mid, Red for high
            percent={radarData.current / maxRadarCurrent} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${radarData.current.toFixed(2)} mA`} // Display the actual current value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-plug"></i> Radar Power Consumption
          </h2>
          <GaugeChart
            id="radarData-power"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={radarData.power / maxRadarPower} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${radarData.power.toFixed(2)} mW`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-bolt"></i> USRP Voltage
          </h2>
          <GaugeChart
            id="usrpData-voltage"
            nrOfLevels={50}
            arcsLength={[0.2, 0.3, 0.5]} // Split into segments as needed
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green, Yellow, Red
            percent={usrpData.voltage / maxUsrpVoltage} // Still using a percentage for fill
            formatTextValue={() => `${usrpData.voltage.toFixed(2)} V`} // Show real value as text
            textColor="#000000"
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-wave-square"></i> USRP Current
          </h2>
          <GaugeChart
            id="usrpData-current"
            nrOfLevels={50}
            arcsLength={[0.2, 0.4, 0.4]} // Adjust arcs to represent safe, moderate, and high current ranges
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for mid, Red for high
            percent={usrpData.current / maxUsrpCurrent} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${usrpData.current.toFixed(2)} mA`} // Display the actual current value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-plug"></i> USRP Power Consumption
          </h2>
          <GaugeChart
            id="usrpData-power"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={usrpData.power / maxUsrpPower} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${usrpData.power.toFixed(2)} mW`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-battery-full"></i> Radar Accumulated Power
          </h2>
          <GaugeChart
            id="radarData-accumulated"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={radarAccPower / 1000 / maxRadarAccPower} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${(radarAccPower / 1000).toFixed(2)} W`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-battery-full"></i> USRP Accumulated Power
          </h2>
          <GaugeChart
            id="usrpData-accumulated"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={usrpAccPower / 1000 / maxUsrpAccPower} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${(usrpAccPower / 1000).toFixed(2)} W`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
            animate={false}
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-plug"></i> Total Power Consumption
          </h2>
          <GaugeChart
            id="total-power"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={totalPower / 1000 / maxTotalAccPower} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${(totalPower / 1000).toFixed(2)} W`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
            animate={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
