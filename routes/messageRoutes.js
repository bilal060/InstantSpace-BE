const express = require('express');
const { check } = require('express-validator');

const messageController = require('../controllers/messageController');
const fileUpload = require('../middlewares/file-upload');

const router = express.Router();

router.get('/:conversationId', messageController.get_conversation_messages);

router.post('/', messageController.new_message);

router.post('/media_message', fileUpload.single('chat_img'), messageController.mediaMessage);

module.exports = router;