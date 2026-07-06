const express = require('express');
const { getPublicMenu, createMenuItem, deleteMenuItem } = require('../controllers/menuController');
const requireAdminAuth = require('../middleware/requireAdminAuth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getPublicMenu);
router.post('/', requireAdminAuth, upload.single('image'), createMenuItem);
router.delete('/:id', requireAdminAuth, deleteMenuItem);

module.exports = router;
