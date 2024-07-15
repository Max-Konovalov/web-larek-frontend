import {IOrderForm} from "./order/IOrderForm";
import {IContactsForm} from "./contacts/IContactsForm";

export interface IAnyForm extends IOrderForm, IContactsForm {}