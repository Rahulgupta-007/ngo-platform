const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Get Token from Header
  const tokenHeader = req.header('x-auth-token') || req.header('Authorization');

  // 2. Check if token exists
  if (!tokenHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Clean the Token (Remove 'Bearer ' if present)
    const token = tokenHeader.startsWith('Bearer ') 
      ? tokenHeader.slice(7, tokenHeader.length) 
      : tokenHeader;

    // 4. Verify Token
    // Fallback to 'secret123' if .env is missing (prevents crash during dev)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded; 

    // 5. Check Verification (Optional: Only for NGOs)
    // If user is NGO and NOT verified, block them.
    if (req.user.role === 'ngo' && req.user.isVerified === false) {
       return res.status(403).json({ message: 'Account pending admin approval.' });
    }

    next();

  } catch (err) {
    console.error('❌ AUTH ERROR:', err.message);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please login again' });
    }
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};