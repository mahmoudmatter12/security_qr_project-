function validateLogin() {
    // Get the values of username and password input fields
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Check if the username and password are both "admin"
    if (username === 'admin' && password === 'admin') {
        // If valid, redirect to another page (for example, 'dashboard.html')
        window.location.href = 'scanner.html';  // Change this to your desired page
    } else {
        // If invalid, show an error message
        errorMessage.style.display = 'block';
    }
}
window.onload = function() {
    setTimeout(function() {
        document.querySelector('.loading-screen').style.display = 'none'; // Hide loading screen
        document.querySelector('.login-page').style.display = 'flex'; // Show login form
    }, 3000); // 3000 milliseconds = 3 seconds
};