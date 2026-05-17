import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';
import { getUsers, onboardUser, updateUserRole, deleteUser } from '../controllers/admin.controller';

const router = Router();

// Apply auth protection & admin authorization to all sub-routes
router.use(protect);
router.use(authorize(UserRole.ADMIN));

router.get('/users', getUsers);
router.post('/users', onboardUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
