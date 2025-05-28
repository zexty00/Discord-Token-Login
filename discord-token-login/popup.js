document.getElementById('loginButton').addEventListener('click', () => {
    const token = document.getElementById('tokenInput').value;

    if (!token) {
        showNotification('Wprowadź token!', 'error', 3000);
        return;
    }

    fetch('https://discord.com/api/v9/users/@me', {
        headers: {
            Authorization: token
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Zalogowano pomyślnie!', 'success', 3000);
        } else {
            showNotification('Podczas logowania wystąpił błąd. Sprawdź token.', 'error', 3000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Wystąpił błąd podczas logowania. Spróbuj ponownie.', 'error', 3000);
    });
});

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 400);
    });
});

let notificationTimeout;

function showNotification(message, type = 'success', displayTime = 3000) {
    const notification = document.getElementById('notification');

    clearTimeout(notificationTimeout);

    notification.classList.remove('success', 'error');

    notification.classList.add(type);

    notification.classList.remove('show');
    notification.classList.add('hidden');

    setTimeout(() => {
        notification.textContent = message;
        notification.classList.remove('hidden');
        notification.classList.add('show');

        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hidden');
        }, displayTime);
    }, 300);
}

const tokenList = document.getElementById('tokenList');
const modal = document.getElementById('modal');
const confirmDeleteButton = document.getElementById('confirmDeleteButton');
const cancelDeleteButton = document.getElementById('cancelDeleteButton');
let tokenToDelete = null;

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
        }
    }
    return null;
}

const saveTokenButton = document.getElementById('saveTokenButton');
saveTokenButton.addEventListener('click', () => {
    const tokenInput = document.getElementById('saveTokenInput').value;
    if (!tokenInput) {
        showNotification('Wprowadź token do zapisania!', 'error', 3000);
        return;
    }

    const existingTokens = getCookie('tokens') ? JSON.parse(getCookie('tokens')) : [];
    existingTokens.push(tokenInput);
    setCookie('tokens', JSON.stringify(existingTokens), 7);

    const listItem = document.createElement('li');
    listItem.textContent = tokenInput;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => {
        tokenToDelete = listItem;
        modal.classList.remove('hidden');
    });

    listItem.appendChild(deleteButton);
    tokenList.appendChild(listItem);

    showNotification('Token zapisany!', 'success', 3000);
});

confirmDeleteButton.addEventListener('click', () => {
    if (tokenToDelete) {
        const tokenText = tokenToDelete.textContent.replace('X', '').trim();
        tokenList.removeChild(tokenToDelete);

        const existingTokens = getCookie('tokens') ? JSON.parse(getCookie('tokens')) : [];
        const updatedTokens = existingTokens.filter(token => token !== tokenText);
        setCookie('tokens', JSON.stringify(updatedTokens), 7);

        tokenToDelete = null;
        modal.classList.add('hidden');
        showNotification('Token usunięty!', 'success', 3000);
    }
});

cancelDeleteButton.addEventListener('click', () => {
    tokenToDelete = null;
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        tokenToDelete = null;
        modal.classList.add('hidden');
    }
});

document.getElementById('tokenList').addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'LI') {
        const tokenInput = document.getElementById('tokenInput');
        tokenInput.value = e.target.textContent.replace('X', '').trim();
    }
});

window.addEventListener('load', () => {
    const savedTokens = getCookie('tokens') ? JSON.parse(getCookie('tokens')) : [];
    savedTokens.forEach(token => {
        const listItem = document.createElement('li');
        listItem.textContent = token;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => {
            tokenToDelete = listItem;
            modal.classList.remove('hidden');
        });

        listItem.appendChild(deleteButton);
        tokenList.appendChild(listItem);
    });
});