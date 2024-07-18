import {IProduct} from "../base/interfaces/IProduct";
import {IOrder} from "../base/interfaces/IOrder";
import {ContactsFormErrors, OrderFormErrors} from "../../types";



export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    order: IOrder;
    orderFormErrors: OrderFormErrors;
    contactsFormErrors: ContactsFormErrors;
}