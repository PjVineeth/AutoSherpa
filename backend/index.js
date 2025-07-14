const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db"); // Make sure this exports a working pg Pool

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚗 Used Cars API is running!");
});

// ✅ Get all cars (limit 50)
app.get("/cars", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        "Serial Number" AS id,
        "Make" AS make,
        "Model" AS model,
        "Variant" AS variant,
        "Color" AS color,
        "Fuel Type" AS fuel_type,
        "Registration Number" AS registration_number,
        "Registration Date" AS registration_date,
        "RC Status" AS rc_status,
        "RC Expiry Date" AS rc_expiry_date,
        "Chassis Number" AS chassis_number,
        "Engine Number" AS engine_number,
        "Manufacturing Year" AS manufacturing_year,
        "Manufacturing Month" AS manufacturing_month,
        "Owner Serial Number" AS owner_serial_number,
        "Mileage (KM)" AS mileage,
        "Cubic Capacity (CC)" AS cc,
        "Emission Norms" AS emission_norms,
        "Transmission Type" AS transmission,
        "Vehicle Category" AS category,
        "Insurance Type" AS insurance_type,
        "Insurance Expiry Date" AS insurance_expiry,
        "Estimated Selling Price" AS price,
        "Ready for Sales" AS ready_for_sales
      FROM car_stock
      WHERE "Ready for Sales" = 'Yes'
      LIMIT 50;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).send("Server error");
  }
});

// ✅ Get cars by brand with pagination
app.get("/cars-by-brand", async (req, res) => {
  const { brand, page = 1 } = req.query;
  const limit = 5;
  const offset = (parseInt(page) - 1) * limit;

  try {
    const result = await pool.query(
      `
      SELECT 
        "Serial Number" AS id,
        "Make" AS make,
        "Model" AS model,
        "Variant" AS variant,
        "Color" AS color,
        "Fuel Type" AS fuel_type,
        "Transmission Type" AS transmission,
        "Mileage (KM)" AS mileage,
        "Manufacturing Year" AS manufacturing_year,
        "Estimated Selling Price" AS price
      FROM car_stock
      WHERE "Make" = $1 AND "Ready for Sales" = 'Yes'
      ORDER BY "Serial Number"
      LIMIT $2 OFFSET $3
    `,
      [brand, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cars by brand:", err);
    res.status(500).send("Server Error");
  }
});

// ✅ Get all distinct brands
app.get("/brands", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT "Make"
      FROM car_stock
      WHERE "Ready for Sales" = 'Yes'
      ORDER BY "Make"
    `);
    const brands = result.rows.map((row) => row.Make);
    res.json(brands);
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).send("Server Error");
  }
});

// ✅ Test Drive Booking Endpoint
app.post("/test-drive", (req, res) => {
  const { name, phone, preferredDate, carId } = req.body;
  console.log("📥 Test drive request received:", req.body);
  res.status(200).json({ message: "Test drive booked successfully" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
