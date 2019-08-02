const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: String,
    statusProduct: { type: String, enum:['Broken', 'Semi-used']},
    categories: { type: String, enum:["Laptop", "Tablet", "Mobile", "Consoles", "TV's", "Audio"]},
    path: { type: String, enum:['Repair', 'Sell']},
    brand: String,
    price: String,
    description: String,
    imageUrl: [{ type: String, default: "http://static.cmsi-id.com/product/01032016/pt-cahayatiara-mustika-scientific-indonesia_5tqwe_244.png"}],
   
    status: { type: String, enum:['Request', 'FirstReponse', 'ToRepair', 'OrderRepair', 'WantRepair', 'InRepair', 'SendCompany', 'ToStore'], default: 'Request'},
    descriptionRepair: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
