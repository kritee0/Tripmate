import { UserModel, validateUserSchema } from "../models/userModels.js";
import { generateToken } from "../utils/generateToken.js";


export const registerUser = async (req, res) => {
  try {
    const validatedUser = validateUserSchema.validate(req.body);
    if (validatedUser.error) {
      return res.json({ success: false, message: validatedUser.error.message });
    }

    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered." });
    }

    const newUser = await UserModel.create(validatedUser.value);
    const token = generateToken({ _id: newUser._id, role: newUser.role });

   
    const { password, ...userWithoutPassword } = newUser._doc;

    return res.json({
      success: true,
      data: { user: userWithoutPassword, token },
      message: `Welcome to TripMate, ${newUser.name}!`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.isPasswordValid(password))) {
      return res.json({ success: false, message: "Invalid credentials!" });
    }

    const token = generateToken({ _id: user._id, role: user.role });

    
    const { password: _, ...userWithoutPassword } = user._doc;

    return res.json({
      success: true,
      data: { user: userWithoutPassword, token },
      message: `Welcome back, ${user.name}`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getMyProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    ).select("-password");
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);

    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    
    if (user.role === "Admin") {
      return res.json({ success: false, message: "Super Admin cannot be deleted." });
    }

    await UserModel.findByIdAndDelete(req.params.userId);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    user.password = req.body.password;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const createAdmin = async (req, res) => {
  try {
    const existingAdmin = await UserModel.findOne({ role: "Admin" });

    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists." });
    }

    const adminData = {
      name: req.body.name || "Super Admin",
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber || "0000000000",
      address: req.body.address || "Head Office",
      role: "Admin",
    };

    const newAdmin = await UserModel.create(adminData);
    const token = generateToken({ _id: newAdmin._id, role: newAdmin.role });

    const { password, ...adminWithoutPassword } = newAdmin._doc;

    return res.json({
      success: true,
      message: " First admin created successfully",
      data: { admin: adminWithoutPassword, token },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



export const recordTravelClick = async (req, res) => {
  try {
    const { style } = req.body; 
    if (!style) return res.status(400).json({ success: false, message: "Style is required" });

    const user = await UserModel.findById(req.user._id);
    const clicks = user.travelClicks || new Map();
    clicks.set(style, (clicks.get(style) || 0) + 1);
    user.travelClicks = clicks;

    await user.save();
    res.json({ success: true, message: "Click recorded", clicks });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRecommendedStyle = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const clicks = user.travelClicks || new Map();

    let recommended = null;
    let max = 0;
    clicks.forEach((count, style) => {
      if (count > max) {
        max = count;
        recommended = style;
      }
    });

    res.json({ success: true, recommended });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getUserStats = async (req, res) => {
  try {
    const activeCount = await UserModel.countDocuments({ status: "active" });
    const inactiveCount = await UserModel.countDocuments({ status: "inactive" });
    const agencyCount = await UserModel.countDocuments({ role: "TravelAgency" });

    res.json({
      success: true,
      data: { activeCount, inactiveCount, agencyCount },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); 
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


