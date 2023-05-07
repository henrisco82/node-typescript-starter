import Order, { type OrderDocument } from '../models/orderModel';

async function findAll(): Promise<OrderDocument[]> {
  const orders: OrderDocument[] = await Order.find({}).populate(
    'user',
    'id name',
  );
  return orders;
}

async function findById(id: string): Promise<OrderDocument | null> {
  const order: OrderDocument | null = await Order.findById(id).populate(
    'user',
    'name email',
  );
  if (order == null) return null;
  return order;
}

async function findByUserId(userId: string): Promise<OrderDocument[]> {
  const orders: OrderDocument[] = await Order.find({ user: userId });
  return orders;
}

async function create(order: OrderDocument): Promise<OrderDocument> {
  const createdOrder = await Order.create(order);
  return createdOrder as unknown as OrderDocument;
}

export { findAll, findById, findByUserId, create };
