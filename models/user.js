const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['Customer', 'Company', 'Admin'], default: 'Customer' },
    name: String,
    status: { type: String, enum: ['Active', 'Pending'], default: 'Pending' },
    address: String,
    city: String,
    cep: Number,
    cpf: String,
    token: String,
    product: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    company: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
    shoppingCart: [{ type: Schema.Types.ObjectId, ref: 'ShoppingCart' }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
