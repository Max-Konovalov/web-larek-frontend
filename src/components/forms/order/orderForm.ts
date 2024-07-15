import { ACTIVE_BUTTON_CLASS } from '../../../utils/constants';
import { IEvents } from '../../base/events';
import { Form } from '../../common/form';
import {IOrderForm} from "./IOrderForm";

export class Order extends Form<IOrderForm> {
	protected _buttons: HTMLButtonElement[] = [];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._buttons = [
			container.elements.namedItem('card') as HTMLButtonElement,
			container.elements.namedItem('cash') as HTMLButtonElement,
		];

		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this._buttons.forEach((item) =>
					item.classList.remove(ACTIVE_BUTTON_CLASS)
				);
				button.classList.add(ACTIVE_BUTTON_CLASS);
				this.onInputChangeValue('payment', button.name);
			});
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(value: string) {
		const currentButton = this._buttons.find((button, index, array) => {
			return button.name === value;
		});
		if (currentButton) {
			currentButton.classList.add(ACTIVE_BUTTON_CLASS);
			this.onInputChangeValue('payment', currentButton.name);
		}
	}

	cleanFieldValues() {
		this.address = '';
		this.payment = '';
		this._buttons.forEach((button) =>
			button.classList.remove(ACTIVE_BUTTON_CLASS)
		);
	}
}
