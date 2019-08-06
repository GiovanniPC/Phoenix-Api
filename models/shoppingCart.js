const mongoose = require('mongoose');

const { Schema } = mongoose;

const shoppingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    status: { type: String, enum: ['Open', 'pendingPayment', 'Purchased'], default: 'Open' },
    total: String,
  },
  {
    timestamps: true,
  },
);

const ShoppingCart = mongoose.model('ShoppingCart', shoppingSchema);

module.exports = ShoppingCart;