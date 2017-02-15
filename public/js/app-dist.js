/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

eval("const style = __webpack_require__(24);\nconst template = __webpack_require__(25);\n\nclass ChronoTimer extends HTMLElement {\n  constructor() {\n    super();\n\n    this.attachShadow({ mode: 'open' });\n\n    this.initShadowRoot();\n\n    const templateContent = this.shadowRoot.querySelector('template');\n    const instance = templateContent.content.cloneNode(true);\n    this.shadowRoot.appendChild(instance);\n\n    this.animation = null;\n    this._lastElapsed = 0;\n    this._resolution = 100;\n\n    this.pause = this.pause.bind(this);\n    this.increment = this.increment.bind(this);\n  }\n\n  initShadowRoot() {\n    this.shadowRoot.innerHTML = `\n      <style>\n        ${style()}\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  get state() {\n    const jsonString = this.getAttribute('state');\n\n    return jsonString ? JSON.parse(jsonString) : {\n      id: false,\n      start: false,\n      end: false,\n      splits: [],\n    };\n  }\n\n  set state(state) {\n    this.setAttribute('state', JSON.stringify(state));\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state':\n        this.update(JSON.parse(newValue));\n        break;\n      default:\n        break;\n    }\n  }\n\n  connectedCallback() {\n    const formPause = this.shadowRoot.querySelector('form#pause');\n    formPause.addEventListener('submit', this.pause);\n    formPause.addEventListener('chrono:buttonclick', this.pause);\n\n    this.animation = window.requestAnimationFrame(this.increment);\n  }\n\n  disconnectedCallback() {\n    const formPause = this.shadowRoot.querySelector('form#pause');\n    formPause.removeEventListener('submit', this.pause);\n    formPause.removeEventListener('chrono:buttonclick', this.pause);\n\n    window.cancelAnimationFrame(this.animation);\n  }\n\n  update(timer) {\n    let elapsed = 0;\n\n    if (timer.end) {\n      elapsed = timer.end - timer.start;\n    } else if (timer.paused) {\n      elapsed = timer.paused;\n    } else {\n      elapsed = Date.now() - timer.start;\n    }\n\n    elapsed = Math.floor(elapsed / (1000 / this._resolution));\n    elapsed = elapsed.toString();\n    if (elapsed.length < 2) {\n      elapsed = `0${elapsed}`;\n    }\n    if (elapsed.length < 3) {\n      elapsed = `0${elapsed}`;\n    }\n    if (elapsed.length < 4) {\n      elapsed = `0${elapsed}`;\n    }\n\n    elapsed = `${elapsed.substring(0, 2)}:${elapsed.substring(2)}`;\n    this.shadowRoot.querySelector('#elapsed').textContent = elapsed;\n\n    const pauseButton = this.shadowRoot.querySelector('#pause chrono-button');\n    if (!this.state.paused) {\n      pauseButton.querySelector('#stop').classList.remove('hide');\n      pauseButton.querySelector('#start').classList.add('hide');\n\n      window.cancelAnimationFrame(this.animation);\n      this.animation = window.requestAnimationFrame(this.increment);\n    } else {\n      pauseButton.querySelector('#stop').classList.add('hide');\n      pauseButton.querySelector('#start').classList.remove('hide');\n\n      window.cancelAnimationFrame(this.animation);\n    }\n\n    this.setAttribute('stateid', timer.id);\n  }\n\n  pause(event) {\n    event.preventDefault();\n\n    this.dispatchEvent(new CustomEvent('state:timerpause', {\n      detail: {\n        id: this.state.id,\n        time: Date.now(),\n      },\n      bubbles: true,\n      composed: true,\n    }));\n  }\n\n  increment() {\n    const diff = Math.floor((Date.now() - this.state.start) / (1000 / this._resolution));\n\n    if (diff > this._lastElapsed) {\n      this.update(this.state);\n    }\n\n    this._lastElapsed = diff;\n    if (!this.state.end && !this.state.paused) {\n      this.animation = window.requestAnimationFrame(this.increment);\n    }\n  }\n}\n\nwindow.customElements.define('chrono-timer', ChronoTimer);\n\nmodule.exports = ChronoTimer;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timer/index.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timer/index.js?");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

eval("module.exports = (timer = {\n  id: false,\n  start: false,\n  end: false,\n  paused: false,\n  splits: [],\n}) => (`\n  <div class='container'>\n    <h1 id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</h1>\n    <div id='splits'>\n      ${[...timer.splits].reverse().map((split, splitIndex) => `<chrono-timersplit id='split-${splitIndex}' state='${JSON.stringify(split)}'></chrono-timersplit>`)}\n    </div>\n    <form id='pause'>\n      <chrono-button><span id='stop'>Stop</span><span id='start'>Start</span></chrono-button>\n    </form>\n    <form id='split' ${timer.paused ? 'hide' : ''}>\n      <chrono-button>Split</chrono-button>\n    </form>\n  </div>\n`);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timerfull/template.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timerfull/template.js?");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

eval("module.exports = (timer = {\n  id: false,\n  start: false,\n  end: false,\n  paused: false,\n  splits: [],\n}) => (`\n  <div id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</div>\n  <div id='actions'>\n    <form id='pause'>\n      <chrono-button><span id='stop'>Stop</span><span id='start'>Start</span></chrono-button>\n    </form>\n    <form id='remove'>\n      <chrono-button>Remove</chrono-button>\n    </form>\n  </div>\n`);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timerbrief/template.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timerbrief/template.js?");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

