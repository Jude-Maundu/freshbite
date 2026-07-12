const path = require('path');
const fs = require('fs');
const {
  createMenuItem: insertMenuItem,
  deleteMenuItem: removeMenuItemRecord,
  findMenuItemById,
  listMenuItems,
  updateMenuItem: saveMenuItem,
} = require('../repositories/supabaseRepository');
const { buildPublicMenuPayload, normalizeMenuItem } = require('../services/menuService');

function resolveUploadPath(imageUrl = '') {
  if (!imageUrl) {
    return '';
  }

  return path.join(__dirname, '..', imageUrl.replace(/^\//, ''));
}

function removeImageFile(imageUrl = '') {
  const filePath = resolveUploadPath(imageUrl);

  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
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
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  const menuItem = await insertMenuItem({
    name: req.body.name?.trim(),
    category: req.body.category?.trim(),
    description: req.body.description?.trim(),
    price: Number(req.body.price),
    status: String(req.body.status || 'available').trim().toLowerCase(),
    imageUrl,
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

  const previousImageUrl = currentItem.imageUrl || '';
  const nextImageUrl = req.file ? `/uploads/${req.file.filename}` : previousImageUrl;

  const updatedItem = await saveMenuItem(req.params.id, {
    name: req.body.name?.trim() || currentItem.name,
    category: req.body.category?.trim() || currentItem.category,
    description: req.body.description?.trim() || currentItem.description,
    price: Number.isFinite(Number(req.body.price)) ? Number(req.body.price) : currentItem.price,
    status: String(req.body.status || currentItem.status || 'available').trim().toLowerCase(),
    imageUrl: nextImageUrl,
  });

  if (req.file && previousImageUrl && previousImageUrl !== nextImageUrl) {
    removeImageFile(previousImageUrl);
  }

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

  if (itemToDelete.imageUrl) {
    removeImageFile(itemToDelete.imageUrl);
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
