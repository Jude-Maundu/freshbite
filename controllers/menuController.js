const {
  createMenuItem: insertMenuItem,
  deleteMenuItem: removeMenuItemRecord,
  findMenuItemById,
  listMenuItems,
  updateMenuItem: saveMenuItem,
} = require('../repositories/supabaseRepository');
const { buildPublicMenuPayload, normalizeMenuItem } = require('../services/menuService');

function normalizeTextField(value, fallback = '') {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
}

function normalizePriceField(value, fallback = null) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function normalizeStatusField(value, fallback = 'available') {
  const allowedStatuses = new Set(['available', 'featured', 'seasonal', 'out-of-stock']);
  const normalizedValue = normalizeTextField(value, fallback).toLowerCase();

  return allowedStatuses.has(normalizedValue) ? normalizedValue : fallback;
}

async function getPublicMenu(req, res) {
  const menuItems = await listMenuItems({ ascending: true });

  res.json({
    success: true,
    data: buildPublicMenuPayload(menuItems, req.query),
  });
}

async function getMenuItems(req, res) {
  const menuItems = await listMenuItems();

  res.json({
    success: true,
    data: menuItems.map(normalizeMenuItem),
  });
}

async function createMenuItem(req, res) {
  const name = normalizeTextField(req.body.name);
  const category = normalizeTextField(req.body.category);
  const description = normalizeTextField(req.body.description);
  const price = normalizePriceField(req.body.price);
  const status = normalizeStatusField(req.body.status, 'available');

  if (!name || !category || !description || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, description, and a valid non-negative price are required.',
    });
  }

  const menuItem = await insertMenuItem({
    name,
    category,
    description,
    price,
    status,
    imageUrl: '',
  });

  return res.status(201).json({
    success: true,
    message: 'Menu item created successfully.',
    data: normalizeMenuItem(menuItem),
  });
}

async function updateMenuItem(req, res) {
  const currentItem = await findMenuItemById(req.params.id);

  if (!currentItem) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found.',
    });
  }

  const name = normalizeTextField(req.body.name, currentItem.name);
  const category = normalizeTextField(req.body.category, currentItem.category);
  const description = normalizeTextField(req.body.description, currentItem.description);
  const price = normalizePriceField(req.body.price, currentItem.price);
  const status = normalizeStatusField(req.body.status, currentItem.status || 'available');

  if (!name || !category || !description || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, description, and a valid non-negative price are required.',
    });
  }

  const updatedItem = await saveMenuItem(req.params.id, {
    name,
    category,
    description,
    price,
    status,
    imageUrl: '',
  });

  return res.json({
    success: true,
    message: 'Menu item updated successfully.',
    data: normalizeMenuItem(updatedItem),
  });
}

async function deleteMenuItem(req, res) {
  const itemToDelete = await findMenuItemById(req.params.id);

  if (!itemToDelete) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found.',
    });
  }

  await removeMenuItemRecord(req.params.id);

  return res.json({
    success: true,
    message: 'Menu item deleted successfully.',
  });
}

module.exports = {
  getPublicMenu,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