eval("const templateTimerBrief = __webpack_require__(2);\nconst templateTimerFull = __webpack_require__(1);\n\nmodule.exports = (timers = [], isFull = false) => (`\n  <div id='timers'>\n    ${[...timers].reverse().map(timer => (\n      isFull ? templateTimerFull(timer) : templateTimerBrief(timer)\n    )).join('')}\n  </div>\n`);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timers/template.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timers/template.js?");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

eval("const style = __webpack_require__(15);\nconst template = __webpack_require__(16);\n\nclass ChronoButton extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n\n    shadowRoot.innerHTML = `\n      <style>\n        ${style()}\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n\n    const templateContent = this.shadowRoot.querySelector('template');\n    const instance = templateContent.content.cloneNode(true);\n    this.shadowRoot.appendChild(instance);\n\n    this.onClick = this.onClick.bind(this);\n  }\n\n  connectedCallback() {\n    this.addEventListener('click', this.onClick);\n\n    if (this.hasAttribute('iscircle')) {\n      this.shadowRoot.querySelector('button').classList.add('circle');\n    }\n  }\n\n  disconnectedCallback() {\n    this.removeEventListener('click', this.onClick);\n  }\n\n  onClick(event) {\n    event.preventDefault();\n\n    if (this.parentElement.tagName === 'FORM') {\n      this.dispatchEvent(new CustomEvent('chrono:buttonclick', {\n        bubbles: true,\n        composed: true,\n      }));\n    }\n  }\n}\n\nwindow.customElements.define('chrono-button', ChronoButton);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/button/index.js\n// module id = 4\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/button/index.js?");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

eval("const template = __webpack_require__(18);\nconst style = __webpack_require__(17);\n\nclass ChronoNav extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n    shadowRoot.innerHTML = `\n      <style>\n        ${style()}\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n\n    const templateContent = this.shadowRoot.querySelector('template');\n    const instance = templateContent.content.cloneNode(true);\n    this.shadowRoot.appendChild(instance);\n\n    this.onClick = this.onClick.bind(this);\n\n    this._borderWidth = 0;\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  get state() {\n    const jsonString = this.getAttribute('state');\n\n    return jsonString ? JSON.parse(jsonString) : {};\n  }\n\n  set state(state) {\n    this.setAttribute('state', JSON.stringify(state));\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state': {\n        const oldState = oldValue ? JSON.parse(oldValue) : {};\n\n        let oldCurrentIndex = false;\n        if (oldState.routes) {\n          oldCurrentIndex = oldState.routes.findIndex(item => item.current);\n        }\n\n        const newState = newValue ? JSON.parse(newValue) : {};\n        const newCurrentIndex = newState.routes.findIndex(item => item.current);\n\n        const nav = this.shadowRoot.querySelector('nav');\n        const navElements = nav.querySelectorAll('a') || [];\n        const border = this.shadowRoot.querySelector('.border');\n\n        if (!oldValue || newState.routes.length !== oldState.routes.length) {\n          this._borderWidth = nav.offsetWidth / newState.routes.length;\n          border.style.width = `${this._borderWidth}px`;\n        }\n\n        const currentChanged = newCurrentIndex !== oldCurrentIndex;\n\n        newState.routes.forEach((item, index) => {\n          const existingItem = navElements[index];\n          if (existingItem) {\n            if (currentChanged) {\n              if (item.current) {\n                window.requestAnimationFrame(() => {\n                  existingItem.classList.add('current');\n                  existingItem.classList.add('hide');\n                  border.classList.add('show');\n\n                  window.requestAnimationFrame(() => {\n                    border.style.transform = `translate(${newCurrentIndex * this._borderWidth}px)`;\n                  });\n                });\n\n                border.addEventListener('transitionend', (event) => {\n                  existingItem.classList.remove('hide');\n                  border.classList.remove('show');\n                }, {\n                  once: true,\n                });\n              } else {\n                existingItem.classList.remove('current');\n              }\n            }\n\n            if (item.id === 'timers') {\n              existingItem.querySelector('span').textContent =\n                newState.timerCount ? newState.timerCount : '';\n\n              if (newState.timerCount) {\n                existingItem.classList.add('has-count');\n              } else {\n                existingItem.classList.remove('has-count');\n              }\n            }\n          } else {\n            const chronoNavItem = document.createElement('a');\n            chronoNavItem.setAttribute('href', item.path);\n\n            chronoNavItem.appendChild(document.createTextNode(item.title));\n\n            if (item.id === 'timers') {\n              const countElement = document.createElement('span');\n              countElement.textContent = newState.timerCount ? newState.timerCount : '';\n              if (newState.timerCount) {\n                chronoNavItem.classList.add('has-count');\n              }\n              chronoNavItem.appendChild(countElement);\n            }\n\n            if (item.current) {\n              chronoNavItem.classList = 'current';\n              border.style.transform = `translate(${newCurrentIndex * this._borderWidth}px)`;\n            }\n            chronoNavItem.addEventListener('click', this.onClick);\n\n            nav.appendChild(chronoNavItem);\n          }\n        });\n\n        this._state = newState;\n        break;\n      }\n      default:\n        break;\n    }\n  }\n\n  connectedCallback() {\n  }\n\n  disconnectedCallback() {\n    const navElements = this.shadowRoot.querySelectorAll('a') || [];\n    navElements.forEach(el => el.removeEventListener('click', this.onClick));\n  }\n\n  onClick(event) {\n    event.preventDefault();\n\n    const navElements = this.shadowRoot.querySelectorAll('a') || [];\n    const index = [...navElements].indexOf(event.target);\n\n    this.dispatchEvent(new CustomEvent('route:change', {\n      detail: {\n        data: this.state.routes[index],\n      },\n      bubbles: true,\n      composed: true,\n    }));\n  }\n}\n\nwindow.customElements.define('chrono-nav', ChronoNav);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/nav/index.js\n// module id = 5\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/nav/index.js?");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

