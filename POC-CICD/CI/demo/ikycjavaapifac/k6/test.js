
import http from 'k6/http';
import { check, sleep } from 'k6';
 
/*
  k6 Test Configuration
*/
export const options = {
  stages: [
    { duration: '30s', target: 5 },   // ramp up to 5 users
    { duration: '1m', target: 5 },    // stay at 5 users
    { duration: '30s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% requests < 500ms
    http_req_failed: ['rate<0.01'],   // < 1% failure
  },
};
 
/*
  Main Test Logic
*/
export default function () {
 
  // 1️⃣ User service
  const projectRes = http.get(
    'http://trace-project-service.default.svc.cluster.local/health'
  );
 
  check(projectRes, {
    'user service is up': (r) => r.status === 200,
  });
 
  // 2️⃣ Order service
  const taskRes = http.post(
    'http://trace-task-service.default.svc.cluster.local/tasks',
    JSON.stringify({ taskName: 'Test' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
 
  check(taskRes, {
    'task created': (r) => r.status === 201,
  });
 
  // 3️⃣ Payment service
  const timesheetRes = http.post(
    'http://trace-timesheet-service.default.svc.cluster.local/timesheet',
    JSON.stringify({ timesheetDate: 12-11-2025 }),
    { headers: { 'Content-Type': 'application/json' } }
  );
 
  check(timesheetRes, {
    'Timesheet successful': (r) => r.status === 200,
  });
 
  sleep(1);
}
