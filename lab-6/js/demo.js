const btnFetch = document.getElementById('btn-fetch');
const btnError = document.getElementById('btn-error');
const btnReset = document.getElementById('btn-reset');
const listEl = document.getElementById('list');
const loader = document.getElementById('loader');
const messageEl = document.getElementById('message');

const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
});

function showLoader(on) {
    if (on) loader.classList.add('active');
    else loader.classList.remove('active');
}

function showMessage(msg, isError) {
    messageEl.textContent = msg || '';
    messageEl.style.color = isError ? '#b91c1c' : '';
}

function renderItems(items) {
    listEl.innerHTML = '';
    if (!items || items.length === 0) return;
    items.slice(0, 12).forEach((it) => {
        const li = document.createElement('li');
        li.textContent = it.title || it.name || JSON.stringify(it);
        const meta = document.createElement('small');
        meta.textContent = `id: ${it.id}`;
        li.appendChild(meta);
        listEl.appendChild(li);
    });
}

btnFetch.addEventListener('click', async () => {
    showMessage('');
    showLoader(true);
    try {
        const data = await api.get('/posts');
        renderItems(data);
        showMessage(
            `Pobrano ${Array.isArray(data) ? data.length : 0} elementów`
        );
    } catch (err) {
        renderItems([]);
        showMessage(`Błąd: ${formatError(err, 'GET')}`, true);
    } finally {
        showLoader(false);
    }
});

btnError.addEventListener('click', async () => {
    renderItems([]);
    showMessage('');
    showLoader(true);
    try {
        await api.get('/invalid-endpoint');
    } catch (err) {
        showMessage(`Błąd: ${formatError(err, 'GET')}`, true);
    } finally {
        showLoader(false);
    }
});

function formatError(err, method) {
    const code =
        (err &&
            (err.status ||
                (err.message &&
                    (err.message.match(/HTTP (\d{3})/) || [])[1]))) ||
        'n/a';
    const message =
        err && (err.body || err.message)
            ? err.body || err.message
            : String(err);
    return `kod:${code}, metoda:${method}, dane:${message}`;
}

btnReset.addEventListener('click', () => {
    renderItems([]);
    showMessage('');
});
