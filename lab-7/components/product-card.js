class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
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
        ::slotted(img) {
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
        }
        ::slotted([slot="promo"]) {
          background-color: #ef4444;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
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
        .title-slot {
          font-weight: 600;
          font-size: 1.1rem;
          color: #1e293b;
          margin: 0;
        }
        ::slotted([slot="name"]) {
          margin: 0;
          font-size: inherit;
        }
        .price-slot {
          font-weight: 700;
          color: #0f172a;
          font-size: 1.1rem;
        }
        .options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: auto;
        }
        .option-group {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: #64748b;
        }
        ::slotted([slot="colors"]), ::slotted([slot="sizes"]) {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
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
          <slot name="image"></slot>
          <div class="promo-badge">
            <slot name="promo"></slot>
          </div>
        </div>
        
        <div class="content">
          <div class="header">
            <div class="title-slot">
              <slot name="name">Produkt</slot>
            </div>
            <div class="price-slot">
              <slot name="price"></slot>
            </div>
          </div>

          <div class="options">
            <div class="option-group">
              <slot name="colors"></slot>
            </div>
            <div class="option-group">
              <slot name="sizes"></slot>
            </div>
          </div>

          <button class="add-btn">Do koszyka</button>
        </div>
      </div>
    `;
    }
}

customElements.define('product-card', ProductCard);