eval("const style = __webpack_require__(19);\nconst templateHasTimer = __webpack_require__(21);\nconst templateHasNoTimer = __webpack_require__(20);\n\nclass ChronoPageHome extends HTMLElement {\n  constructor() {\n    super();\n\n    this.attachShadow({ mode: 'open' });\n\n    this.shadowRoot.innerHTML = `\n      <style>\n        ${style()}\n      </style>\n\n      <template id='hastimer'>\n        ${templateHasTimer()}\n      </template>\n\n      <template id='hasnotimer'>\n        ${templateHasNoTimer()}\n      </template>\n\n      <div id='content'></div>\n    `;\n  }\n\n  connectedCallback() {\n  }\n\n  disconnectedCallback() {\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  get state() {\n    const jsonString = this.getAttribute('state');\n\n    return jsonString ? JSON.parse(jsonString) : {};\n  }\n\n  set state(state) {\n    this.setAttribute('state', JSON.stringify(state));\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state': {\n        const oldState = oldValue ? JSON.parse(oldValue) : {};\n        const newState = newValue ? JSON.parse(newValue) : {};\n        if (!oldValue) {\n          if (newState.timers.length) {\n            this.initComponent(newState.timers[newState.timers.length - 1]);\n          } else {\n            this.initComponent();\n          }\n        } else {\n          if (newState.timers.length && oldState.timers.length) {\n            this.updateTimer(newState.timers[newState.timers.length - 1]);\n          } else if (newState.timers.length && !oldState.timers.length) {\n            this.initComponent(newState.timers[newState.timers.length - 1]);\n          } else if (!newState.timers.length && oldState.timers.length) {\n            this.initComponent();\n          }\n        }\n        break;\n      }\n      default:\n        break;\n    }\n  }\n\n  initComponent(timer = false) {\n    const templateId = timer ? 'hastimer' : 'hasnotimer';\n    const templateContent = this.shadowRoot.querySelector(`template#${templateId}`);\n    const instance = templateContent.content.cloneNode(true);\n\n    const content = this.shadowRoot.querySelector('#content');\n\n    while (content.hasChildNodes()) {\n      content.removeChild(content.lastChild);\n    }\n\n    content.appendChild(instance);\n\n    if (timer) {\n      this.updateTimer(timer);\n    }\n  }\n\n  updateTimer(timer) {\n    const timerElement = this.shadowRoot.querySelector('chrono-timerfull');\n    timerElement.setAttribute('state', JSON.stringify(timer));\n  }\n}\n\nwindow.customElements.define('chrono-pagehome', ChronoPageHome);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/pagehome/index.js\n// module id = 6\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/pagehome/index.js?");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

eval("const style = __webpack_require__(22);\nconst template = __webpack_require__(23);\n\nclass ChronoPageTimers extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n    shadowRoot.innerHTML = `\n      <style>\n        ${style()}\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n\n    const templateContent = this.shadowRoot.querySelector('template');\n    const instance = templateContent.content.cloneNode(true);\n    this.shadowRoot.appendChild(instance);\n  }\n\n  connectedCallback() {\n  }\n\n  disconnectedCallback() {\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  get state() {\n    const jsonString = this.getAttribute('state');\n\n    return jsonString ? JSON.parse(jsonString) : {};\n  }\n\n  set state(state) {\n    this.setAttribute('state', JSON.stringify(state));\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state':\n        this.update(JSON.parse(newValue));\n        break;\n      default:\n        break;\n    }\n  }\n\n  update(state) {\n    const timersElement = this.shadowRoot.querySelector('chrono-timers');\n\n    timersElement.setAttribute('state', JSON.stringify(state.timers));\n  }\n}\n\nwindow.customElements.define('chrono-pagetimers', ChronoPageTimers);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/pagetimers/index.js\n// module id = 7\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/pagetimers/index.js?");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

