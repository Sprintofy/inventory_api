'use strict';
import express from 'express'
const router = express.Router();
import technicianController from '../controllers/technician.controller';


router.get('/', technicianController.list);
router.post('/', technicianController.create);
router.put('/:id', technicianController.update);
router.delete('/:id', technicianController.remove);


export default router;
