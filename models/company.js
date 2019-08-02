const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: String,
    razaosocial: String,
    cnpj: String,
    address: String,
    phone: String,
    speciality: [{ type: String, enum: ['Laptop', 'Tablet', 'Mobile', 'Consoles', "TV's", 'Audio'] }],
    location: { type: { type: String }, coordinates: [Number] },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: { type: Schema.Types.ObjectId, ref: 'Products' },
  },
  {
    timestamps: true,
  }
);


const Company = mongoose.model('Company', companySchema);


module.exports = Company;
