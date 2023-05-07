import Product, { type ProductDocument } from '../models/productModel';

async function findAll(): Promise<ProductDocument[]> {
  const products = await Product.find({});
  return products;
}

async function findTop(): Promise<ProductDocument[]> {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  return products;
}

async function findById(id: string): Promise<ProductDocument | null> {
  const product = await Product.findById(id);
  if (product == null) return null;
  return product;
}

async function deleteById(id: string): Promise<ProductDocument | null> {
  const product = await Product.findByIdAndDelete(id);
  if (product == null) return null;
  return product;
}

async function update(
  productData: ProductDocument,
): Promise<ProductDocument | null> {
  const product = await Product.findByIdAndUpdate(productData._id, productData);
  if (product == null) return null;
  return product;
}

async function create(
  productData: ProductDocument,
): Promise<ProductDocument | null> {
  const product = await Product.create(productData);
  if (product._id === null) return null;
  return product;
}

export { findAll, findTop, findById, deleteById, update, create };
