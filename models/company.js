const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    razaosocial: String,
    cnpj: String,
    address: String,
    phone: String,
    speciality: [ {type: String} ],
    location: { type: {type: String}, coordinates: [Number] },
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
