import './scss/styles.scss';

import { AppState } from './components/appData';
import { Cart } from './components/cart';
import { Card } from './components/card';
import { Contacts } from './components/contactForm';
import { WebLarekApi } from './components/cardsApi';
import { Order } from './components/orderForm';
import { Page } from './components/pageView';
import { Success } from './components/succesView';
import { EventEmitter } from './components/base/events';
import { Form } from './components/common/form';
import { Modal } from './components/common/modal';
import { FormName, IAnyForm, IContactsForm, IProduct, IOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appData = new AppState({}, events);
const page = new Page(document.body, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

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
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
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

events.on('basket:changed', () => {
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

events.on('basket:open', () => {
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
		})
		.finally(() => {
			appData.clearOrderForm();
		});
});

events.on('success:submit', () => modal.close());

api.getItemList().then((result) => {
		appData.setCatalog(result);
	})
	.catch((err) => {
		console.error(err);
	});
