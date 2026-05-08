const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        // Fetch user profile from PostgreSQL
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, patient_id, doctor_id')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return res.status(403).json({ error: 'User profile not found.' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: profile.role,
            patient_id: profile.patient_id,
            doctor_id: profile.doctor_id
        };
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server authentication error.' });
    }
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
