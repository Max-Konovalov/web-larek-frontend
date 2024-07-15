import {Uuid} from "../../../types";
import {IAnyForm} from "../../forms/IAnyForm";

export interface IOrder extends IAnyForm {
    total: number;
    items: Uuid[];
}