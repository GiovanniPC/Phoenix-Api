const mongoose = require('mongoose');

const { Schema } = mongoose;

const shoppingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
    total: String,
  },
  {
    timestamps: true,
  },
);

const ShoppingCart = mongoose.model('ShoppingCart', shoppingSchema);

module.exports = ShoppingCart;