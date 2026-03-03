const http = require('http');
const fs = require('fs');

const API_BASE = 'http://localhost:5000/api';
let authToken = '';
let createdStudentId = '';
let outputLog = '';

function log(msg) {
    console.log(msg);
    outputLog += msg + '\n';
}

const request = (method, path, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const url = new URL(API_BASE + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) { }
                resolve({
                    status: res.statusCode,
                    body: parsed || data
                });
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
};

const runTests = async () => {
    try {
        log('--- STARTING API VERIFICATION ---');

        // 1. Test Auth Login
        log('\n[1] POST /auth/login (Valid Credentials)');
        let res = await request('POST', '/auth/login', { username: 'admin', password: 'admin123' });
        log('Status: ' + res.status);
        if (res.status === 200 && res.body.token) {
            log('✅ Login Successful. Token received.');
            authToken = res.body.token;
        } else {
            log('❌ Login Failed: ' + JSON.stringify(res.body));
            fs.writeFileSync('test-results.txt', outputLog);
            return;
        }

        // 2. Test Get Students
        log('\n[2] GET /students (Read All)');
        res = await request('GET', '/students', null, authToken);
        log('Status: ' + res.status);
        if (res.status === 200 && Array.isArray(res.body)) {
            log(`✅ Get Students Successful. Found ${res.body.length} students.`);
        } else {
            log('❌ Get Students Failed: ' + JSON.stringify(res.body));
        }

        // 3. Test Create Student
        log('\n[3] POST /students (Create New)');
        const studentData = {
            name: 'API Test Student 2',
            rollNumber: 'API102',
            email: 'api2@test.com',
            course: 'API Testing 2',
            grade: 'B+',
            status: 'Active'
        };
        res = await request('POST', '/students', studentData, authToken);
        log('Status: ' + res.status);
        if (res.status === 201 && res.body._id) {
            log('✅ Create Student Successful. ID: ' + res.body._id);
            createdStudentId = res.body._id;
        } else {
            log('❌ Create Student Failed: ' + JSON.stringify(res.body));
        }

        // 4. Test Update Student
        log(`\n[4] PUT /students/${createdStudentId} (Update Existing)`);
        const updateData = { course: 'Advanced API Testing', grade: 'O' };
        res = await request('PUT', `/students/${createdStudentId}`, updateData, authToken);
        log('Status: ' + res.status);
        if (res.status === 200 && res.body.course === 'Advanced API Testing') {
            log('✅ Update Student Successful. Course updated to: ' + res.body.course);
        } else {
            log('❌ Update Student Failed: ' + JSON.stringify(res.body));
        }

        // 5. Test Delete Student
        log(`\n[5] DELETE /students/${createdStudentId} (Delete Existing)`);
        res = await request('DELETE', `/students/${createdStudentId}`, null, authToken);
        log('Status: ' + res.status);
        if (res.status === 200 && res.body.message === 'Student removed') {
            log('✅ Delete Student Successful.');
        } else {
            log('❌ Delete Student Failed: ' + JSON.stringify(res.body));
        }

        log('\n--- API VERIFICATION COMPLETE ---');
        fs.writeFileSync('test-results.txt', outputLog);

    } catch (err) {
        log('Error during testing: ' + err.message);
        fs.writeFileSync('test-results.txt', outputLog);
    }
};

runTests();