eval("const templateHome = __webpack_require__(32);\nconst templateTimers = __webpack_require__(33);\n\nclass ChronoRouter extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n    shadowRoot.innerHTML = `\n      <slot name='main'></slot>\n    `;\n\n    this._state = {};\n  }\n\n  connectedCallback() {\n    window.addEventListener('popstate', (event) => {\n      this.dispatchEvent(new CustomEvent('route:change', {\n        detail: {\n          replace: true,\n          data: event.state,\n        },\n        bubbles: true,\n        composed: true,\n      }));\n    });\n  }\n\n  disconnectedCallback() {\n    // TODO: remove listeners\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state': {\n        const newState = JSON.parse(newValue);\n\n        const oldRoute = this._state.routes && this._state.routes.find(route => route.current);\n        const newRoute = newState.routes.find(route => route.current);\n\n        const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];\n\n        if (!oldRoute || oldRoute.id !== newRoute.id) {\n          switch (newRoute.id) {\n            case 'home': {\n              main.innerHTML = templateHome({\n                state: newState,\n              });\n              break;\n            }\n            case 'timers': {\n              main.innerHTML = templateTimers({\n                state: newState,\n              });\n              break;\n            }\n            default:\n              break;\n          }\n        } else {\n          switch (newRoute.id) {\n            case 'home':\n              main.querySelector('chrono-pagehome').setAttribute('state', newValue);\n              break;\n            case 'timers':\n              main.querySelector('chrono-pagetimers').setAttribute('state', newValue);\n              break;\n            default:\n              break;\n          }\n        }\n\n        this._state = newState;\n        break;\n      }\n      default:\n        break;\n    }\n  }\n}\n\nwindow.customElements.define('chrono-router', ChronoRouter);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/router/index.js\n// module id = 8\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/router/index.js?");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

eval("const StateClient = __webpack_require__(30);\n\nclass ChronoState extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n    shadowRoot.innerHTML = `\n      <slot name='main'></slot>\n    `;\n\n    this._state = new StateClient();\n  }\n\n  connectedCallback() {\n    this.addEventListener('route:change', (event) => {\n      this.onStateChange('route:change', Object.assign({}, event.detail.data, {\n        replace: event.detail.replace,\n      }));\n    });\n\n    this.addEventListener('state:timeradd', (event) => {\n      this.onStateChange('state:timeradd', event.detail);\n    });\n\n    this.addEventListener('state:timerreset', (event) => {\n      this.onStateChange('state:timerreset', event.detail);\n    });\n\n    this.addEventListener('state:timerend', (event) => {\n      this.onStateChange('state:timerend', event.detail);\n    });\n\n    this.addEventListener('state:timerpause', (event) => {\n      this.onStateChange('state:timerpause', event.detail);\n    });\n\n    this.addEventListener('state:timersplit', (event) => {\n      this.onStateChange('state:timersplit', event.detail);\n    });\n\n    this.addEventListener('state:timerremove', (event) => {\n      this.onStateChange('state:timerremove', event.detail);\n    });\n  }\n\n  disconnectedCallback() {\n    // TODO: remove listeners\n  }\n\n  onStateChange(action, data) {\n    switch (action) {\n      case 'route:change': {\n        this._state.changeRoute(data);\n        break;\n      }\n      case 'state:timeradd': {\n        this._state.addTimer(data);\n        break;\n      }\n      case 'state:timerreset': {\n        this._state.resetTimer();\n        break;\n      }\n      case 'state:timerend': {\n        this._state.endTimer(data);\n        break;\n      }\n      case 'state:timerpause': {\n        this._state.pauseTimer(data);\n        break;\n      }\n      case 'state:timersplit': {\n        this._state.splitTimer(data);\n        break;\n      }\n      case 'state:timerremove': {\n        this._state.removeTimer(data);\n        break;\n      }\n      default:\n        break;\n    }\n\n    this.setAttribute('state', JSON.stringify(this._state.toObject()));\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state': {\n        this._state = StateClient.fromObject(JSON.parse(newValue));\n\n        const main = this.shadowRoot.querySelector('slot').assignedNodes()[0];\n\n        const nav = main.querySelector('chrono-nav');\n        nav.setAttribute('state', JSON.stringify({\n          routes: this._state.routes,\n          timerCount: this._state.timers.length,\n        }));\n\n        const router = main.querySelector('chrono-router');\n        router.setAttribute('state', JSON.stringify(this._state.toObject()));\n\n        // console.log('state', this._state);\n        break;\n      }\n      default:\n        break;\n    }\n  }\n}\n\nwindow.customElements.define('chrono-state', ChronoState);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/state/index.js\n// module id = 9\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/state/index.js?");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

eval("const template = __webpack_require__(26);\n\nclass ChronoTimerAdd extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n    shadowRoot.innerHTML = `\n      <style>\n        :host {\n        }\n\n        * {\n          box-sizing: border-box;\n        }\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n\n    const templateContent = this.shadowRoot.querySelector('template');\n    const instance = templateContent.content.cloneNode(true);\n    this.shadowRoot.appendChild(instance);\n\n    this._state = {};\n\n    this.onAdd = this.onAdd.bind(this);\n  }\n\n  connectedCallback() {\n    this.shadowRoot.querySelector('form').addEventListener('submit', this.onAdd);\n    this.shadowRoot.querySelector('form').addEventListener('chrono:buttonclick', this.onAdd);\n  }\n\n  disconnectedCallback() {\n    this.shadowRoot.querySelector('form').removeEventListener('submit', this.onAdd);\n    this.shadowRoot.querySelector('form').removeEventListener('chrono:buttonclick', this.onAdd);\n  }\n\n  onAdd(event) {\n    event.preventDefault();\n\n    this.dispatchEvent(new CustomEvent('state:timeradd', {\n      detail: Date.now(),\n      bubbles: true,\n      composed: true,\n    }));\n  }\n}\n\nwindow.customElements.define('chrono-timeradd', ChronoTimerAdd);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timeradd/index.js\n// module id = 10\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timeradd/index.js?");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

