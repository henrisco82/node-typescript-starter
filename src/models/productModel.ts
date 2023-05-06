import { Schema, model } from 'mongoose';

export interface ProductDocument extends Document {
  _id: string;
  name: string;
  image: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
}

const reviewSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const productSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    reviews: [reviewSchema],
    numReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Product = model<ProductDocument>('Product', productSchema);

export default Product;
