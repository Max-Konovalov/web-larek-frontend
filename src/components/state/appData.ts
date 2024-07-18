import { ContactsFormErrors,FormName,OrderFormErrors} from '../../types';
import { Model } from '../base/model';
import { IEvents } from '../base/events';
import {IAppState} from "../interfaces/IAppState";
import {IProduct} from "../base/interfaces/IProduct";
import {IAnyForm} from "../forms/IAnyForm";
import {IOrder} from "../base/interfaces/IOrder";

export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	cart: IProduct[] = [];
	order: IOrder = {
		address: '',
		payment: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	orderFormErrors: OrderFormErrors = {};
	contactsFormErrors: ContactsFormErrors = {};

	constructor(data: Partial<IAppState>, protected events: IEvents) {
		super(data, events);
		this.catalog = [];
		this.cart = [];
		this.clearOrderForm();
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed');
	}

	addToCart(item: IProduct) {
		this.cart.push(item);
		this.emitChanges('cart:changed');
	}

	removeFromCart(item: IProduct) {
		this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
		this.emitChanges('cart:changed');
	}

	isInCart(item: IProduct) {
		return this.cart.some((cartItem) => {
			return cartItem.id === item.id;
		});
	}

	getCartCount(): number {
		return this.cart.length;
	}

	getTotalCartPrice(): number {
		return this.cart.reduce((a, b) => {
			return a + b.price;
		}, 0);
	}

	changeField(field: keyof IAnyForm, value: string) {
		this.order[field] = value;
		if (this.validate('order')) this.events.emit('order:ready', this.order);
		if (this.validate('contacts')) this.events.emit('contacts:ready', this.order);
	}

	validate(formType: FormName) {
		const errors =
			formType === 'order' ? this.showOrderErrors() : this.setContactsErrors();
		this.events.emit(formType + 'FormErrors:change', errors);
		return Object.keys(errors).length === 0;
	}

	showOrderErrors() {
		const errors: OrderFormErrors = {};
		if (!this.order.payment) errors.payment = 'Выберите способ оплаты';
		if (!this.order.address) errors.address = 'Укажите адрес';
		this.orderFormErrors = errors;
		return errors;
	}

	setContactsErrors() {
		const errors: ContactsFormErrors = {};
		if (!this.order.phone) errors.phone = 'Укажите телефон';
		if (!this.order.email) errors.email = 'Укажите емейл';
		this.contactsFormErrors = errors;
		return errors;
	}

	clearOrderForm() {
		this.order = {
			address: '',
			payment: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
		this.orderFormErrors = {};
		this.contactsFormErrors = {};
	}

	clearCartState() {
		this.cart = [];
		this.emitChanges('cart:changed');
	}

	prepareOrder() {
		this.order.total = this.getTotalCartPrice();
		this.cart.forEach((item) => {
			if (item.price) {
				this.order.items.push(item.id);
			}
		});
	}

	getOrderData() {
		return structuredClone(this.order);
	}
}