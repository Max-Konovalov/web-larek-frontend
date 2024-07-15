import { createElement, priceString } from '../../utils/utils';
import { Component } from '../base/component';
import { EventEmitter } from '../base/events';
import {ICart} from "./ICart";

export class Cart extends Component<ICart> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
		this.toggleButton(true);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this._total.textContent = priceString(total);
	}

	toggleButton(disabled: boolean) {
		this.toggleElement(this._button, disabled);
	}
}
