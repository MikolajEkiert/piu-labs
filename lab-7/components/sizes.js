const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .size-badge {
      font-size: 0.75rem;
      padding: 2px 6px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      color: #64748b;
      cursor: pointer;
      font-family: system-ui, -apple-system, sans-serif;
      background: transparent;
      display: inline-block;
    }
    .size-badge:hover {
      border-color: #0f172a;
      color: #0f172a;
    }
  </style>
`;

class ProductSizes extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['items'];
    }

    attributeChangedCallback() {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const items = (this.getAttribute('items') || '')
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s);

        const container = this.shadowRoot.querySelector('style').nextSibling;
        const existingBadges = this.shadowRoot.querySelectorAll('.size-badge');
        existingBadges.forEach((b) => b.remove());

        items.forEach((size) => {
            const badge = document.createElement('span');
            badge.className = 'size-badge';
            badge.textContent = size;
            this.shadowRoot.appendChild(badge);
        });
    }
}

customElements.define('product-sizes', ProductSizes);
