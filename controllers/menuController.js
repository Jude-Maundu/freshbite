const path = require('path');
const fs = require('fs');
const { createMenuItem: buildMenuItem } = require('../models/menuItemModel');
const { readCollection, writeCollection } = require('../utils/fileStore');

const getMenu = async (req, res) => {
  const menuItems = await readCollection('menuItems.json', []);
  res.json({
    success: true,
    data: menuItems,
  });
};

const createMenuItem = async (req, res) => {
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
  const menuItem = buildMenuItem(req.body, imageUrl);
  const items = await readCollection('menuItems.json', []);
  await writeCollection('menuItems.json', [menuItem, ...items]);

  return res.status(201).json({
    success: true,
    message: 'Menu item created successfully.',
    data: menuItem,
  });
};

const deleteMenuItem = async (req, res) => {
  const items = await readCollection('menuItems.json', []);
  const itemToDelete = items.find((item) => item.id === req.params.id);

  if (!itemToDelete) {
    return res.status(404).json({
      success: false,
      message: 'Menu item not found.',
    });
  }

  if (itemToDelete.imageUrl) {
    const filePath = path.join(__dirname, '..', itemToDelete.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const filteredItems = items.filter((item) => item.id !== req.params.id);
  await writeCollection('menuItems.json', filteredItems);

  return res.json({
    success: true,
    message: 'Menu item deleted successfully.',
  });
};

module.exports = {
  getMenu,
  createMenuItem,
  deleteMenuItem,
};
