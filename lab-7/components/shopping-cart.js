const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .cart {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      position: sticky;
      top: 2rem;
    }
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e2e8f0;
    }
    .cart-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .cart-count {
      background-color: #0f172a;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
      max-height: 400px;
      overflow-y: auto;
    }
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background-color: #f8fafc;
      border-radius: 8px;
      gap: 0.5rem;
    }
    .item-info {
      flex: 1;
      min-width: 0;
    }
    .item-name {
      font-weight: 500;
      color: #1e293b;
      font-size: 0.875rem;
      margin: 0 0 0.25rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item-price {
      color: #64748b;
      font-size: 0.875rem;
    }
    .remove-btn {
      background-color: transparent;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.2s;
      flex-shrink: 0;
    }
    .remove-btn:hover {
      background-color: #fee2e2;
    }
    .cart-empty {
      text-align: center;
      color: #94a3b8;
      padding: 2rem 1rem;
      font-size: 0.875rem;
    }
    .cart-summary {
      border-top: 2px solid #e2e8f0;
      padding-top: 1rem;
    }
    .cart-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.125rem;
      font-weight: 700;
      color: #0f172a;
    }
  </style>

  <div class="cart">
    <div class="cart-header">
      <h2 class="cart-title">Koszyk</h2>
      <div class="cart-count">0</div>
    </div>
    
    <div class="cart-items"></div>
    
    <div class="cart-summary">
      <div class="cart-total">
        <span>Suma:</span>
        <span class="total-amount">0.00 PLN</span>
      </div>
    </div>
  </div>
`;

class ShoppingCart extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        this._items = [];
    }

    connectedCallback() {
        this.render();
    }

    addItem(product) {
        this._items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            uniqueId: Date.now() + Math.random(),
        });
        this.render();
    }

    removeItem(uniqueId) {
        this._items = this._items.filter((item) => item.uniqueId !== uniqueId);
        this.render();
    }

    render() {
        const itemsContainer = this.shadowRoot.querySelector('.cart-items');
        const countElement = this.shadowRoot.querySelector('.cart-count');
        const totalElement = this.shadowRoot.querySelector('.total-amount');

        countElement.textContent = this._items.length;

        if (this._items.length === 0) {
            itemsContainer.innerHTML =
                '<div class="cart-empty">Koszyk jest pusty</div>';
            totalElement.textContent = '0.00 PLN';
            return;
        }

        itemsContainer.innerHTML = '';
        let total = 0;

        this._items.forEach((item) => {
            total += item.price;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price.toFixed(2)} PLN</div>
                </div>
                <button class="remove-btn" data-id="${
                    item.uniqueId
                }">Usuń</button>
            `;

            const removeBtn = itemEl.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () =>
                this.removeItem(item.uniqueId)
            );

            itemsContainer.appendChild(itemEl);
        });

        totalElement.textContent = `${total.toFixed(2)} PLN`;
    }
}

customElements.define('shopping-cart', ShoppingCart);
