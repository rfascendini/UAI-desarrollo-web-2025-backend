import User from "../models/UserModel";
import { Request, Response } from "express";
import admin from "../firebase";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

const createUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const user = new User({ firstName, lastName, email, password });

        await user.save();

        res.status(201).json({ message: "User created", user });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, password } = req.body;

        const user = await User.findByIdAndUpdate(id, { firstName, lastName, email, password }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

const hardDeleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User hard deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error hard deleting user", error });
    }
};

const softDeleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User soft deleted", user });
    } catch (error) {
        res.status(500).json({ message: "Error soft deleting user", error });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userRecord = await admin.auth().getUserByEmail(email);

        res.status(200).json({ message: "Login successful", user: userRecord });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

const logoutUser = async (req: Request, res: Response) => {
    try {

        

    } catch (error) {
        res.status(500).json({ message: "Error logging out", error });
    }
};

const registerUser = async (req: Request, res: Response) => {
    try {



    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

export default { getAllUsers, getUserById, createUser, updateUser, softDeleteUser, hardDeleteUser, loginUser, logoutUser, registerUser };
