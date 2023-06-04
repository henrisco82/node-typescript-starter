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
  const product = await Product.findById(productData._id);
  if (product != null) {
    product.name = productData.name;
    product.price = productData.price;
    product.description = productData.description;
    product.image = productData.image;
    product.brand = productData.brand;
    product.category = productData.category;
    product.countInStock = productData.countInStock;
    product.rating = productData.rating;
    product.numReviews = productData.numReviews;
    await product.save();
  }
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
