import jwt from "jsonwebtoken";

export const protect = async (req,res,next)=>{
    try {
        let token;

        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ){

        token = req.headers.authorization.split(" ")[1];

        console.log("TOKEN:", token);
        console.log("JWT_SECRET:", process.env.JWT_SECRET);



        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = decoded;
        next();
        
    } else {
      return res.status(401).json({
        message: "Not authorized, token missing",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
    