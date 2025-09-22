
export const checkLoggedInUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Please log in to perform this action.",
      });
    }

    if (user.role !== "User") {
      return res.status(403).json({
        success: false,
        message: "Only normal users can book packages.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


