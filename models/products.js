const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: String,
    finalName: String,
    status: { type: String, enum:['Request', 'FirstResponse', 'ToRepair', 'OrderRepair', 'WantRepair', 'SendCompany', 'ToStore'], default: 'Request'},
    statusProduct: { type: String, enum: ['Broken', 'Semi-used'] },
    finalStatusProduct: { type: String, enum: ['Broken', 'Semi-used'] },
    categories: { type: String, enum: ['Laptop', 'Tablet', 'Mobile', 'Consoles', "TV's", 'Audio'] },
    path: { type: String, enum: ['Repair', 'Sell'] },
    brand: String,
    model: String,
    specs: String,
    starterPrice: String,
    repairPrice: String,
    sellingPrice: String,
    comission: String,
    totalPrice: String,
    clientDescription: String,
    repairDescription: String,
    companyDescription: String,
    finalDescription: String,
    onSale: { type: Boolean, default: false },
    repairYesNo: String,
    imageUrl: [{ type: String, default: 'http://static.cmsi-id.com/product/01032016/pt-cahayatiara-mustika-scientific-indonesia_5tqwe_244.png'}],
    repairImageUrl: [{ type: String, default: 'http://static.cmsi-id.com/product/01032016/pt-cahayatiara-mustika-scientific-indonesia_5tqwe_244.png'}],
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
