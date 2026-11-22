
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');

const formHeading = document.getElementById('form-heading');
const formDescription = document.getElementById('form-description');
const authMessage = document.getElementById('auth-message');

const accountSection = document.getElementById('account-section');
const accountName = document.getElementById('account-name');
const logoutButton = document.getElementById('logout-button');

const API_URL = 'http://localhost:3000/api/auth';

function showLogin() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');

    loginTab.classList.add('active');
    registerTab.classList.remove('active');

    formHeading.textContent = 'Welcome Back!';
    formDescription.textContent = 'Login to access your study resources.';
    authMessage.textContent = '';
}

function showRegister() {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');

    registerTab.classList.add('active');
    loginTab.classList.remove('active');

    formHeading.textContent = 'Create Your Account';
    formDescription.textContent = 'Join the IntellectDeck student community.';
    authMessage.textContent = '';
}

loginTab.addEventListener('click', showLogin);
registerTab.addEventListener('click', showRegister);


// Registration
registerForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        authMessage.textContent = 'Passwords do not match.';
        return;
    }

    if (password.length < 8) {
        authMessage.textContent = 'Password must contain at least 8 characters.';
        return;
    }

    authMessage.textContent = 'Creating your account...';

    try {
        const response = await fetch(API_URL + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Registration failed.');
        }

        registerForm.reset();
        showLogin();
        authMessage.textContent = 'Account created successfully! You can now log in.';

    } catch (error) {
        console.error('Registration error:', error);
        authMessage.textContent = error.message;
    }
});


// Login
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    authMessage.textContent = 'Logging in...';

    try {
        const response = await fetch(API_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login failed.');
        }

        localStorage.setItem('intellectdeckToken', result.token);
        localStorage.setItem('intellectdeckUser', JSON.stringify(result.user));

        loginForm.reset();
        showAccount(result.user);

    } catch (error) {
        console.error('Login error:', error);
        authMessage.textContent = error.message;
    }
});


// Display logged-in account
function showAccount(user) {
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');

    document.querySelector('.auth-tabs').classList.add('hidden');

    formHeading.textContent = 'Welcome to IntellectDeck!';
    formDescription.textContent = '';

    authMessage.textContent = '';

    accountName.textContent = user.name;
    accountSection.classList.remove('hidden');
}


// Logout
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('intellectdeckToken');
    localStorage.removeItem('intellectdeckUser');

    accountSection.classList.add('hidden');
    document.querySelector('.auth-tabs').classList.remove('hidden');

    showLogin();
    authMessage.textContent = 'You have logged out successfully.';
});


// Check existing login
function checkLogin() {
    const savedUser = localStorage.getItem('intellectdeckUser');
    const savedToken = localStorage.getItem('intellectdeckToken');

    if (savedUser && savedToken) {
        try {
            showAccount(JSON.parse(savedUser));
        } catch (error) {
            localStorage.removeItem('intellectdeckUser');
            localStorage.removeItem('intellectdeckToken');
        }
    }
}

checkLogin();
