const template = require('./template');

class KleeneTimers extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.innerHTML = `
      <style>
        :host {
        }
      </style>

      <template>
        ${template()}
      </template>
    `;

    const templateContent = this.shadowRoot.querySelector('template');
    const instance = templateContent.content.cloneNode(true);
    this.shadowRoot.appendChild(instance);

    this._state = [];
    this._stateString = JSON.stringify(this._state);
  }

  static get observedAttributes() {
    return ['state'];
  }

  get state() {
    const jsonString = this.getAttribute('state');

    return jsonString ? JSON.parse(jsonString) : [];
  }

  set state(state) {
    this.setAttribute('state', JSON.stringify(state));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'state':
        if (this._stateString !== newValue) {
          this._stateString = newValue;

          const newState = this._stateString ? JSON.parse(this._stateString) : [];

          newState.forEach((newTimer) => {
            if (!this._state.some(existingTimer => existingTimer.start === newTimer.start)) {
              this.addTimer(newTimer);
            } else {
              this.editTimer(newTimer);
            }
          });

          this._state.forEach((existingTimer) => {
            if (!newState.some(newTimer => newTimer.start === existingTimer.start)) {
              this.deleteTimer(existingTimer);
            }
          });

          this._state = newState;
        }
        break;
      default:
        break;
    }
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  addTimer(timer) {
    const kleeneTimer = document.createElement('kleene-timer');
    kleeneTimer.setAttribute('state', JSON.stringify(timer));
    this.shadowRoot.querySelector('#timers').appendChild(kleeneTimer);
  }

  editTimer(timer) {
    const component = this.shadowRoot.querySelector(`kleene-timer[stateid='${timer.id}']`);
    component.setAttribute('state', JSON.stringify(timer));
  }

  deleteTimer(timer) {

  }
}

window.customElements.define('kleene-timers', KleeneTimers);