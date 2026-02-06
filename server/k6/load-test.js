import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '30s', target: 0 },  // Ramp down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    },
};

export default function () {
    // Step 1: User visits the Home Page (List of Courses)
    let res = http.get('http://localhost:3000/courses');

    check(res, {
        'Home Page: status is 200 (Success)': (r) => r.status === 200,
        'Home Page: status is 429 (Rate Limited)': (r) => r.status === 429,
    });

    // Proceed only if not rate limited
    if (res.status === 200) {
        try {
            const courses = res.json();

            // Step 2: User clicks on the first course if available
            if (courses && courses.length > 0) {
                const courseId = courses[0].id; // Extract ID from first course

                let detailRes = http.get(`http://localhost:3000/courses/${courseId}`);

                check(detailRes, {
                    'Course Detail: status is 200': (r) => r.status === 200,
                    'Course Detail: status is 429': (r) => r.status === 429,
                });
            }
        } catch (e) {
            // Handle potential JSON parse errors or empty responses
        }
    }

    sleep(1);
}
