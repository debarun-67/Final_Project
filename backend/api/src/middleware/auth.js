const MOCK_USERS = {
    'mock-doc-1': {
        id: 'mock-doc-1',
        email: 'doctor@hospital.org',
        role: 'doctor',
        doctor_id: 'DOC_001'
    },
    'mock-doc-2': {
        id: 'mock-doc-2',
        email: 'doctor2@hospital.org',
        role: 'doctor',
        doctor_id: 'DOC_002'
    },
    'mock-doc-3': {
        id: 'mock-doc-3',
        email: 'doctor3@hospital.org',
        role: 'doctor',
        doctor_id: 'DOC_003'
    },
    'mock-pat-1': {
        id: 'mock-pat-1',
        email: 'patient@test.com',
        role: 'patient',
        patient_id: 'PAT_001'
    },
    'mock-pat-2': {
        id: 'mock-pat-2',
        email: 'patient2@test.com',
        role: 'patient',
        patient_id: 'PAT_002'
    },
    'mock-adm-1': {
        id: 'mock-adm-1',
        email: 'admin@chain.com',
        role: 'admin'
    }
};

const authMiddleware = async (req, res, next) => {
    const mockUserId = req.header('X-Mock-User-ID');
    if (mockUserId && MOCK_USERS[mockUserId]) {
        req.user = MOCK_USERS[mockUserId];
        next();
        return;
    }

    return res.status(401).json({ error: 'Access denied. Mock user session not found or invalid.' });
};

const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
