import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Seed Data
const USERS = {
  'nurse.elena@medpulse.io': {
    name: 'Elena Rostova, RN',
    role: 'Triage Nurse',
    password: 'Password123!',
    department: 'Emergency & Acute Triage'
  },
  'dr.marcus@medpulse.io': {
    name: 'Dr. Marcus Vance, MD',
    role: 'Attending Physician',
    password: 'Password123!',
    department: 'Cardiology & Intensive Care'
  },
  'pharma.claire@medpulse.io': {
    name: 'Claire Dupont, PharmD',
    role: 'Clinical Pharmacist',
    password: 'Password123!',
    department: 'Inpatient Pharmacy'
  }
};

let PATIENTS = [
  {
    id: 'PAT-8012',
    mrn: 'MRN-90214',
    name: 'Robert Hastings',
    age: 62,
    gender: 'Male',
    complaint: 'Crushing chest pain radiating to left jaw',
    vitals: { systolic: 188, diastolic: 112, heartRate: 118, spo2: 89, temp: 37.8 },
    triageScore: 'CRITICAL',
    bed: 'ICU-Bay-01',
    admittedAt: '2026-10-27T08:15:00Z',
    allergies: ['Penicillin', 'Sulfa'],
    medications: ['Metoprolol 50mg']
  },
  {
    id: 'PAT-8013',
    mrn: 'MRN-90215',
    name: 'Sophia Martinez',
    age: 34,
    gender: 'Female',
    complaint: 'Acute asthma exacerbation with wheezing',
    vitals: { systolic: 142, diastolic: 92, heartRate: 98, spo2: 92, temp: 37.1 },
    triageScore: 'URGENT',
    bed: 'ER-Bed-04',
    admittedAt: '2026-10-27T08:45:00Z',
    allergies: ['Latex'],
    medications: ['Albuterol Inhaler']
  },
  {
    id: 'PAT-8014',
    mrn: 'MRN-90216',
    name: 'Jonathan Miller',
    age: 45,
    gender: 'Male',
    complaint: 'Right ankle inversion trauma following fall',
    vitals: { systolic: 122, diastolic: 78, heartRate: 72, spo2: 99, temp: 36.7 },
    triageScore: 'ROUTINE',
    bed: 'FastTrack-02',
    admittedAt: '2026-10-27T09:10:00Z',
    allergies: ['None known'],
    medications: ['Multivitamin']
  },
  {
    id: 'PAT-8015',
    mrn: 'MRN-90217',
    name: 'Amara Chen',
    age: 58,
    gender: 'Female',
    complaint: 'Uncontrolled atrial fibrillation and dizziness',
    vitals: { systolic: 175, diastolic: 104, heartRate: 132, spo2: 91, temp: 37.2 },
    triageScore: 'CRITICAL',
    bed: 'ICU-Bay-03',
    admittedAt: '2026-10-27T09:30:00Z',
    allergies: ['Morphine'],
    medications: ['Warfarin 5mg', 'Digoxin 0.125mg']
  }
];

const PRESCRIPTIONS = [];

const DRUG_INTERACTIONS = [
  {
    drugA: 'Warfarin',
    drugB: 'Aspirin',
    severity: 'HIGH_RISK_HAZARD',
    alert: 'CRITICAL INTERACTION: Concurrent Warfarin and Aspirin synergistically multiplies internal hemorrhage and gastrointestinal bleeding risk by 4.2x.'
  },
  {
    drugA: 'Lisinopril',
    drugB: 'Spironolactone',
    severity: 'HIGH_RISK_HAZARD',
    alert: 'CRITICAL INTERACTION: Concomitant ACE inhibitor and potassium-sparing diuretic induces life-threatening hyperkalemia risk.'
  }
];

