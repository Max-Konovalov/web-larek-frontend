import {IProduct} from "./IProduct";

export interface IWebLarekApi {
    getItemList: () => Promise<IProduct[]>;
}