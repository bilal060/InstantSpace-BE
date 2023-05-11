const express = require('express');
const { check } = require('express-validator');

const conversationController = require('../controllers/conversationController');

const router = express.Router();

router.get('/', conversationController.all_conversations);

router.get('/:userId', conversationController.get_user_conversations);

router.post('/', conversationController.new_conversation);

router.post('/add-user/:convId', [
    check('userId').not().isEmpty(),
], conversationController.addUserToConversation);

module.exports = router;