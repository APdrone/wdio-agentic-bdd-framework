// MedPulse Clinical Operations Client Logic
let currentUser = null;
let cachedPatients = [];
let pendingPrescription = null;

// Auth Quick Fill
function fillPersona(persona) {
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  passwordInput.value = 'Password123!';

  if (persona === 'nurse') emailInput.value = 'nurse.elena@medpulse.io';
  if (persona === 'doctor') emailInput.value = 'dr.marcus@medpulse.io';
  if (persona === 'pharma') emailInput.value = 'pharma.claire@medpulse.io';
}

// Login Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorBox = document.getElementById('login-error');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      errorBox.textContent = data.error || 'Authentication failure';
      errorBox.style.display = 'block';
      return;
    }

    errorBox.style.display = 'none';
    currentUser = data.user;
    localStorage.setItem('medpulse_token', data.token);

    // Update Header
    document.getElementById('display-user-name').textContent = currentUser.name;
    document.getElementById('display-user-role').textContent = currentUser.role;
    document.getElementById('user-display').style.display = 'flex';
    document.getElementById('app-nav').style.display = 'flex';

    // Switch View
    switchView('triage-wizard');
    loadPatients();
  } catch (err) {
    errorBox.textContent = 'Server connection error';
    errorBox.style.display = 'block';
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('medpulse_token');
  document.getElementById('user-display').style.display = 'none';
  document.getElementById('app-nav').style.display = 'none';
  switchView('login');
});

// Navigation Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    switchView(btn.getAttribute('data-tab'));
  });
});

function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById('view-' + viewName);
  if (target) target.classList.add('active');

  if (viewName === 'patient-registry') loadPatients();
  if (viewName === 'prescriptions') populateRxPatientSelect();
}

// Acuity Calculator
function recalcAcuity() {
  const sys = Number(document.getElementById('triage-systolic').value) || 120;
  const dia = Number(document.getElementById('triage-diastolic').value) || 80;
  const hr = Number(document.getElementById('triage-heartrate').value) || 75;
  const spo2 = Number(document.getElementById('triage-spo2').value) || 98;
  const badge = document.getElementById('triage-risk-badge');

  if (sys >= 180 || dia >= 110 || spo2 <= 90 || hr >= 120) {
    badge.className = 'badge-critical';
    badge.textContent = '🔴 CODE RED: CRITICAL EMERGENCY';
  } else if (sys >= 140 || dia >= 90 || spo2 <= 94 || hr >= 100) {
    badge.className = 'badge-urgent';
    badge.textContent = '🟡 CODE YELLOW: URGENT TRIAGE';
  } else {
    badge.className = 'badge-routine';
    badge.textContent = '🟢 CODE GREEN: ROUTINE';
  }
}

// Triage Form Submission
document.getElementById('triage-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('triage-patient-name').value,
    age: document.getElementById('triage-patient-age').value,
    gender: document.getElementById('triage-patient-gender').value,
    complaint: document.getElementById('triage-patient-complaint').value,
    vitals: {
      systolic: document.getElementById('triage-systolic').value,
      diastolic: document.getElementById('triage-diastolic').value,
      heartRate: document.getElementById('triage-heartrate').value,
      spo2: document.getElementById('triage-spo2').value,
      temp: 37.0
    },
    notes: document.getElementById('triage-notes').value
  };

  try {
    const res = await fetch('/api/patients/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const banner = document.getElementById('triage-success-banner');
      banner.style.display = 'block';
      setTimeout(() => { banner.style.display = 'none'; }, 4000);
      document.getElementById('triage-form').reset();
      recalcAcuity();
      loadPatients();
    }
  } catch (err) {
    console.error('Triage error:', err);
  }
});

// Patient Registry
async function loadPatients(status = 'ALL', search = '') {
  let url = '/api/patients?status=' + status;
  if (search) url += '&search=' + encodeURIComponent(search);

  try {
    const res = await fetch(url);
    cachedPatients = await res.json();
    renderPatientTable(cachedPatients);
  } catch (err) {
    console.error('Fetch patients error:', err);
  }
}

