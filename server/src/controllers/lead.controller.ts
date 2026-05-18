import { Response } from 'express';
import Lead, { LeadStatus, LeadSource } from '../models/Lead';
import { UserRole } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource),
});

export const createLead = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = leadSchema.parse(req.body);
    const lead = new Lead({
      ...validatedData,
      userId: req.user?.userId, // Associate lead with the creating user
    });
    await lead.save();
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create lead' });
  }
};

export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      source,
      search,
      sort = 'latest',
    } = req.query;

    const query: any = {};

    // Scope queries by the active logged-in user's ID so that fresh accounts
    // (both Admin and Sales Users) start with a clean 0 dashboard.
    if (req.user) {
      query.userId = req.user.userId;
    }

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption: any = {};
    if (sort === 'latest') sortOption.createdAt = -1;
    if (sort === 'oldest') sortOption.createdAt = 1;

    const skip = (Number(page) - 1) * Number(limit);

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch leads' });
  }
};

export const getLeadById = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // GATING BY ROLE: Sales user can only view their own leads
    if (req.user && req.user.role !== UserRole.ADMIN && lead.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to access this lead' });
    }

    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch lead' });
  }
};

export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // GATING BY ROLE: Sales user can only edit their own leads
    if (req.user && req.user.role !== UserRole.ADMIN && lead.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to modify this lead' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedLead);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update lead' });
  }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // GATING BY ROLE: Sales user is blocked at route level, but controller check reinforces security
    if (req.user && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to delete leads' });
    }

    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete lead' });
  }
};

export const exportLeads = async (req: AuthRequest, res: Response) => {
  try {
    const query: any = {};
    if (req.user) {
      query.userId = req.user.userId;
    }
    const leads = await Lead.find(query).sort({ createdAt: -1 });

    // Define CSV headers
    const headers = ['Lead ID', 'Name', 'Email', 'Status', 'Source', 'Created At'];

    // Helper to format/escape cell value for standard CSV
    const formatCSVCell = (val: any) => {
      if (val === null || val === undefined) return '';
      let str = typeof val === 'object' ? String(val) : String(val);
      // Double quotes must be escaped by doubling them
      str = str.replace(/"/g, '""');
      // Wrap in double quotes if there are commas, double quotes, or newlines
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str}"`;
      }
      return str;
    };

    // Construct the rows
    const rows = [
      headers.join(','),
      ...leads.map(lead => [
        lead._id.toString(),
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        lead.createdAt ? new Date(lead.createdAt).toISOString() : ''
      ].map(formatCSVCell).join(','))
    ];

    const csvContent = rows.join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    return res.status(200).send(csvContent);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to export leads' });
  }
};