eval("const ChronoTimer = __webpack_require__(0);\n\nconst style = __webpack_require__(27);\nconst template = __webpack_require__(2);\n\nclass ChronoTimerBrief extends ChronoTimer {\n  constructor() {\n    super();\n\n    this.removeTimer = this.removeTimer.bind(this);\n  }\n\n  initShadowRoot() {\n    this.shadowRoot.innerHTML = `\n      <style>\n        ${style()}\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n  }\n\n  connectedCallback() {\n    super.connectedCallback();\n\n    const formRemove = this.shadowRoot.querySelector('form#remove');\n    formRemove.addEventListener('submit', this.removeTimer);\n    formRemove.addEventListener('chrono:buttonclick', this.removeTimer);\n  }\n\n  disconnectedCallback() {\n    super.disconnectedCallback();\n\n    const formRemove = this.shadowRoot.querySelector('form#remove');\n    formRemove.removeEventListener('submit', this.removeTimer);\n    formRemove.removeEventListener('chrono:buttonclick', this.removeTimer);\n  }\n\n  removeTimer(event) {\n    event.preventDefault();\n\n    this.dispatchEvent(new CustomEvent('state:timerremove', {\n      detail: {\n        id: this.state.id,\n      },\n      bubbles: true,\n      composed: true,\n    }));\n  }\n}\n\nwindow.customElements.define('chrono-timerbrief', ChronoTimerBrief);\n\nmodule.exports = ChronoTimerBrief;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timerbrief/index.js\n// module id = 11\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timerbrief/index.js?");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

eval("const ChronoTimer = __webpack_require__(0);\n\nconst style = __webpack_require__(28);\nconst template = __webpack_require__(1);\n\nclass ChronoTimerFull extends ChronoTimer {\n  constructor() {\n    super();\n\n    this.split = this.split.bind(this);\n  }\n\n  initShadowRoot() {\n    this.shadowRoot.innerHTML = `\n      <style>\n        ${style()}\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n  }\n\n  connectedCallback() {\n    super.connectedCallback();\n\n    const formSplit = this.shadowRoot.querySelector('form#split');\n    formSplit.addEventListener('submit', this.split);\n    formSplit.addEventListener('chrono:buttonclick', this.split);\n  }\n\n  disconnectedCallback() {\n    super.disconnectedCallback();\n\n    const formSplit = this.shadowRoot.querySelector('form#split');\n    formSplit.removeEventListener('submit', this.split);\n    formSplit.removeEventListener('chrono:buttonclick', this.split);\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    const oldState = oldValue ? JSON.parse(oldValue) : [];\n    const newState = newValue ? JSON.parse(newValue) : [];\n\n    if (oldValue && newState.id > oldState.id && this.getAttribute('minimiseToSelector')) {\n      window.requestAnimationFrame(() => {\n        const fromElement = this.shadowRoot.querySelectorAll('.time')[0];\n        const fromElementRect = fromElement.getBoundingClientRect();\n\n        const toElement = document.querySelector('chrono-nav').shadowRoot.querySelector('nav a:last-child');\n        const toElementRect = toElement.getBoundingClientRect();\n\n        const element = fromElement.cloneNode();\n        element.removeAttribute('id');\n        element.textContent = oldState.end ?\n          (oldState.end - oldState.start) :\n          (Date.now() - oldState.start);\n\n        element.classList.add('dyn');\n\n        element.style.left = `${fromElementRect.left}px`;\n        element.style.right = `${fromElementRect.right - fromElementRect.width}px`;\n        element.style.top = `${fromElementRect.top - fromElement.offsetTop}px`;\n\n        this.shadowRoot.appendChild(element);\n\n        element.addEventListener('transitionend', () => {\n          element.remove();\n        });\n\n        window.requestAnimationFrame(() => {\n          element.classList.add('show');\n\n          const scale = toElementRect.height / fromElementRect.height;\n          element.style.transform = `translate(\n            ${(toElementRect.left - fromElementRect.left) / 2}px,\n            ${(-fromElementRect.top) * (0.5 / scale)}px\n          ) scale(${scale})`;\n        });\n      });\n    }\n    super.attributeChangedCallback(name, oldValue, newValue);\n  }\n\n  update(timer) {\n    super.update(timer);\n\n    this.updatePauseForm();\n    this.updateSplits();\n  }\n\n  updateSplits() {\n    const splitsContainer = this.shadowRoot.querySelector('#splits');\n    const currentSplits = splitsContainer.querySelectorAll('chrono-timersplit');\n\n    this.state.splits.forEach((split, splitIndex) => {\n      const splitComponent = splitsContainer.querySelector(`#split-${splitIndex}`);\n      if (splitComponent) {\n        splitComponent.setAttribute('state', JSON.stringify(split));\n      } else {\n        const chronoTimerSplit = document.createElement('chrono-timersplit');\n        chronoTimerSplit.setAttribute('state', JSON.stringify(split));\n        chronoTimerSplit.setAttribute('id', `split-${splitIndex}`);\n        splitsContainer.insertBefore(chronoTimerSplit, splitsContainer.firstChild);\n      }\n    });\n\n    for (let i = 0; i < currentSplits.length - this.state.splits.length; i += 1) {\n      currentSplits[currentSplits.length - i - 1].remove();\n    }\n  }\n\n  updatePauseForm() {\n    const pauseForm = this.shadowRoot.querySelector('#split');\n\n    if (this.state.paused) {\n      pauseForm.classList.add('hide');\n    } else {\n      pauseForm.classList.remove('hide');\n    }\n  }\n\n  split(event) {\n    event.preventDefault();\n\n    this.dispatchEvent(new CustomEvent('state:timersplit', {\n      detail: {\n        id: this.state.id,\n        time: Date.now(),\n      },\n      bubbles: true,\n      composed: true,\n    }));\n  }\n}\n\nwindow.customElements.define('chrono-timerfull', ChronoTimerFull);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timerfull/index.js\n// module id = 12\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timerfull/index.js?");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

