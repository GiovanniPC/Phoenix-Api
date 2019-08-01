const mongoose = require('mongoose');

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    name: String,
    razaosocial: String,
    cnpj: String,
    address: String,
    phone: String,
    speciality: [ {type: String} ],
    location: { type: {type: String}, coordinates: [Number] },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
