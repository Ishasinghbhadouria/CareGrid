const client = require('prom-client');

const register = new client.Registry();

register.setDefaultLabels({
  service: 'caregrid-api',
  hospital: 'CarePlus Super-Speciality Hospital'
});

client.collectDefaultMetrics({
  register,
  prefix: 'caregrid_node_'
});

// HTTP Request Counter & Latency Histogram
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests processed by CareGrid REST API',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [register]
});

// Hospital Bed & Critical Wing Metrics
const hospitalBedsTotal = new client.Gauge({
  name: 'caregrid_hospital_beds_total',
  help: 'Total available hospital beds configured per wing',
  labelNames: ['wing'],
  registers: [register]
});

const hospitalBedsOccupied = new client.Gauge({
  name: 'caregrid_hospital_beds_occupied',
  help: 'Currently occupied hospital beds per wing',
  labelNames: ['wing'],
  registers: [register]
});

// OPD Queue Metrics
const opdQueueWaiting = new client.Gauge({
  name: 'caregrid_opd_queue_waiting',
  help: 'Number of patients waiting in OPD queue per department',
  labelNames: ['department'],
  registers: [register]
});

const opdTokensServedTotal = new client.Counter({
  name: 'caregrid_opd_tokens_served_total',
  help: 'Total outpatient consultations served',
  labelNames: ['department'],
  registers: [register]
});

// ResQCare Ambulance & Emergency Metrics
const emergencySosDispatchesTotal = new client.Counter({
  name: 'caregrid_emergency_sos_dispatches_total',
  help: 'Cumulative ResQCare Emergency SOS dispatches initiated',
  labelNames: ['category'],
  registers: [register]
});

const activeEmergenciesGauge = new client.Gauge({
  name: 'caregrid_active_emergencies',
  help: 'Active ResQCare SOS emergencies currently in progress',
  registers: [register]
});

const ambulanceUnitsStatus = new client.Gauge({
  name: 'caregrid_ambulance_units_status',
  help: 'Number of ambulance fleet units by operational status',
  labelNames: ['status'],
  registers: [register]
});

// Authentication & RBAC Metrics
const authEventsTotal = new client.Counter({
  name: 'caregrid_auth_events_total',
  help: 'Total authentication events by role and action',
  labelNames: ['role', 'action'],
  registers: [register]
});

// Initialize Realistic Hospital Operational Baselines
const WING_BASELINES = [
  { wing: 'ICU', total: 45, occupied: 42 },
  { wing: 'Trauma_ER', total: 10, occupied: 8 },
  { wing: 'HDU', total: 30, occupied: 28 },
  { wing: 'General_Wards', total: 200, occupied: 187 },
  { wing: 'NICU_Pediatric', total: 25, occupied: 22 }
];

for (const w of WING_BASELINES) {
  hospitalBedsTotal.set({ wing: w.wing }, w.total);
  hospitalBedsOccupied.set({ wing: w.wing }, w.occupied);
}

opdQueueWaiting.set({ department: 'General_Medicine' }, 5);
opdQueueWaiting.set({ department: 'Cardiology' }, 6);
opdQueueWaiting.set({ department: 'Pediatrics' }, 4);
opdQueueWaiting.set({ department: 'Orthopedics' }, 5);

activeEmergenciesGauge.set(0);
ambulanceUnitsStatus.set({ status: 'standby' }, 7);
ambulanceUnitsStatus.set({ status: 'en_route' }, 0);
ambulanceUnitsStatus.set({ status: 'handoff' }, 1);

// Middleware to record HTTP requests cleanly
function metricsMiddleware(req, res, next) {
  if (req.path === '/metrics') return next();

  const endTimer = httpRequestDurationSeconds.startTimer();
  res.on('finish', () => {
    const route = req.route?.path ? `${req.baseUrl}${req.route.path}` : req.path;
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode)
    };
    httpRequestsTotal.inc(labels);
    endTimer(labels);
  });
  next();
}

module.exports = {
  register,
  metricsMiddleware,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  hospitalBedsTotal,
  hospitalBedsOccupied,
  opdQueueWaiting,
  opdTokensServedTotal,
  emergencySosDispatchesTotal,
  activeEmergenciesGauge,
  ambulanceUnitsStatus,
  authEventsTotal
};
