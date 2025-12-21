const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .image-container {
      position: relative;
      width: 100%;
      padding-top: 125%;
      background-color: #f1f5f9;
    }
    .image-container img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .promo-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 1;
      background-color: #ef4444;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
    }
    .promo-badge:empty {
      display: none;
    }
    .content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 12px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }
    .product-name {
      font-weight: 600;
      font-size: 1.1rem;
      color: #1e293b;
      margin: 0;
    }
    .price {
      font-weight: 700;
      color: #0f172a;
      font-size: 1.1rem;
      white-space: nowrap;
    }
    .original-price {
      color: #94a3b8;
      font-size: 0.9em;
      margin-right: 4px;
      text-decoration: line-through;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: auto;
    }
    .add-btn {
      width: 100%;
      background-color: #0f172a;
      color: white;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-top: 12px;
    }
    .add-btn:hover {
      background-color: #334155;
    }
  </style>

  <div class="card">
    <div class="image-container">
      <img class="product-image" src="" alt="" />
      <div class="promo-badge"></div>
    </div>
    
    <div class="content">
      <div class="header">
        <div class="product-name"></div>
        <div class="price"></div>
      </div>

      <div class="options">
        <product-colors></product-colors>
        <product-sizes></product-sizes>
      </div>

      <button class="add-btn">Do koszyka</button>
    </div>
  </div>
`;

class ProductCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        this._product = null;
    }

    set product(data) {
        this._product = data;
        this.render();
    }

    get product() {
        return this._product;
    }

    connectedCallback() {
        const button = this.shadowRoot.querySelector('.add-btn');
        button.addEventListener('click', () => this.handleAddToCart());
    }

    handleAddToCart() {
        if (!this._product) return;

        this.dispatchEvent(
            new CustomEvent('add-to-cart', {
                detail: {
                    id: this._product.id,
                    name: this._product.name,
                    price: this._product.price,
                },
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        if (!this._product) return;

        const img = this.shadowRoot.querySelector('.product-image');
        const promo = this.shadowRoot.querySelector('.promo-badge');
        const name = this.shadowRoot.querySelector('.product-name');
        const price = this.shadowRoot.querySelector('.price');
        const colors = this.shadowRoot.querySelector('product-colors');
        const sizes = this.shadowRoot.querySelector('product-sizes');

        img.src = this._product.image;
        img.alt = this._product.name;
        promo.textContent = this._product.promo || '';
        name.textContent = this._product.name;

        if (this._product.originalPrice) {
            price.innerHTML = `<span class="original-price">${this._product.originalPrice}</span>${this._product.price} PLN`;
        } else {
            price.textContent = `${this._product.price} PLN`;
        }

        if (this._product.colors) {
            colors.setAttribute('items', this._product.colors.join(', '));
        }

        if (this._product.sizes) {
            sizes.setAttribute('items', this._product.sizes.join(', '));
        }
    }
}

customElements.define('product-card', ProductCard);
