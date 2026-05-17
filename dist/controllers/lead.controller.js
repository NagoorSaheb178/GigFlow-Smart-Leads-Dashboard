"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeads = exports.deleteLead = exports.updateLead = exports.getLeadById = exports.getLeads = exports.createLead = void 0;
const Lead_1 = __importStar(require("../models/Lead"));
const zod_1 = require("zod");
const leadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    status: zod_1.z.nativeEnum(Lead_1.LeadStatus).optional(),
    source: zod_1.z.nativeEnum(Lead_1.LeadSource),
});
const createLead = async (req, res) => {
    try {
        const validatedData = leadSchema.parse(req.body);
        const lead = new Lead_1.default(validatedData);
        await lead.save();
        res.status(201).json(lead);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to create lead' });
    }
};
exports.createLead = createLead;
const getLeads = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, source, search, sort = 'latest', } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (source)
            query.source = source;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const sortOption = {};
        if (sort === 'latest')
            sortOption.createdAt = -1;
        if (sort === 'oldest')
            sortOption.createdAt = 1;
        const skip = (Number(page) - 1) * Number(limit);
        const leads = await Lead_1.default.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));
        const total = await Lead_1.default.countDocuments(query);
        res.json({
            leads,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch leads' });
    }
};
exports.getLeads = getLeads;
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (!lead)
            return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch lead' });
    }
};
exports.getLeadById = getLeadById;
const updateLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!lead)
            return res.status(404).json({ message: 'Lead not found' });
        res.json(lead);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to update lead' });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findByIdAndDelete(req.params.id);
        if (!lead)
            return res.status(404).json({ message: 'Lead not found' });
        res.json({ message: 'Lead deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete lead' });
    }
};
exports.deleteLead = deleteLead;
const exportLeads = async (req, res) => {
    try {
        const leads = await Lead_1.default.find().sort({ createdAt: -1 });
        res.json(leads);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to export leads' });
    }
};
exports.exportLeads = exportLeads;
//# sourceMappingURL=lead.controller.js.map