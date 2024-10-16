let students = [];

// Load CSV Data
async function loadCSVData() {
    try {
        const response = await fetch('data.csv'); // Change to your actual CSV file path
        if (!response.ok) {
            throw new Error('Failed to fetch CSV file');
        }
        const data = await response.text();
        const rows = data.split('\n');

        // Parse CSV data, assuming first row contains headers
        students = rows.slice(1).map(row => {
            const [name, id, college, department, year, paymentStatus] = row.split(',');
            return {
                id: id.trim(),
                name: name.trim(),
                college: college.trim(),
                department: department.trim(),
                year: year.trim(),
                paymentStatus: paymentStatus.trim()
            };
        });
    } catch (error) {
        console.error('Error loading CSV file:', error);
    }
}

loadCSVData();

// Submit form manually with student ID
document.getElementById('student-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const studentId = document.getElementById('student-id').value.trim();
    searchStudentById(studentId);
});

// QR Code Scanner
document.getElementById('qr-reader-link').addEventListener('click', function(event) {
    event.preventDefault();
    const video = document.getElementById('preview');
    video.style.display = 'block';

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (content) {
        document.getElementById('student-id').value = content;
        video.style.display = 'none';
        searchStudentById(content); // Search for student using scanned ID
    });

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            alert('No cameras found or access denied. Please allow camera access.');
            video.style.display = 'none';
        }
    }).catch(function (e) {
        console.error('Error starting camera:', e);
        alert('Error starting camera. Please check browser permissions.');
        video.style.display = 'none';
    });
});

// Search student by ID
function searchStudentById(studentId) {
    const student = students.find(s => s.id == studentId);
    const studentInfoDiv = document.getElementById('student-info');

    if (student) {
        // Store student data in localStorage
        localStorage.setItem('studentData', JSON.stringify(student));

        // Redirect to display.html
        window.location.href = 'display.html';
    } else {
        studentInfoDiv.innerHTML = '<div>No student found with this ID.</div>';
    }
}