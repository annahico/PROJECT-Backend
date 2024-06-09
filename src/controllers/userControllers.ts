import { Request, Response } from "express";
import { User } from "../models/User";


//view users
export const getUsers = async(req: Request, res: Response) => {
    try {

        const users = await User.find(
            {
                select: {
                    id: true,
                    firstName: true,
                    secondName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }
        )
        res.status(200).json (
            {
                success: true,
                message: "users retrieved successfully",
                data: users
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "users cant be retrieved"
            })
    }
}


//view user profile
export const getUserProfile = async(req: Request, res: Response) => {
    try {

        const userId = req.tokenData.userId
        const user = await User.findOne(
            {
                where: {
                    id: userId
                },
                relations : {
                    role: true
                },
                select: {
                    id: true,
                    firstName: true,
                    secondName: true,
                    email: true,
                    password: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        )
        res.status(200).json (
            {
                success: true,
                message: "user retrieved successfully",
                data: user
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "users cant be retrieved"
            })
    }
}


//update user
export const updateProfile = async(req:Request, res:Response) => {
    try {

        const firstName = req.body.firstName
        const userId = req.tokenData.userId

        if(!firstName) {
            return res.status(400).json(
            {
                success: false,
                message: "first name is needed",
            })
        }

        const userUpdated =User.update(
            {
                id: userId
            },
            {
                firstName: firstName,
            }
        )

        res.status(200).json (
            {
                success: true,
                message: "users update successfully",
                data: userUpdated
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "users cant be updated"
            })
    }
}


//delete user
export const deleteUsers = async (req:Request, res: Response) => {
    try {
        const userId = req.params.id
        

        const userToRemove = await User.findOne(
            {
                where: {
                    id: parseInt(userId)
                }

            })


        if(!userToRemove) {
            return res.status(404).json(
            {
                success: false,
                message: "user cant be deleted"
            })
        }

        if (userToRemove.id === 1) {
            return res.status(400).json({
                success: false,
                message: "Super Admin cannot be deleted"
            });
        }

        await User.remove(userToRemove);

        res.status(200).json(
            {
                success: true,
                message: "user delete successfully"
            })
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "user cant be delete",
                error: error
            })
    }
}