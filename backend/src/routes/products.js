const express = require("express")
const router = express.Router()
const { createProduct, listProducts } = require("../services/productService")

// POST /api/products  -> cadastra produto (RF01)
router.post("/", (req, res) => {
  try {
    const product = createProduct(req.body)
    return res.status(201).json(product)
  } catch (err) {
    const status = err.statusCode || 500
    return res.status(status).json({ message: err.message })
  }
})

// GET /api/products -> só pra ver o resultado dos cadastros
router.get("/", (req, res) => {
  const products = listProducts()
  return res.json(products)
})

module.exports = router
