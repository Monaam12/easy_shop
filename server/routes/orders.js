import express from "express";
import Order from "../models/Order.js";

const ordersRoutes = express.Router();

// GET Orders List
ordersRoutes.get(`/`, (req, res) => {
  return Order.find()
    .populate("user", "name")
    .populate("products", "name")
    .sort({ dateOrdered: -1 })
    .then((orderList) => {
      if (!orderList) {
        return res.status(500).json({ success: false });
      }
      return res.status(200).json({ success: true, data: orderList });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

// get Order By id
ordersRoutes.get(`/:id`, (req, res) => {
  return Order.findById(req.params.id)
    .populate("user", "name")
    .populate("products")
    .then((order) => {
      if (!order) {
        return res.status(500).json({ success: false });
      }
      return res.status(200).json({ success: true, data: order });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

// create a new order
ordersRoutes.post("/", (req, res) => {
  const {
    city,
    products,
    country,
    status,
    totalPrice,
    phone,
    user,
    quantity,
    address,
  } = req.body;

  return Order.create({
    address,
    city,
    country,
    phone,
    status,
    totalPrice,
    user,
    quantity,
    products,
  })
    .then((order) => res.status(200).json({ success: true, data: order }))
    .catch((err) =>
      res.status(400).json({ success: false, message: err.message })
    );
});

// update Status of order
ordersRoutes.put("/:id", (req, res) => {
  const {
    params: { id },
    body: { status },
  } = req;

  return Order.findByIdAndUpdate(id, { status }, { new: true })
    .then((order) => res.status(200).json({ success: true, data: order }))
    .catch(() => res.status(400).send("the order cannot be updated!"));
});

//delete Order
ordersRoutes.delete("/:id", (req, res) => {
  return Order.findByIdAndRemove(req.params.id)
    .then((order) => {
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
      return res
        .status(200)
        .json({ success: true, message: "the order is deleted!" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

// get orders by User ID
ordersRoutes.get(`/get/userorders/:userid`, (req, res) => {
  return Order.find({ user: req.params.userid })
    .populate({
      path: "products",
      populate: "category",
    })
    .sort({ dateOrdered: -1 })
    .then((userOrderList) => {
      if (!userOrderList) {
        return res.status(500).json({ success: false });
      }
      return res.status(200).json({ success: true, data: userOrderList });
    });
});

// Get totalsales
ordersRoutes.get("/get/totalsales", (req, res) => {
  return Order.aggregate()
    .group({
      _id: null,
      totalSales: { $sum: "$totalPrice" },
    })
    .then(([{ totalSales }]) => {
      return res.status(200).json({ succes: true, data: { totalSales } });
    })
    .catch((err) =>
      res.status(400).json({ succes: false, message: err.message })
    );
});

// GET Count Orders
ordersRoutes.get(`/get/count`, (req, res) => {
  return Order.countDocuments()
    .then((orderCount) => {
      return res.status(200).json({ success: true, data: { orderCount } });
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

export default ordersRoutes;
