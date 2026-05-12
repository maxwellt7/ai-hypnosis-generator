import express from 'express';
import { provisionController } from '../controllers/provision.controller.js';

const router = express.Router();

router.post('/', provisionController.provisionAccess);

export default router;
