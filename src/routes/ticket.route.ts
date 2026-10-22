'use strict';
import express from 'express'
const router = express.Router();
import ticketController from '../controllers/ticket.controller';


router.get('/', ticketController.list);
router.post('/', ticketController.create);
router.put('/:id', ticketController.patch);

router.post('/:id/issues', ticketController.addIssue);
router.put('/:id/issues/:issueId', ticketController.updateIssue);
router.delete('/:id/issues/:issueId', ticketController.removeIssue);

router.post('/:id/close', ticketController.close);
router.put('/:id/remark', ticketController.remark);


export default router;
