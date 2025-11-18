const express = require("express")
const router = express.Router()
const { createProduct, listProducts } = require("../services/productService")

// cadastra produto
router.post("/", (req, res) => {
  try {
    const product = createProduct(req.body)
    return res.status(201).json(product)
  } catch (err) {
    const status = err.statusCode || 500
    return res.status(status).json({ message: err.message })
  }
})

// lista produtos
router.get("/", (req, res) => {
  const products = listProducts()
  return res.json(products)
})

module.exports = router
