import productsData from '../data.json' with { type: 'json' };

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
  </style>

  <div class="product-grid"></div>
`;

class ProductList extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const grid = this.shadowRoot.querySelector('.product-grid');
        
        productsData.forEach(product => {
            const card = document.createElement('product-card');
            card.product = product;
            grid.appendChild(card);
        });
    }
}

customElements.define('product-list', ProductList);