eval("const template = __webpack_require__(3);\n\nclass ChronoTimers extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n    shadowRoot.innerHTML = `\n      <style>\n        :host {\n        }\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n\n    const templateContent = this.shadowRoot.querySelector('template');\n    const instance = templateContent.content.cloneNode(true);\n    this.shadowRoot.appendChild(instance);\n\n    this._state = [];\n    this._stateString = JSON.stringify(this._state);\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  get state() {\n    const jsonString = this.getAttribute('state');\n\n    return jsonString ? JSON.parse(jsonString) : [];\n  }\n\n  set state(state) {\n    this.setAttribute('state', JSON.stringify(state));\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state':\n        if (this._stateString !== newValue) {\n          this._stateString = newValue;\n\n          const newState = this._stateString ? JSON.parse(this._stateString) : [];\n\n          newState.forEach((newTimer) => {\n            if (!this._state.some(existingTimer => existingTimer.id === newTimer.id)) {\n              this.addTimer(newTimer);\n            } else {\n              this.editTimer(newTimer);\n            }\n          });\n\n          this._state.forEach((existingTimer) => {\n            if (!newState.some(newTimer => newTimer.id === existingTimer.id)) {\n              this.removeTimer(existingTimer);\n            }\n          });\n\n          this._state = newState;\n        }\n        break;\n      default:\n        break;\n    }\n  }\n\n  connectedCallback() {\n  }\n\n  disconnectedCallback() {\n  }\n\n  addTimer(timer) {\n    const chronoTimer = document.createElement('chrono-timerbrief');\n    chronoTimer.setAttribute('state', JSON.stringify(timer));\n    const timersElement = this.shadowRoot.querySelector('#timers');\n    timersElement.insertBefore(chronoTimer, timersElement.firstChild);\n  }\n\n  editTimer(timer) {\n    const component = this.shadowRoot.querySelector(`chrono-timerbrief[stateid='${timer.id}']`);\n    component.setAttribute('state', JSON.stringify(timer));\n  }\n\n  removeTimer(timer) {\n    const component = this.shadowRoot.querySelector(`chrono-timerbrief[stateid='${timer.id}']`);\n    component.remove();\n  }\n}\n\nwindow.customElements.define('chrono-timers', ChronoTimers);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timers/index.js\n// module id = 13\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timers/index.js?");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

