const { User, Role } = require("../database/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {};

authController.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid registration fields",
            });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email,
            password_hash: hashedPassword,
            role_id: 4, // user role
        });

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: { userId: user.id },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message,
        });
    }
};

authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            include: [
                {
                    model: Role,
                    as: "role",
                },
            ],
            where: { email },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Bad credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Bad credentials",
            });
        }

        const tokenPayload = {
            userId: user.id,
            userRoleName: user.role.name,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
            expiresIn: "3h",
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};


authController.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Find user by email
        const user = await User.findOne({
            include: [
                {
                    model: Role,
                    as: "role",
                },
            ],
            where: { email },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Bad credentials", //asi no damos información detallada de la base de datos
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Bad credentials",
            });
        }

        // Create JWT token
        const tokenPayload = {
            userId: user.id,
            userRoleName: user.role.name,
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
            expiresIn: "3h",
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

module.exports = authController;
