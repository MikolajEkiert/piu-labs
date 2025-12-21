const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #64748b;
      font-size: 1rem;
    }
  </style>

  <div class="product-grid">
    <div class="loading">Ładowanie produktów...</div>
  </div>
`;

class ProductList extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const response = await fetch('./data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const productsData = await response.json();
            console.log('Załadowano produkty:', productsData);
            this.render(productsData);
        } catch (error) {
            console.error('Błąd ładowania produktów:', error);
            const grid = this.shadowRoot.querySelector('.product-grid');
            grid.innerHTML = `<div class="loading">Błąd ładowania produktów: ${error.message}</div>`;
        }
    }

    render(productsData) {
        const grid = this.shadowRoot.querySelector('.product-grid');
        grid.innerHTML = '';

        productsData.forEach((product) => {
            const card = document.createElement('product-card');
            card.product = product;
            grid.appendChild(card);
        });
    }
}

customElements.define('product-list', ProductList);
