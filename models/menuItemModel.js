const { v4: uuidv4 } = require('uuid');

function createMenuItem(payload, imageUrl = '') {
  return {
    id: uuidv4(),
    name: payload.name,
    category: payload.category,
    description: payload.description,
    price: Number(payload.price),
    status: payload.status || 'available',
    imageUrl,
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

module.exports = {
  createMenuItem,
};
