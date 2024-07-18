import './scss/styles.scss';

import { Card } from './components/card/card';
import { Form } from './components/common/form';
import { FormName } from './types';
import {
	cardBasketTemplate,
	cardCatalogTemplate,
	cardPreviewTemplate,
  CDN_URL,
	API_URL,
	cartTemplate,
	orderTemplate,
	contactsTemplate,
	successTemplate
} from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import {IAnyForm} from "./components/forms/IAnyForm";
import {IOrderForm} from "./components/forms/order/IOrderForm";
import {IContactsForm} from "./components/forms/contacts/IContactsForm";
import {IProduct} from "./components/base/interfaces/IProduct";
import { WebLarekApi } from './components/card/webLarekApi';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/state/appData';
import { Page } from './components/views/page/pageView';
import { Modal } from './components/common/modal';
import { Cart } from './components/cart/cart';
import { Order } from './components/forms/order/orderForm';
import { Contacts } from './components/forms/contacts/contactForm';
import { Success } from './components/views/success/succesView';

export const api = new WebLarekApi(CDN_URL, API_URL);
export const events = new EventEmitter();
export const appData = new AppState({}, events);
export const page = new Page(document.body, events);
export const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
export const cart = new Cart(cloneTemplate(cartTemplate), events);
export const order = new Order(cloneTemplate(orderTemplate), events);
export const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
export const success = new Success(cloneTemplate(successTemplate), events);

const onFormErrorsChange = (input: {
	errors: Partial<IAnyForm>;
	form: Form<IAnyForm>;
}) => {
	input.form.valid = Object.values(input.errors).every((text) => {
		return !text;
	});
	input.form.errors = Object.values(input.errors)
		.filter((i) => !!i)
		.join('; ');
};

const renderForm = (formName: FormName) => {
	const form = formName === 'order' ? order : contacts;
	form.cleanFieldValues();
	modal.render({
		content: form.render({
			valid: false,
			errors: [],
		}),
	});
};

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		console.log(card)
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category
		});
	});
});

events.on('card:select', (item: IProduct) => {
	const card: Card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.isInCart(item)) {
				appData.addToCart(item);
			} else {
				appData.removeFromCart(item);
			}
			card.inCart = appData.isInCart(item);
		},
	});
	card.inCart = appData.isInCart(item);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

events.on('cart:changed', () => {
	page.counter = appData.getCartCount();
	cart.items = appData.cart.map((item, index) => {
		const card: Card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeFromCart(item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	const totalNumber = appData.getTotalCartPrice();
	cart.total = totalNumber;
	cart.toggleButton(!totalNumber);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('cart:open', () => {
	modal.render({ content: cart.render() });
});

events.on('order:open', () => {
	appData.clearOrderForm();
	renderForm('order');
});

events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IAnyForm; value: string }) => {
		appData.changeField(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	onFormErrorsChange({ errors, form: order });
});

events.on('contactsFormErrors:change', (errors: Partial<IContactsForm>) => {
	onFormErrorsChange({ errors, form: contacts });
});

events.on('order:submit', () => {
	renderForm('contacts');
});

events.on('contacts:submit', () => {
	appData.prepareOrder();
	api
		.postOrder(appData.getOrderData())
		.then(() => {
			modal.render({
				content: success.render({
					total: appData.getTotalCartPrice(),
				}),
			});
			appData.clearCartState();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('success:submit', () => modal.close());

api.getItemList().then((result) => {
		appData.setCatalog(result);
	})
	.catch((err) => {
		console.error(err);
	});
