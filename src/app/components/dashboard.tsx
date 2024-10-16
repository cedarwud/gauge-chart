// app/Dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
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
  const [device1, setDevice1] = useState<DeviceData>({
    voltage: 0,
    current: 0,
    power: 0,
    accumulatedPower: 0,
  });

  const [device2, setDevice2] = useState<DeviceData>({
    voltage: 0,
    current: 0,
    power: 0,
    accumulatedPower: 0,
  });

  const [totalPower, setTotalPower] = useState<number>(0);

  // Dummy data update for illustration
  useEffect(() => {
    const interval = setInterval(() => {
      const newDevice1 = {
        voltage: Math.random() * 6,
        current: Math.random() * 3,
        power: Math.random() * 1000,
        accumulatedPower: device1.accumulatedPower + Math.random(),
      };

      const newDevice2 = {
        voltage: Math.random() * 6,
        current: Math.random() * 3,
        power: Math.random() * 1000,
        accumulatedPower: device2.accumulatedPower + Math.random(),
      };

      setDevice1(newDevice1);
      setDevice2(newDevice2);
      setTotalPower(newDevice1.accumulatedPower + newDevice2.accumulatedPower);
    }, 3000);

    return () => clearInterval(interval);
  }, [device1, device2]);

  return (
    <div className="dashboard-container">
      <h1>Base Station Dashboard</h1>
      <div className="device-section">
        <img
          src={awr1642Image.src}
          alt="AWR1642BOOST-ODS"
          className="device-image"
        />
        <p>AWR1642BOOST-ODS</p>
        <img src={usrpB210Image.src} alt="USRP B210" className="device-image" />
        <p>USRP B210</p>
      </div>
      <div className="charts-grid">
        <div className="chart-card">
          <h2>
            <i className="fas fa-bolt"></i> Radar Voltage
          </h2>
          <GaugeChart
            id="device1-voltage"
            nrOfLevels={50}
            arcsLength={[0.2, 0.3, 0.5]} // Split into segments as needed
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green, Yellow, Red
            percent={device1.voltage / 10} // Still using a percentage for fill
            formatTextValue={() => `${device1.voltage.toFixed(2)} V`} // Show real value as text
            textColor="#000000"
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-wave-square"></i> Radar Current
          </h2>
          <GaugeChart
            id="device1-current"
            nrOfLevels={50}
            arcsLength={[0.2, 0.4, 0.4]} // Adjust arcs to represent safe, moderate, and high current ranges
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for mid, Red for high
            percent={device1.current / 3} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${device1.current.toFixed(2)} A`} // Display the actual current value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-plug"></i> Radar Power Consumption
          </h2>
          <GaugeChart
            id="device1-power"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={device1.power / 1000} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${device1.power.toFixed(2)} mW`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-bolt"></i> USRP Voltage
          </h2>
          <GaugeChart
            id="device2-voltage"
            nrOfLevels={50}
            arcsLength={[0.2, 0.3, 0.5]} // Split into segments as needed
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green, Yellow, Red
            percent={device2.voltage / 10} // Still using a percentage for fill
            formatTextValue={() => `${device2.voltage.toFixed(2)} V`} // Show real value as text
            textColor="#000000"
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-wave-square"></i> USRP Current
          </h2>
          <GaugeChart
            id="device2-current"
            nrOfLevels={50}
            arcsLength={[0.2, 0.4, 0.4]} // Adjust arcs to represent safe, moderate, and high current ranges
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for mid, Red for high
            percent={device2.current / 3} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${device2.current.toFixed(2)} A`} // Display the actual current value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-plug"></i> USRP Power Consumption
          </h2>
          <GaugeChart
            id="device2-power"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={device2.power / 1000} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${device2.power.toFixed(2)} mW`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-battery-full"></i> Radar Accumulated Power
          </h2>
          <GaugeChart
            id="device1-accumulated"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={device1.accumulatedPower / 30} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${device1.accumulatedPower.toFixed(2)} W`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
          />
        </div>
        <div className="chart-card">
          <h2>
            <i className="fas fa-battery-full"></i> USRP Accumulated Power
          </h2>
          <GaugeChart
            id="device2-accumulated"
            nrOfLevels={50}
            arcsLength={[0.3, 0.4, 0.3]} // Adjust arcs for low, medium, and high power consumption
            colors={["#00FF00", "#FFBF00", "#FF0000"]} // Green for low, Yellow for medium, Red for high
            percent={device2.accumulatedPower / 30} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${device2.accumulatedPower.toFixed(2)} W`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
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
            percent={totalPower / 30} // Use the calculated percentage value for the gauge
            formatTextValue={() => `${totalPower.toFixed(2)} W`} // Display the actual power consumption value
            needleColor="#464A4F"
            needleBaseColor="#464A4F"
            textColor="#000000"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
