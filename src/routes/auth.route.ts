'use strict';
import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller';
import { validate } from '../appConfigs/middleware/validation';

// Login with validation
router.post('/login', validate('login'), authController.login);
router.get('/me', authController.me);

export default router;