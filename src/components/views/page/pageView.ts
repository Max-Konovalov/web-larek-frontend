import { ensureElement } from '../../../utils/utils';
import { Component } from '../../base/component';
import { IEvents } from '../../base/events';
import {IPage} from "./IPage";
export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLButtonElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set counter(value: number) {
		this.changeText(this._counter, String(value));
	}

	set locked(value: boolean) {
		this._wrapper.classList.add('page__wrapper_locked');
		if (!value) {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}