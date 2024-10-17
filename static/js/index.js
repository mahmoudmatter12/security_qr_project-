function validateLogin() {
    // Get the values of username and password input fields
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Hide the error message before re-checking
    errorMessage.classList.remove('show');
    errorMessage.style.display = 'none'; // Ensure it is hidden initially

    // Check if the username and password are both "admin"
    if (username === 'admin' && password === 'admin') {
        // If valid, redirect to another page
        window.location.href = 'scanner.html';  // Change this to your desired page
    } else {
        // If invalid, show the error message
        showErrorMessage();
    }
}

function showErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';  // Make sure it is visible
    errorMessage.style.position = 'absolute'; // Make it floating
    errorMessage.style.bottom = '10px'; // Position it 10px from the bottom of the button
    errorMessage.style.left = '50%'; // Center it horizontally
    errorMessage.style.transform = 'translateX(-50%)'; // Adjust for centering
    setTimeout(() => {
        errorMessage.classList.add('show'); // Add the class with animation
    }, 10); // Delay to ensure transition works after display is set to block
}

function hideErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    errorMessage.classList.remove('show'); // Remove the class for hiding
    setTimeout(() => {
        errorMessage.style.display = 'none';  // Hide it after the animation
    }, 500); // Wait for the animation to finish before hiding
}


window.onload = function () {
    setTimeout(function () {
        document.querySelector('.loading-screen').style.display = 'none'; // Hide loading screen
        document.querySelector('.login-page').style.display = 'flex'; // Show login form
    }, 3000); // 3000 milliseconds = 3 seconds
};