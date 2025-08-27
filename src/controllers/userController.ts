import { log } from "console";
import User from "../models/User";

const createUser = async (req: any, res: any) => {

    console.log("hola");

    try {
        const { firstName, lastName, email, password } = req.body;

        const user = new User({ firstName, lastName, email, password });

        await user.save();

        res.status(201).json({ message: "User created", user });

    } catch (error) {

        res.status(500).json({ message: "Error creating user", error });
    }
};

export default {createUser};