eval("const template = __webpack_require__(29);\n\nclass ChronoTimerSplit extends HTMLElement {\n  constructor() {\n    super();\n\n    const shadowRoot = this.attachShadow({ mode: 'open' });\n\n    shadowRoot.innerHTML = `\n      <style>\n        :host {\n        }\n\n        * {\n          box-sizing: border-box;\n        }\n      </style>\n\n      <template>\n        ${template()}\n      </template>\n    `;\n\n    const templateContent = this.shadowRoot.querySelector('template');\n    const instance = templateContent.content.cloneNode(true);\n    this.shadowRoot.appendChild(instance);\n  }\n\n  static get observedAttributes() {\n    return ['state'];\n  }\n\n  get state() {\n    const jsonString = this.getAttribute('state');\n\n    return jsonString ? JSON.parse(jsonString) : {};\n  }\n\n  set state(state) {\n    this.setAttribute('state', JSON.stringify(state));\n  }\n\n  attributeChangedCallback(name, oldValue, newValue) {\n    switch (name) {\n      case 'state':\n        this.update(JSON.parse(newValue));\n        break;\n      default:\n        break;\n    }\n  }\n\n  connectedCallback() {\n  }\n\n  disconnectedCallback() {\n  }\n\n  update(split) {\n    const container = this.shadowRoot.querySelector('.chrono-timersplit');\n\n    container.textContent = split / 1000;\n  }\n}\n\nwindow.customElements.define('chrono-timersplit', ChronoTimerSplit);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timersplit/index.js\n// module id = 14\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timersplit/index.js?");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n\n:host {\n\n}\n\nbutton {\n  border: none;\n  background: #E91E63;\n  box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24);\n  border-radius: 2px;\n  font-family: Roboto;\n  font-size: 16px;\n  color: #FFFFFF;\n  letter-spacing: 0.5px;\n  padding: 6px 12px;\n  text-transform: uppercase;\n}\n\nbutton:active {\n  box-shadow: 0 0 8px 0 rgba(0,0,0,0.12), 0 8px 8px 0 rgba(0,0,0,0.24);\n}\n\nbutton.small {\n  font-size: 12px;\n}\n\nbutton.circle {\n  width: 80px;\n  height: 80px;\n  border-radius: 80px;\n\n  font-family: Roboto-Light;\n  font-size: 36px;\n}\n\n`);\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/button/style.css\n// module id = 15\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/button/style.css?");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

eval("const template = (title = '', isCircle = false) => (`\n  <button class='${isCircle ? 'circle' : ''}'><slot>${title}</slot></button>\n`);\n\nmodule.exports = template;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/button/template.js\n// module id = 16\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/button/template.js?");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n\n:host {\n  display: block;\n  position: relative;\n  text-transform: uppercase;\n  background-color: red;\n}\n\nnav {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.border {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  bottom: 0;\n  height: 5px;\n  width: 0;\n  background-color: #E91E63;\n\n  transform: translate(0px);\n  transition: transform 0.05s ease-in 0s;\n\n  display: none;\n}\n\n.border.show {\n  display: block;\n}\n\na {\n  flex-grow: 1;\n  width: 100%;\n  display: block;\n  text-align: center;\n  padding: 1em 0;\n\n  border-bottom: 5px solid transparent;\n  text-decoration: none;\n  color: white;\n\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\na span {\n  pointer-events: none;\n}\n\na.has-count span {\n  width: 1.2rem;\n  height: 0.9rem;\n  border-radius: 1rem;\n  color: white;\n  background-color: #E91E63;\n  margin-left: 0.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.7rem;\n}\n\na.current {\n  border-bottom-color: #E91E63;\n}\n\na.hide {\n  border-bottom-color: transparent;\n}\n\n`);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/nav/style.css\n// module id = 17\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/nav/style.css?");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

eval("const templateNav = (state = {\n  routes: [],\n  timerCount: 0,\n}) => (`\n  <nav>\n    ${state.routes.map(item => (`\n      ${item.id === 'timers' ? `\n        <a id='${item.id}' class='${state.timerCount ? 'has-count' : ''}' href='${item.path}'>${item.title}<span>${state.timerCount ? state.timerCount : ''}</span></a>\n      ` : `\n        <a id='${item.id}' href='${item.path}'>${item.title}</a>\n      `}\n    `)).join('')}\n  </nav>\n  <div class='border'></div>\n`);\n\nmodule.exports = templateNav;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/nav/template.js\n// module id = 18\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/nav/template.js?");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n\n:host {\n}\n\n`);\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/pagehome/style.css\n// module id = 19\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/pagehome/style.css?");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

eval("const template = () => (`\n  <div id='no-timers'>No timers</div>\n`);\n\nmodule.exports = template;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/pagehome/template-hasnotimer.js\n// module id = 20\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/pagehome/template-hasnotimer.js?");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

eval("const templateTimerFull = __webpack_require__(1);\n\nconst template = (timer = false) => {\n  if (timer) {\n    return `\n      <chrono-timerfull state='${JSON.stringify(timer)}' minimiseToSelector='#item'>\n        ${templateTimerFull(timer)}\n      </chrono-timerfull>\n    `;\n  }\n\n  return '<chrono-timerfull minimiseToSelector=\"#item\"></chrono-timerfull>';\n};\n\nmodule.exports = template;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/pagehome/template-hastimer.js\n// module id = 21\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/pagehome/template-hastimer.js?");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n\n:host {\n\n}\n\n`);\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/pagetimers/style.css\n// module id = 22\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/pagetimers/style.css?");

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

eval("const templateTimers = __webpack_require__(3);\n\nconst template = (timers = []) => {\n\n  return `\n    <chrono-timers state='${JSON.stringify(timers)}'>\n      ${templateTimers(timers)}\n    </chrono-timers>\n  `;\n};\n\nmodule.exports = template;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/pagetimers/template.js\n// module id = 23\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/pagetimers/template.js?");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n\n:host {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-around;\n  padding: 0.5rem 0;\n}\n\nh1 {\n  font-weight: normal;\n}\n\nchrono-timersplit {\n  text-align: center;\n}\n\nchrono-button span.hide {\n  display: none;\n}\n\n.time {\n  flex-grow: 1;\n}\n\n#actions {\n  flex-grow: 1;\n\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-around;\n}\n\n`);\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timer/style.css\n// module id = 24\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timer/style.css?");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

eval("module.exports = (timer = {\n  id: false,\n  start: false,\n  end: false,\n  paused: false,\n  splits: [],\n}) => (`\n  <div id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</div>\n  <div id='actions'>\n    <form id='pause'>\n      <chrono-button><span id='stop'>Stop</span><span id='start'>Start</span></chrono-button>\n    </form>\n  </div>\n`);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timer/template.js\n// module id = 25\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timer/template.js?");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n  <div class='chrono-addtimer'>\n    <form>\n      <chrono-button iscircle>+</chrono-button>\n    </form>\n  </div>\n`);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timeradd/template.js\n// module id = 26\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timeradd/template.js?");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n\n:host {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-around;\n  padding: 0.5rem 0;\n}\n\nh1 {\n  font-weight: normal;\n}\n\nchrono-timersplit {\n  text-align: center;\n}\n\nchrono-button span.hide {\n  display: none;\n}\n\n.time {\n  flex-grow: 1;\n}\n\n#actions {\n  flex-grow: 1;\n\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-around;\n}\n\n`);\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timerbrief/style.css\n// module id = 27\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timerbrief/style.css?");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

eval("module.exports = () => (`\n\n:host {\n}\n\n.container {\n  position: relative;\n}\n\nh1 {\n  font-weight: normal;\n  font-size: 5rem;\n  margin: 0;\n  padding: 2rem;\n}\n\nchrono-timersplit {\n  text-align: center;\n}\n\nchrono-button span.hide {\n  display: none;\n}\n\n#elapsed {\n  z-index: 2;\n}\n\n#split.hide {\n  display: none;\n}\n\n.dyn {\n  position: absolute;\n  opacity: 1;\n  visibility: hidden;\n  z-index: 1;\n}\n\n.dyn.show {\n  opacity: 0;\n  visibility: visible;\n  transition: transform 0.2s ease-out 0s, opacity 0.2s ease-out 0s;\n}\n\n`);\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timerfull/style.css\n// module id = 28\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timerfull/style.css?");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

eval("module.exports = (split = 0) => (`\n  <div class='chrono-timersplit'>\n    ${split}\n  </div>\n`);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/elements/timersplit/template.js\n// module id = 29\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/elements/timersplit/template.js?");

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

eval("const State = __webpack_require__(31);\n\nclass StateClient extends State {\n  changeRoute(route) {\n    super.changeRoute(route);\n\n    if (route.replace) {\n      history.replaceState(route, route.title, route.path);\n    } else {\n      history.pushState(route, route.title, route.path);\n    }\n\n    document.title = `Chrono - ${route.title}`;\n  }\n}\n\nmodule.exports = StateClient;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/models/state-client.js\n// module id = 30\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/models/state-client.js?");

/***/ }),
/* 31 */
/***/ (function(module, exports) {

eval("let nextTimerId = 0;\n\nclass State {\n  constructor({\n    routes = [],\n    timers = [],\n  } = {}) {\n    this.routes = routes;\n    this.timers = timers;\n  }\n\n  toObject() {\n    return {\n      routes: this.routes,\n      timers: this.timers,\n    };\n  }\n\n  static fromObject(data) {\n    try {\n      return new this({\n        routes: data.routes,\n        timers: data.timers,\n      });\n    } catch (err) {\n      return new this({\n        routes: [],\n        timers: [],\n      });\n    }\n  }\n\n  changeRoute(newRoute) {\n    this.routes = this.routes.map(route => (\n      Object.assign({}, route, {\n        current: route.id === newRoute.id,\n      })\n    ));\n  }\n\n  addTimer(start) {\n    const timer = {\n      id: false,\n      start,\n      end: false,\n      paused: false,\n      splits: [],\n    };\n\n    this.timers.push(Object.assign({}, timer, {\n      id: nextTimerId,\n    }));\n    nextTimerId += 1;\n\n    return timer;\n  }\n\n  resetTimer() {\n    this.timers = [];\n  }\n\n  endTimer(data) {\n    const foundTimer = this.timers.find(timer => timer.id === data.id);\n    foundTimer.end = data.time;\n  }\n\n  pauseTimer(data) {\n    const foundTimer = this.timers.find(timer => timer.id === data.id);\n    if (foundTimer.paused) {\n      foundTimer.start = data.time - foundTimer.paused;\n      foundTimer.paused = false;\n    } else {\n      foundTimer.paused = data.time - foundTimer.start;\n    }\n  }\n\n  splitTimer(data) {\n    const foundTimer = this.timers.find(timer => timer.id === data.id);\n    foundTimer.splits.push(data.time - foundTimer.start);\n  }\n\n  removeTimer(data) {\n    const foundTimerIndex = this.timers.findIndex(timer => timer.id === data.id);\n    this.timers.splice(foundTimerIndex, 1);\n  }\n}\n\nmodule.exports = State;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/models/state.js\n// module id = 31\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/models/state.js?");

/***/ }),
/* 32 */
/***/ (function(module, exports) {

eval("const templateHome = (args) => {\n  const state = args.state;\n\n  return `\n    <chrono-pagehome state='${JSON.stringify(state)}'></chrono-pagehome>\n  `;\n};\n\nmodule.exports = templateHome;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/templates/home.js\n// module id = 32\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/templates/home.js?");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

eval("const template = (args = {}) => {\n  const state = args.state;\n\n  return `\n    <chrono-pagetimers state='${JSON.stringify(state)}'></chrono-pagetimers>\n  `;\n};\n\nmodule.exports = template;\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/templates/timers.js\n// module id = 33\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/templates/timers.js?");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(9);\n__webpack_require__(8);\n__webpack_require__(6);\n__webpack_require__(7);\n__webpack_require__(4);\n__webpack_require__(5);\n__webpack_require__(10);\n__webpack_require__(0);\n__webpack_require__(11);\n__webpack_require__(12);\n__webpack_require__(14);\n__webpack_require__(13);\n\n\n//////////////////\n// WEBPACK FOOTER\n// ./public/js/app.js\n// module id = 34\n// module chunks = 0\n\n//# sourceURL=webpack:///./public/js/app.js?");

/***/ })
/******/ ]);