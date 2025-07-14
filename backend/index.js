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
        serial_number AS id,
        make,
        model,
        variant,
        color,
        fuel_type,
        registration_number,
        registration_date,
        rc_status,
        rc_expiry_date,
        chassis_number,
        engine_number,
        manufacturing_year,
        manufacturing_month,
        owner_serial_number,
        mileage_km AS mileage,
        cubic_capacity_cc AS cc,
        emission_norms,
        transmission_type AS transmission,
        vehicle_category AS category,
        insurance_type,
        insurance_expiry_date AS insurance_expiry,
        estimated_selling_price AS price,
        ready_for_sales
      FROM car_stocks
      WHERE ready_for_sales = 'Yes'
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
        serial_number AS id,
        make,
        model,
        variant,
        color,
        fuel_type,
        transmission_type AS transmission,
        mileage_km AS mileage,
        manufacturing_year,
        estimated_selling_price AS price
      FROM car_stocks
      WHERE make = $1 AND ready_for_sales = 'Yes'
      ORDER BY serial_number
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
      SELECT DISTINCT make
      FROM car_stocks
      WHERE ready_for_sales = 'Yes'
      ORDER BY make
    `);
    const brands = result.rows.map((row) => row.make);
    res.json(brands);
  } catch (err) {
    console.error("Error fetching brands:", err);
    if (err && err.stack) {
      console.error("Stack trace:", err.stack);
    }
    res.status(500).send("Server Error");
  }
});

// ✅ Test Drive Booking Endpoint
app.post("/test-drive", async (req, res) => {
  const { name, phone, licence, preferredTime, date, carId } = req.body;
  console.log("📥 Test drive request received:", req.body);
  try {
    // Fetch car name (make + model) from car_stocks
    const carResult = await pool.query(
      `SELECT make, model FROM car_stocks WHERE serial_number = $1`,
      [carId]
    );
    if (carResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid car ID" });
    }
    const carName = `${carResult.rows[0].make} ${carResult.rows[0].model}`;

    // Insert booking into test_drive_bookings
    await pool.query(
      `INSERT INTO test_drive_bookings (customer_name, phone_number, has_license, car_name, test_drive_date, test_drive_time)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        name,
        phone,
        licence === 'yes',
        carName,
        date,
        preferredTime || '00:00'
      ]
    );

    res.status(200).json({ message: `🎉 Test drive booked for ${name}!` });
  } catch (err) {
    console.error("Error booking test drive:", err);
    res.status(500).json({ message: "Failed to book test drive. Please try again later." });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
