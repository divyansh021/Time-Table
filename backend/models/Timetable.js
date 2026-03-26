const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Timetable", timetableSchema);