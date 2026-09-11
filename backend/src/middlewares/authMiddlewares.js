const { admin } = require("../config/firebaseAdmin");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    console.log("EMAIL VERIFIED:", decoded.email_verified);
    console.log(decoded);

   // if (!decoded.email_verified) {
    //  return res.status(403).json({ error: "Email não verificado" });
     //}

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = verifyToken;