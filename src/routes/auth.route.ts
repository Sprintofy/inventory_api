'use strict';
import express from 'express'
const router = express.Router();
import authController from '../controllers/auth.controller';


router.post('/login', authController.login);
router.get('/me', authController.me);


export default router;
