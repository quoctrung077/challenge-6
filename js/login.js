const ENDPOINT = 'https://crudnodejs-production.up.railway.app/api';

$(document).ready(function () {
    const container = $('#login-compoment');
    const registerBtn = $('#register');
    const loginBtn = $('#login');

    registerBtn.on('click', () => {
        container.addClass("active");
    });

    loginBtn.on('click', () => {
        container.removeClass("active");
    });
});

async function handleFormSubmit(event, action) {
    event.preventDefault();

    const usernameInput = document.getElementById('signup-username');
    const emailInput = action === 'signup' ? document.getElementById('signup-email') : document.getElementById('signin-email');
    const passwordInput = action === 'signup' ? document.getElementById('signup-password') : document.getElementById('signin-password');
    const submitButton = event.target.querySelector('button');

    clearInputErrors([usernameInput, emailInput, passwordInput]);

    let hasError = false;

    if (action === 'signup') {
        hasError = [
            !validateUsername(usernameInput.value.trim()) && showInputError(usernameInput),
            !validateEmail(emailInput.value.trim()) && showInputError(emailInput),
            !validatePassword(passwordInput.value.trim()) && showInputError(passwordInput)
        ].some(Boolean);
    } else if (action === 'signin') {
        hasError = [
            !validateEmail(emailInput.value.trim()) && showInputError(emailInput),
            !validatePassword(passwordInput.value.trim()) && showInputError(passwordInput)
        ].some(Boolean);
    }

    if (hasError) {
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
        const bodyData = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim(),
        };

        if (action === 'signup') {
            bodyData.username = usernameInput.value.trim();
        }

        const response = await fetch(`${ENDPOINT}/users/${action === 'signup' ? 'register' : 'login'}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });

        const result = await response.json();

        if (action === 'signup') {
            if (response.status === 409) {
                showInputError(usernameInput);
                showInputError(emailInput);
                alert('Tên người dùng hoặc email đã tồn tại.');
            } else if (response.ok) {
                document.getElementById('login').click();
            }
        } else if (action === 'signin') {
            if (response.ok) {
                alert('Đăng nhập thành công!');
                window.location.href = '#';
            } else {
                showInputError(emailInput);
                showInputError(passwordInput);
                alert('Email hoặc mật khẩu không chính xác.');
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = action === 'signup' ? 'Register' : 'Sign In';
    }
}


function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{6,}$/;
    return passwordRegex.test(password);
}

function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    return usernameRegex.test(username);
}

function showInputError(input) {
    input.style.border = '1px solid red';
}

function clearInputErrors(inputs) {
    inputs.forEach(input => input.style.border = 'none');
}

document.getElementById('signup-form').addEventListener('submit', (event) => handleFormSubmit(event, 'signup'));

document.getElementById('signin-form').addEventListener('submit', (event) => handleFormSubmit(event, 'signin'));
