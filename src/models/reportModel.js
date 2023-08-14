const mongoose = require("mongoose");
const ReportSchema = new mongoose.Schema({});

const Report = mongoose.model("Report", ReportSchema, "Reports");

module.exports = Report;
