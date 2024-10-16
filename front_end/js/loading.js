window.onload = function() {
    setTimeout(function() {
        document.querySelector('.loading-screen').style.display = 'none'; // Hide loading screen
        document.querySelector('.login-page').style.display = 'flex'; // Show login form
    }, 3000); // 3000 milliseconds = 3 seconds
};