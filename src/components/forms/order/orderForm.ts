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
					this.toggleClass(item, ACTIVE_BUTTON_CLASS, false)
				);
				this.toggleClass(button, ACTIVE_BUTTON_CLASS, true);
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
			this.toggleClass(currentButton, ACTIVE_BUTTON_CLASS, true);
			this.onInputChangeValue('payment', currentButton.name);
		}
	}

	cleanFieldValues() {
		this.address = '';
		this.payment = '';
		this._buttons.forEach((button) =>
			this.toggleClass(button, ACTIVE_BUTTON_CLASS, false)
		);
	}
}
