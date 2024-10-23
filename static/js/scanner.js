let students = [];

// Load Excel Data
async function loadExcelData() {
    try {
        const response = await fetch('Data.xlsx');
        if (!response.ok) {
            throw new Error('Failed to fetch Excel file');
        }
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = XLSX.utils.sheet_to_json(firstSheet);

        students = excelData.map(row => ({
            id: row['رقم الطالب'].toString().trim(),
            name: row['أسم الطالب'],
            college: row['اسم الكليه'],
            department: row['اسم القسم'],
            year: row['الفرقة'],
            paymentStatus: row['حاله الدفع']
        }));
    } catch (error) {
        console.error('Error loading Excel file:', error);
    }
}

loadExcelData();

// Handle form submission
document.getElementById('student-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const studentId = document.getElementById('student-id').value.trim();

    if (!/^\d+$/.test(studentId)) {
        alert('Please enter a valid numeric Student ID.');
        return;
    }

    const student = students.find(s => s.id === studentId);

    if (student) {
        // Store student data in localStorage
        localStorage.setItem('studentData', JSON.stringify(student));

        // Redirect to display.html
        window.location.href = 'display.html';
    } else {
        localStorage.setItem('studentData', JSON.stringify(null));
        window.location.href = 'display.html';
    }
});
// QR Code Reader handling
document.getElementById('qr-reader-link').addEventListener('click', function (event) {
    event.preventDefault();
    const video = document.getElementById('preview');
    video.style.display = 'block';

    // Make sure the video isn't mirrored for the back camera
    video.style.transform = ''; // Reset transform

    if (typeof Instascan === 'undefined') {
        console.error('Instascan library is not loaded.');
        alert('QR Code scanning is not available. Please check if the Instascan library is loaded.');
        video.style.display = 'none';
        return;
    }

    // Access environment-facing camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();

            let scanner = new Instascan.Scanner({ video: video });
            scanner.addListener('scan', function (content) {
                document.getElementById('student-id').value = content;
                video.style.display = 'none';
                stream.getTracks().forEach(track => track.stop()); // Stop camera
            });

            Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    const backCamera = cameras.find(camera => camera.name.toLowerCase().includes('back') || camera.name.toLowerCase().includes('environment'));
                    if (backCamera) {
                        scanner.start(backCamera);
                    } else {
                        alert('Back camera not found. Please use a device with a back camera.');
                        video.style.display = 'none';
                        stream.getTracks().forEach(track => track.stop());
                    }
                } else {
                    alert('No cameras found or access denied. Please allow camera access.');
                    video.style.display = 'none';
                    stream.getTracks().forEach(track => track.stop());
                }
            }).catch(function (e) {
                console.error('Error starting camera:', e);
                alert('Error starting camera. Please check browser permissions.');
                video.style.display = 'none';
                stream.getTracks().forEach(track => track.stop());
            });
        })
        .catch(function (e) {
            console.error('Error accessing camera:', e);
            alert('Error accessing camera. Please check browser permissions.');
            video.style.display = 'none';
        });
});

// CSS to prevent mirroring (if needed for video preview)
// For front camera (usually mirrored), apply this, but reset for back camera



document.querySelector('.logout').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'index.html';
});