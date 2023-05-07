import asyncHandler from 'express-async-handler';
import { type Request, type Response } from 'express';
import Product, { type Review } from '../models/productModel';
import { type UserDocument } from '../models/userModel';
import {
  findAll,
  findTop,
  findById,
  deleteById,
  update,
  create,
} from '../services/productService';

interface CustomRequest extends Request {
  user?: UserDocument | null;
}

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await findAll();
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await findById(req.params.id);

  if (product != null) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await deleteById(req.params.id);
  if (product !== null) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { user } = req;
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: user?._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description',
    });

    const createdProduct = await create(product);
    res.status(201).json(createdProduct);
  },
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await findById(req.params.id);

  if (product !== null) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await update(product);
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { rating, comment } = req.body;
    const { user } = req;
    if (user === undefined || user === null) throw new Error('User not found');

    const product = await Product.findById(req.params.id);

    if (product != null) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user === user?._id.toString(),
      );

      if (alreadyReviewed != null) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      const review: Review = {
        name: user?.name,
        rating: Number(rating),
        comment,
        user: user?._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  },
);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await findTop();

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
  createProductReview,
};
