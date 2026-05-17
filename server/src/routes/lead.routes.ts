import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

router.get('/', getLeads);
router.get('/export', authorize(UserRole.ADMIN), exportLeads);
router.get('/:id', getLeadById);
router.post('/', authorize(UserRole.ADMIN, UserRole.SALES), createLead);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.SALES), updateLead);
router.delete('/:id', authorize(UserRole.ADMIN), deleteLead);

export default router;
