import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  const { method } = req;
  const { page = 1, limit = 10 } = req.query;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const skip = (page - 1) * limit;

        // Fetch products with pagination
        const products = await Product.find().skip(skip).limit(Number(limit));

        // Get the total count of products
        const total = await Product.countDocuments();

        res.status(200).json({
          success: true,
          data: products,
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          total,
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}
