const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const contractorUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, default: null },
    address: { type: String, default: null },
    pincode: { type: Number, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
contractorUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const contracteeUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, default: null },
    address: { type: String, default: null },
    pincode: { type: Number, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
contracteeUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = {
  ContractorUser: mongoose.model("ContractorUser", contractorUserSchema),
  ContracteeUser: mongoose.model("ContracteeUser", contracteeUserSchema),
};
