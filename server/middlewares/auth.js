import { getAuth } from "@clerk/express";

export const protect = (req, res, next) => {
  const { userId } = getAuth(req);

  console.log("USER ID:", userId);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  next();
};