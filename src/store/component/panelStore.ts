import {
  BusinessHolderType,
  BusinessUserResponseType,
} from "@/interfaces/BusinessContainer/BusinessUser/BusinessUserResponseType";
import { atom } from "jotai";
import { globalStore } from "../globalStore";

export const panelIsOpenAtom = atom(false);
export const panelLoadingAtom = atom(true);
export const activeUserBusinessesAtom = atom<BusinessUserResponseType[]>([]);
export const businessesAtom = atom<BusinessHolderType[]>([]);
export const selectedBusinessAtom = atom<BusinessHolderType | null>(null);

globalStore.set(activeUserBusinessesAtom, []);
globalStore.set(selectedBusinessAtom, null);
