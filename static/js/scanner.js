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

// Custom QR Code Reader handling (using jsQR)
document.getElementById('qr-reader-link').addEventListener('click', function (event) {
    event.preventDefault();

    const video = document.getElementById('preview');
    video.style.display = 'block'; // Show video preview

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Open the camera with back-facing preference
        navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
                scanQRCode(video); // Start scanning for QR code
            })
            .catch(function (err) {
                console.error('Error accessing camera:', err);
                alert('Could not access the camera. Please allow camera access.');
            });
    } else {
        alert('Camera is not supported in this browser.');
    }
});

function scanQRCode(video) {
    const canvasElement = document.createElement('canvas');
    const canvas = canvasElement.getContext('2d');

    function checkFrame() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

            if (qrCode) {
                video.style.display = 'none'; // Hide video once QR code is found
                document.getElementById('student-id').value = qrCode.data;
                video.srcObject.getTracks().forEach(track => track.stop()); // Stop camera stream

                // Optional: Trigger form submission automatically after QR scan
                // document.getElementById('student-form').submit();
            }
        }

        requestAnimationFrame(checkFrame); // Keep scanning
    }

    requestAnimationFrame(checkFrame); // Start scanning
}

// Handle logout functionality
document.querySelector('.logout').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = 'index.html';
});