function renderPatientTable(patients) {
  const tbody = document.getElementById('patient-table-body');
  tbody.innerHTML = '';

  if (patients.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No matching patient records found in census.</td></tr>';
    return;
  }

  patients.forEach(p => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-testid', 'patient-row');
    tr.setAttribute('data-mrn', p.mrn);

    let badgeClass = 'badge-routine';
    if (p.triageScore === 'CRITICAL') badgeClass = 'badge-critical';
    if (p.triageScore === 'URGENT') badgeClass = 'badge-urgent';

    tr.innerHTML = `
      <td style="font-family: var(--font-mono); font-weight: 600;">${p.mrn}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.age} / ${p.gender}</td>
      <td>${p.complaint}</td>
      <td><span class="${badgeClass}">${p.triageScore}</span></td>
      <td style="font-family: var(--font-mono); color: var(--accent-cyan);">${p.bed}</td>
      <td>
        <button class="btn-outline" style="font-size: 0.75rem; padding: 0.35rem 0.75rem;" onclick="openChartModal('${p.id}')" data-testid="view-chart-btn">
          View Chart
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterPatients(status) {
  loadPatients(status, document.getElementById('patient-search-input').value);
}

function searchPatients() {
  const query = document.getElementById('patient-search-input').value;
  loadPatients('ALL', query);
}

// Chart Modal
function openChartModal(patientId) {
  const p = cachedPatients.find(x => x.id === patientId || x.mrn === patientId);
  if (!p) return;

  document.getElementById('modal-patient-name').textContent = p.name + ' (' + p.age + ' yo ' + p.gender + ')';
  document.getElementById('modal-patient-mrn').textContent = 'MRN: ' + p.mrn + ' | BED: ' + p.bed;
  document.getElementById('modal-patient-vitals').textContent = 
    `BP: ${p.vitals.systolic}/${p.vitals.diastolic} mmHg | HR: ${p.vitals.heartRate} bpm | SpO2: ${p.vitals.spo2}% | Temp: ${p.vitals.temp}°C`;
  document.getElementById('modal-allergies-list').textContent = p.allergies.join(', ') || 'None';
  document.getElementById('modal-meds-list').textContent = p.medications.join(', ') || 'No active orders';

  document.getElementById('patient-chart-modal').classList.add('open');
}

function closeChartModal() {
  document.getElementById('patient-chart-modal').classList.remove('open');
}

// Prescriptions
function populateRxPatientSelect() {
  const select = document.getElementById('rx-patient-select');
  select.innerHTML = '';
  cachedPatients.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (${p.mrn}) — Current: ${p.medications.join(', ') || 'No Meds'}`;
    select.appendChild(opt);
  });
}

document.getElementById('rx-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const patientId = document.getElementById('rx-patient-select').value;
  const medication = document.getElementById('rx-medication-select').value;
  const dosage = document.getElementById('rx-dosage-input').value;
  const frequency = document.getElementById('rx-frequency-select').value;

  pendingPrescription = { patientId, medication, dosage, frequency };
  await transmitRx(pendingPrescription, false);
});

async function transmitRx(rxData, override) {
  const payload = Object.assign({}, rxData, { confirmedOverride: override });
  const errorReceipt = document.getElementById('rx-error-receipt');
  const successReceipt = document.getElementById('rx-success-receipt');
  if (errorReceipt) errorReceipt.style.display = 'none';

  try {
    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok && res.status !== 409) {
      if (errorReceipt) {
        errorReceipt.textContent = '⚠️ Gateway Intercept: Pharmacy Dispatch Service Offline (HTTP ' + res.status + '). Please retry.';
        errorReceipt.style.display = 'block';
      }
      return;
    }

    const data = await res.json();

    if (res.status === 409 && data.conflictType === 'DRUG_DRUG_CONTRAINDICATION') {
      // Trigger Warning Modal
      document.getElementById('hazard-alert-text').textContent = data.hazardAlert;
      document.getElementById('override-checkbox').checked = false;
      document.getElementById('confirm-override-btn').disabled = true;
      document.getElementById('drug-interaction-modal').classList.add('open');
      return;
    }

    if (res.ok) {
      closeHazardModal();
      if (successReceipt) {
        successReceipt.textContent = `✅ Prescription ${data.prescription.rxId} authorized for ${data.prescription.patientName}: ${data.prescription.medication} ${data.prescription.dosage} (${data.prescription.frequency})`;
        successReceipt.style.display = 'block';
        setTimeout(() => { successReceipt.style.display = 'none'; }, 6000);
      }
      loadPatients();
    }
  } catch (err) {
    console.error('Rx order error:', err);
    if (errorReceipt) {
      errorReceipt.textContent = '⚠️ Network Fault: Unable to reach pharmacy gateway. Connection failed.';
      errorReceipt.style.display = 'block';
    }
  }
}

// Override checkbox handler
document.getElementById('override-checkbox').addEventListener('change', (e) => {
  document.getElementById('confirm-override-btn').disabled = !e.target.checked;
});

function submitOverriddenRx() {
  if (pendingPrescription) {
    transmitRx(pendingPrescription, true);
  }
}

function closeHazardModal() {
  document.getElementById('drug-interaction-modal').classList.remove('open');
}

// Theme Toggle
document.getElementById('theme-toggle-btn').addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
});

// Telemetry Poller with Fault Interception
window.__simulateTelemetryFault = false;

setInterval(async () => {
  const view = document.getElementById('view-telemetry');
  if (view && view.classList.contains('active')) {
    const badge = document.getElementById('telemetry-status-badge');
    if (window.__simulateTelemetryFault) {
      if (badge) {
        badge.className = 'badge-urgent';
        badge.textContent = '🟡 TELEMETRY OFFLINE: RECONNECTING...';
      }
      return;
    }

    try {
      const res = await fetch('/api/telemetry');
      if (!res.ok) throw new Error('Telemetry Gateway Error');
      const data = await res.json();
      if (badge) {
        badge.className = 'badge-routine';
        badge.textContent = '🟢 LIVE RHYTHM';
      }
      document.getElementById('telemetry-hr-val').innerHTML = data.telemetry.heartRate + ' <span style="font-size: 1rem; color: var(--text-secondary);">BPM</span>';
      document.getElementById('telemetry-spo2-val').innerHTML = data.telemetry.spo2 + ' <span style="font-size: 1rem; color: var(--text-secondary);">%</span>';
    } catch (e) {
      if (badge) {
        badge.className = 'badge-urgent';
        badge.textContent = '🟡 TELEMETRY OFFLINE: RECONNECTING...';
      }
    }
  }
}, 1000);

