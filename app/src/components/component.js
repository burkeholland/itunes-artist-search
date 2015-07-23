'use strict';

let o = $({});

class Component {
	
	static on() {
		o.on.apply(o, arguments);
	}
	
	static off() {
		o.off.apply(o, arguments);
	}
	
	static trigger() {
		o.trigger.apply(o, arguments);
	}

	constructor(container, template, observable, bindable) {
		let html, dom;

		if (container) {
			dom = $(template).appendTo(container);
		}

		if (bindable) {
			kendo.bind(dom, observable);
		}
	}
}

export default Component;