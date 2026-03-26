const express = require("express");
const router = express.Router();
const Timetable = require("../models/Timetable");


// ✅ GET timetable by roomId
router.get("/:roomId", async (req, res) => {
  try {
    const data = await Timetable.find({ roomId: req.params.roomId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ADD / UPDATE timetable cell
router.post("/", async (req, res) => {
  try {
    const {
      roomId,
      day,
      time,
      subject,
      department,
      role,
      userDepartment,
    } = req.body;

    // ❌ Student cannot edit
    if (role === "student") {
      return res.status(403).json({ error: "Students cannot edit" });
    }

    // Find existing entry
    let existing = await Timetable.findOne({ roomId, day, time });

    // ⚠️ Teacher restriction
    if (role === "teacher") {
      // ⚠️ Teacher restriction
      // ❌ If teacher tries to assign other department → block
      if (department !== userDepartment) {
        return res
          .status(403)
          .json({ error: "You can only assign your own department" });
      }
    }

    if (existing) {
      existing.subject = subject;
      existing.department = department;
      await existing.save();
    } else {
      const newEntry = new Timetable({
        roomId,
        day,
        time,
        subject,
        department,
      });
      await newEntry.save();
    }

    res.json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;