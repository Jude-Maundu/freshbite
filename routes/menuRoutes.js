const express = require('express');
const { getPublicMenu, createMenuItem, deleteMenuItem } = require('../controllers/menuController');
const requireAdminAuth = require('../middleware/requireAdminAuth');

const router = express.Router();

router.get('/', getPublicMenu);
router.post('/', requireAdminAuth, createMenuItem);
router.delete('/:id', requireAdminAuth, deleteMenuItem);

module.exports = router;
