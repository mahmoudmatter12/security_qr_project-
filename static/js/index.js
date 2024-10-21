function LoadUsers() {
    return fetch('/users.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const users = data.split('\n').map(row => {
                const [username, password] = row.split(',');
                if (username && password) {
                    return { username: username.trim(), password: password.trim() };
                }
                return null;
            }).filter(user => user !== null);
            // console.log('Loaded users:', users);
            return users; // Return the users array
           
        })
        .catch(error => {
            console.error('Error loading users:', error);
            return []; // Return an empty array in case of error
        });
}

function validateLogin() {
    // Get the values of username and password input fields
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Hide the error message before re-checking
    errorMessage.classList.remove('show');
    errorMessage.style.display = 'none'; // Ensure it is hidden initially

    // Load users and validate the login credentials
    LoadUsers().then(users => {
        const user = users.find(user => user.username === username);
        if (user && user.password === password) {
            // If valid, redirect to another page
            window.location.href = 'scanner.html';  // Change this to your desired page
        } else {
            // If invalid, show the error message
            showErrorMessage();
        }
    }).catch(error => {
        console.error('Error during login validation:', error);
        showErrorMessage();
    });
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
    // Simulate loading screen
    LoadUsers();
    setTimeout(function () {
        document.querySelector('.loading-screen').style.display = 'none'; // Hide loading screen
        document.querySelector('.login-page').style.display = 'flex'; // Show login form
    }, 1500); // 1500 milliseconds = 1.5 seconds
};