import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import {ICard} from "../interfaces/ICard";
import {ICardActions} from "../interfaces/ICardActions";

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _description?: HTMLElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set category(value: string) {
		const categoryMap: Record<string, string> = {
			"софт-скил": "soft",
			"хард-скил": "hard",
			"другое": "other",
			"дополнительное": "additional",
			"кнопка": "button",
		};

		const enCategory = categoryMap[value];

		Object.values(categoryMap).forEach((category) => {
			this.toggleClass(this._category, `card__category_${category}`, false);
		})
		this.toggleClass(this._category, `card__category_${enCategory}`, true);
		this.setText(this._category, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title)
	}

	get price() {
		return parseInt(this._price.textContent);
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
			this.setText(this._button, `Нельзя купить`);
		} else {
			this.setText(this._price, value + ` синапсов`);
		}
	}

	set description(value: string) {
		this.setText(this._description, value)
	}

	set inCart(isInBasket: boolean) {
		this._button.textContent = isInBasket ? 'Убрать' : 'В корзину';
	}
}
