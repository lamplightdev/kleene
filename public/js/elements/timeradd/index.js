const template = require('./template');

class ChronoTimerAdd extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }

        * {
          box-sizing: border-box;
        }
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this._state = {};

    this.onAdd = this.onAdd.bind(this);
    this.onReset = this.onReset.bind(this);

  }

  connectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#add').addEventListener('submit', this.onAdd);
    root.querySelector('form#add').addEventListener('chrono:formsubmit', this.onAdd);
    root.querySelector('form#reset').addEventListener('submit', this.onReset);
    root.querySelector('form#reset').addEventListener('chrono:formsubmit', this.onReset);
  }

  disconnectedCallback() {
    const root = this.shadowRoot;

    root.querySelector('form#add').removeEventListener('submit', this.onAdd);
    root.querySelector('form#add').removeEventListener('chrono:formsubmit', this.onAdd);
    root.querySelector('form#reset').removeEventListener('submit', this.onReset);
    root.querySelector('form#reset').removeEventListener('chrono:formsubmit', this.onReset);
  }

  onAdd(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timeradd', {
      detail: Date.now(),
      bubbles: true,
      composed: true,
    }));
  }

  onReset(event) {
    event.preventDefault();

    this.dispatchEvent(new CustomEvent('state:timerreset', {
      bubbles: true,
      composed: true,
    }));
  }
}

window.customElements.define('chrono-timeradd', ChronoTimerAdd);
