import createStore from './store.js';
import { initUI } from './ui.js';
const store = createStore();
initUI(store);