(function () {
    const STORAGE_KEY = 'piu-kanban-v1';
    const columnsOrder = ['todo', 'in-progress', 'done'];

    function defaultState() {
        return {
            todo: [],
            'in-progress': [],
            done: [],
        };
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultState();
            const parsed = JSON.parse(raw);
            return Object.assign(defaultState(), parsed);
        } catch (e) {
            console.error('Failed to load state', e);
            return defaultState();
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save state', e);
        }
    }

    function uid() {
        return (
            Date.now().toString(36) +
            '-' +
            Math.random().toString(36).slice(2, 8)
        );
    }

    function randomColor() {
        const h = Math.floor(Math.random() * 360);
        const s = 60 + Math.floor(Math.random() * 20);
        const l = 72 - Math.floor(Math.random() * 12);
        return `hsl(${h} ${s}% ${l}%)`;
    }

    function makeCard(title = '') {
        return {
            id: uid(),
            title: title || 'Nowa karta',
            color: randomColor(),
        };
    }

    function q(sel, ctx = document) {
        return ctx.querySelector(sel);
    }
    function qa(sel, ctx = document) {
        return Array.from(ctx.querySelectorAll(sel));
    }

    const boardEl = q('#kanban-board');
    let state = loadState();

    function render() {
        columnsOrder.forEach((cid) => {
            renderColumn(cid);
        });
        saveState(state);
    }

    function renderColumn(columnId) {
        const section = q(`#${columnId}`);
        if (!section) return;
        const container = q('.cards-container', section);
        container.innerHTML = '';
        const cards = state[columnId] || [];
        cards.forEach((card) => {
            container.appendChild(createCardElement(card));
        });
        const countEl =
            q('.card-count .count', section) || q('.card-count', section);
        if (countEl) {
            const span = q('.card-count .count', section);
            if (span) span.textContent = String(cards.length);
            else
                q(
                    '.card-count',
                    section
                ).textContent = `Liczba Kart: ${cards.length}`;
        }
    }

    function findCard(columnId, cardId) {
        const arr = state[columnId] || [];
        const idx = arr.findIndex((c) => c.id === cardId);
        return { idx, card: arr[idx] };
    }

    function createCardElement(card) {
        const el = document.createElement('div');
        el.className = 'card';
        el.dataset.id = card.id;
        el.style.background = card.color || 'white';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove';
        removeBtn.title = 'Usuń kartę';
        removeBtn.textContent = '✕';
        el.appendChild(removeBtn);

        const title = document.createElement('div');
        title.className = 'card-title';
        title.contentEditable = 'true';
        title.spellcheck = false;
        title.textContent = card.title || '';
        el.appendChild(title);

        const controls = document.createElement('div');
        controls.className = 'card-controls';

        const moveLeft = document.createElement('button');
        moveLeft.className = 'move-left';
        moveLeft.title = 'Przenieś w lewo';
        moveLeft.textContent = '←';
        controls.appendChild(moveLeft);

        const moveRight = document.createElement('button');
        moveRight.className = 'move-right';
        moveRight.title = 'Przenieś w prawo';
        moveRight.textContent = '→';
        controls.appendChild(moveRight);

        const colorBtn = document.createElement('button');
        colorBtn.className = 'color-card';
        colorBtn.title = 'Zmień kolor karty';
        colorBtn.textContent = 'Zmień kolor';
        controls.appendChild(colorBtn);

        el.appendChild(controls);

        return el;
    }

    function findCardLocation(cardId) {
        for (const cid of columnsOrder) {
            const idx = (state[cid] || []).findIndex((c) => c.id === cardId);
            if (idx !== -1) return { columnId: cid, idx };
        }
        return null;
    }

    function attachColumnHandlers() {
        columnsOrder.forEach((cid) => {
            const section = q(`#${cid}`);
            if (!section) return;

            section.addEventListener('click', (e) => {
                const target = e.target;
                if (target.closest('.add-card-button')) {
                    const card = makeCard('');
                    state[cid] = state[cid] || [];
                    state[cid].push(card);
                    renderColumn(cid);
                    requestAnimationFrame(() => {
                        const cont = q(`#${cid} .cards-container`);
                        const last = cont.lastElementChild;
                        if (last) {
                            const title = q('.card-title', last);
                            if (title) {
                                title.focus();
                                document
                                    .getSelection()
                                    .collapse(title.lastChild || title, 1);
                            }
                        }
                    });
                    saveState(state);
                    return;
                }

                if (target.closest('.colorize-column-button')) {
                    const newColor = randomColor();
                    state[cid] = (state[cid] || []).map((c) => ({
                        ...c,
                        color: newColor,
                    }));
                    renderColumn(cid);
                    saveState(state);
                    return;
                }

                if (target.closest('.sort-column-button')) {
                    state[cid] = (state[cid] || [])
                        .slice()
                        .sort((a, b) =>
                            (a.title || '').localeCompare(b.title || '', 'pl')
                        );
                    renderColumn(cid);
                    saveState(state);
                    return;
                }

                const cardEl = target.closest('.card');
                if (!cardEl) return;
                const cardId = cardEl.dataset.id;

                if (target.classList.contains('remove')) {
                    const loc = findCardLocation(cardId);
                    if (loc) {
                        state[loc.columnId].splice(loc.idx, 1);
                        renderColumn(loc.columnId);
                        saveState(state);
                    }
                    return;
                }

                if (target.classList.contains('move-left')) {
                    const loc = findCardLocation(cardId);
                    if (loc) {
                        const curIdx = columnsOrder.indexOf(loc.columnId);
                        const toIdx = Math.max(0, curIdx - 1);
                        const targetColumn = columnsOrder[toIdx];
                        if (targetColumn !== loc.columnId) {
                            const [cardObj] = state[loc.columnId].splice(
                                loc.idx,
                                1
                            );
                            state[targetColumn] = state[targetColumn] || [];
                            state[targetColumn].push(cardObj);
                            render();
                        }
                        saveState(state);
                    }
                    return;
                }

                if (target.classList.contains('move-right')) {
                    const loc = findCardLocation(cardId);
                    if (loc) {
                        const curIdx = columnsOrder.indexOf(loc.columnId);
                        const toIdx = Math.min(
                            columnsOrder.length - 1,
                            curIdx + 1
                        );
                        const targetColumn = columnsOrder[toIdx];
                        if (targetColumn !== loc.columnId) {
                            const [cardObj] = state[loc.columnId].splice(
                                loc.idx,
                                1
                            );
                            state[targetColumn] = state[targetColumn] || [];
                            state[targetColumn].push(cardObj);
                            render();
                        }
                        saveState(state);
                    }
                    return;
                }

                if (target.classList.contains('color-card')) {
                    const loc = findCardLocation(cardId);
                    if (loc) {
                        state[loc.columnId][loc.idx].color = randomColor();
                        renderColumn(loc.columnId);
                        saveState(state);
                    }
                    return;
                }
            });

            section.addEventListener('input', (e) => {
                const target = e.target;
                if (!target.classList.contains('card-title')) return;
                const cardEl = target.closest('.card');
                if (!cardEl) return;
                const cardId = cardEl.dataset.id;
                const loc = findCardLocation(cardId);
                if (loc) {
                    state[loc.columnId][loc.idx].title =
                        target.textContent.trim();
                    saveState(state);
                }
            });
        });
    }

    function init() {
        let wasEmpty = true;
        for (const k of columnsOrder)
            if ((state[k] || []).length) wasEmpty = false;
        if (wasEmpty) {
            state.todo.push(makeCard('Nowa karta'));
        }

        attachColumnHandlers();
        render();
    }

    window.__piuKanban = { loadState, saveState, state };

    init();
})();
