import pool from "../config/db.js";

// Calculate distance between two coordinates using Haversine formula
// Returns dist in kms
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// POST /addSchool - Add a new school to the database
export const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Check all fields are present
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, address, latitude, longitude",
      });
    }

    // Check name is a non-empty string
    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name must be a non-empty string",
      });
    }

    // Check address is a non-empty string
    if (typeof address !== "string" || address.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Address must be a non-empty string",
      });
    }

    // Check latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    // Check coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90",
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180",
      });
    }

    // Insert the school into the database
    const [result] = await pool.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
  } catch (error) {
    console.log("addSchool error: " + error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /listSchools - Get all schools, sorted by distance if lat/lon provided
export const listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    // Fetch all schools from the database
    const [schools] = await pool.execute("SELECT * FROM schools");

    // If no coordinates provided, return all schools without sorting
    if (!latitude && !longitude) {
      return res.status(200).json({
        success: true,
        count: schools.length,
        data: schools,
      });
    }

    // If coordinates are provided, validate them
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers",
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (userLat < -90 || userLat > 90) {
      return res.status(400).json({
        success: false,
        message: "Latitude must be between -90 and 90",
      });
    }

    if (userLon < -180 || userLon > 180) {
      return res.status(400).json({
        success: false,
        message: "Longitude must be between -180 and 180",
      });
    }

    // Calculate distance for each school and sort by nearest first
    const sorted = schools
      .map((school) => ({
        id: school.id,
        name: school.name,
        address: school.address,
        latitude: school.latitude,
        longitude: school.longitude,
        distance: parseFloat(
          getDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  } catch (error) {
    console.log("listSchools error: " + error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
