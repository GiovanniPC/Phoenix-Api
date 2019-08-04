const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: String,
    approved: { type: Boolean, default: false },
    razaosocial: String,
    cnpj: String,
    address: String,
    phone: String,
    email: String,
    speciality: [{ type: String, enum: ['Laptop', 'Tablet', 'Mobile', 'Consoles', "TV", 'Audio'] }],
    location: { type: { type: String }, coordinates: [Number] },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  {
    timestamps: true,
  }
);


const Company = mongoose.model('Company', companySchema);


module.exports = Company;