function computeAcuity(vitals) {
  const { systolic, diastolic, heartRate, spo2 } = vitals;
  if (systolic >= 180 || diastolic >= 110 || spo2 <= 90 || heartRate >= 120) {
    return 'CRITICAL';
  }
  if (systolic >= 140 || diastolic >= 90 || spo2 <= 94 || heartRate >= 100) {
    return 'URGENT';
  }
  return 'ROUTINE';
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, 'http://' + (req.headers.host || 'localhost:4000'));
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // 1. Healthz
  if (pathname === '/healthz' && method === 'GET') {
    return sendJson(res, 200, { status: 'healthy', uptime: process.uptime(), service: 'MedPulse Clinical Gateway' });
  }

  // 2. Auth Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const { email, password } = await parseJsonBody(req);
    const user = USERS[email];
    if (!user || user.password !== password) {
      return sendJson(res, 401, { error: 'Invalid clinical credentials or inactive employee profile.' });
    }
    return sendJson(res, 200, {
      token: 'jwt_medpulse_session_' + Date.now(),
      user: {
        name: user.name,
        email,
        role: user.role,
        department: user.department
      }
    });
  }

  // 3. Patients API
  if (pathname === '/api/patients' && method === 'GET') {
    const search = parsedUrl.searchParams.get('search');
    const status = parsedUrl.searchParams.get('status');
    let results = [...PATIENTS];
    if (status && status !== 'ALL') {
      results = results.filter(p => p.triageScore.toUpperCase() === status.toUpperCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.mrn.toLowerCase().includes(q) ||
        p.complaint.toLowerCase().includes(q)
      );
    }
    return sendJson(res, 200, results);
  }

  // Single Patient Detail
  if (pathname.startsWith('/api/patients/') && method === 'GET') {
    const id = pathname.replace('/api/patients/', '');
    const patient = PATIENTS.find(p => p.id === id || p.mrn === id);
    if (!patient) return sendJson(res, 404, { error: 'Patient chart not found' });
    return sendJson(res, 200, patient);
  }

  // Triage Intake
  if (pathname === '/api/patients/triage' && method === 'POST') {
    const { name, age, gender, complaint, vitals, assignedBed, notes } = await parseJsonBody(req);
    if (!name || !complaint || !vitals) {
      return sendJson(res, 400, { error: 'Missing mandatory clinical triage parameters' });
    }

    const triageScore = computeAcuity(vitals);
    const newPatient = {
      id: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
      mrn: 'MRN-' + Math.floor(10000 + Math.random() * 90000),
      name,
      age: Number(age) || 40,
      gender: gender || 'Unspecified',
      complaint,
      vitals: {
        systolic: Number(vitals.systolic),
        diastolic: Number(vitals.diastolic),
        heartRate: Number(vitals.heartRate),
        spo2: Number(vitals.spo2),
        temp: Number(vitals.temp) || 37.0
      },
      triageScore,
      bed: assignedBed || (triageScore === 'CRITICAL' ? 'ICU-Bay-' + Math.floor(1 + Math.random() * 8) : 'ER-Bed-' + Math.floor(1 + Math.random() * 20)),
      admittedAt: new Date().toISOString(),
      allergies: notes ? [notes] : ['None known'],
      medications: []
    };

    PATIENTS.unshift(newPatient);
    return sendJson(res, 201, {
      message: 'Patient triage intake successfully completed',
      patient: newPatient
    });
  }

  // Prescriptions
  if (pathname === '/api/prescriptions' && method === 'POST') {
    const { patientId, medication, dosage, frequency, confirmedOverride } = await parseJsonBody(req);
    const patient = PATIENTS.find(p => p.id === patientId || p.mrn === patientId);
    if (!patient) return sendJson(res, 404, { error: 'Patient not found' });

    for (const activeDrug of patient.medications) {
      const activeDrugName = activeDrug.split(' ')[0];
      const match = DRUG_INTERACTIONS.find(rule => 
        (rule.drugA.toLowerCase() === medication.toLowerCase() && rule.drugB.toLowerCase() === activeDrugName.toLowerCase()) ||
        (rule.drugB.toLowerCase() === medication.toLowerCase() && rule.drugA.toLowerCase() === activeDrugName.toLowerCase())
      );

      if (match && !confirmedOverride) {
        return sendJson(res, 409, {
          conflictType: 'DRUG_DRUG_CONTRAINDICATION',
          hazardAlert: match.alert,
          conflictingDrug: activeDrug,
          requiresPhysicianOverride: true
        });
      }
    }

    const prescription = {
      rxId: 'RX-' + Math.floor(100000 + Math.random() * 900000),
      patientId: patient.id,
      patientName: patient.name,
      medication,
      dosage,
      frequency,
      overrideAcknowledged: !!confirmedOverride,
      orderedAt: new Date().toISOString(),
      status: 'ACTIVE_DISPENSED'
    };

    patient.medications.push(medication + ' ' + dosage);
    PRESCRIPTIONS.unshift(prescription);

    return sendJson(res, 201, {
      message: 'Prescription order electronically transmitted to dispensary',
      prescription
    });
  }

  // Telemetry
  if (pathname === '/api/telemetry' && method === 'GET') {
    const jitter = (Math.random() - 0.5) * 4;
    return sendJson(res, 200, {
      timestamp: new Date().toISOString(),
      telemetry: {
        leadII_ecg: 'SINUS_RHYTHM_NORMAL',
        heartRate: Math.round(76 + jitter),
        spo2: Math.min(100, Math.round(98 + (Math.random() - 0.5) * 2)),
        perfusionIndex: 4.8,
        invasiveBP: '124/82'
      }
    });
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  if (!ext) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(fallbackPath, (fallbackErr, content) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('404 Not Found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      });
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🏥 MedPulse Clinical Operations Gateway listening on port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`❤️ Health check: http://localhost:${PORT}/healthz`);
});
