// Simulação de um "banco" em memória.
// Trocar para uma tabela real no banco de dados depois.
const products = []

function createProduct(data) {
  const { name, price, description, stock, category } = data

  // Validação básica do produto
  if (!name || !price) {
    const error = new Error("Nome e preço do produto são obrigatórios.")
    error.statusCode = 400
    throw error
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: Number(price),
    description: description || "",
    stock: stock != null ? Number(stock) : 0,
    category: category || "geral",
    createdAt: new Date(),
  }

  products.push(newProduct)
  return newProduct
}

function listProducts() {
  return products
}

module.exports = {
  createProduct,
  listProducts,
}
