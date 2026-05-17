"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = require("../controllers/lead.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/', lead_controller_1.getLeads);
router.get('/export', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), lead_controller_1.exportLeads);
router.get('/:id', lead_controller_1.getLeadById);
router.post('/', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN, User_1.UserRole.SALES), lead_controller_1.createLead);
router.put('/:id', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN, User_1.UserRole.SALES), lead_controller_1.updateLead);
router.delete('/:id', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), lead_controller_1.deleteLead);
exports.default = router;
//# sourceMappingURL=lead.routes.js.map