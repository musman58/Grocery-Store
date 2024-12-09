import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { userId, items, total,name,email,address } = req.body;
     console.log("Items: ->",items);
    // Validate the input
    if (!userId || !items || !total || items.length === 0) {
      console.error('Invalid input:', { userId, items, total });
      return res.status(400).json({ message: 'Missing or invalid input data' });
    }

    const order = new Order({
      user: userId,
      items,
      total,
      status: 'pending',
      name,
      email,
      address
    });

    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Order creation error:', error.message); // Detailed error logging
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
}
