class CustomTag {
	constructor(name, cb) {
		this.name = name;
		this.tag = customElements.define(name, class extends HTMLElement {
			connectedCallback() {
				const shadowRoot = this.attachShadow({ mode: 'open' });
				cb.apply(this, [shadowRoot]);
			}
		});
	}
}