import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../models/User';
import { z } from 'zod';

const onboardUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole),
});

const updateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch users' });
  }
};

export const onboardUser = async (req: Request, res: Response) => {
  try {
    const validatedData = onboardUserSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.status(201).json({
      message: 'User onboarded successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Onboarding failed' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateRoleSchema.parse(req.body);
    const { role } = validatedData;

    // Check if the user is attempting to change their own role to prevent lockout
    const requestUser = (req as any).user;
    if (requestUser.userId === id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Update failed' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent deleting oneself
    const requestUser = (req as any).user;
    if (requestUser.userId === id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Delete failed' });
  }
};
