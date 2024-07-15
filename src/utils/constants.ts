import {WebLarekApi} from "../components/card/webLarekApi";
import {EventEmitter} from "../components/base/events";
import {AppState} from "../components/state/appData";
import {Page} from "../components/views/page/pageView";
import {cloneTemplate, ensureElement} from "./utils";
import {Modal} from "../components/common/modal";
import {Cart} from "../components/cart/cart";
import {Order} from "../components/forms/order/orderForm";
import {Contacts} from "../components/forms/contacts/contactForm";
import {Success} from "../components/views/success/succesView";

export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

export const ACTIVE_BUTTON_CLASS = 'button_alt-active';

export const api = new WebLarekApi(CDN_URL, API_URL);
export const events = new EventEmitter();
export const appData = new AppState({}, events);
export const page = new Page(document.body, events);
export const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
export const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
export const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
export const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
export const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
export const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
export const successTemplate = ensureElement<HTMLTemplateElement>('#success');
export const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
export const cart = new Cart(cloneTemplate(cartTemplate), events);
export const order = new Order(cloneTemplate(orderTemplate), events);
export const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
export const success = new Success(cloneTemplate(successTemplate), events);