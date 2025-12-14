const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .color-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid #cbd5e1;
      cursor: pointer;
      box-sizing: border-box;
    }
  </style>
`;

class ProductColors extends HTMLElement {
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
            .map((c) => c.trim())
            .filter((c) => c);

        const existingDots = this.shadowRoot.querySelectorAll('.color-dot');
        existingDots.forEach((d) => d.remove());

        items.forEach((color) => {
            const dot = document.createElement('div');
            dot.className = 'color-dot';
            dot.style.background = color;
            dot.title = color;
            this.shadowRoot.appendChild(dot);
        });
    }
}

customElements.define('product-colors', ProductColors);
