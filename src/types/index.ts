import {IOrderForm} from "../components/forms/order/IOrderForm";
import {IContactsForm} from "../components/forms/contacts/IContactsForm";

export type Uuid = string;
export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>;
export type ContactsFormErrors = Partial<Record<keyof IContactsForm, string>>;

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type FormName = 'order' | 'contacts';