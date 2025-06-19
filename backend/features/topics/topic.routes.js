import express from 'express';
import * as topicController from './topic.controller.js';

const router = express.Router();

router.post('/', topicController.createTopic);
router.get('/', topicController.getTopics);

export default router;