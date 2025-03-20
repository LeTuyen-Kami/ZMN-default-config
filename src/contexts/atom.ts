import { atom } from "jotai";
import store from "./store";

interface LoadingAtom {
  show: boolean;
  message?: string;
  cancelable?: boolean;
}

export const loadingAtom = atom<LoadingAtom>({
  show: false,
  message: "",
  cancelable: false,
});

export const showModalLoading = () => {
  store.set(loadingAtom, {
    show: true,
    message: "Đang tải...",
    cancelable: false,
  });
};

export const hideModalLoading = () => {
  store.set(loadingAtom, {
    show: false,
    message: "",
    cancelable: false,
  });
};
