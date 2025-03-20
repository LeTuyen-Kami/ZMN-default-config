import { atomWithStorage } from "jotai/utils";
import { clearLocalStorage } from "../utils/api";
import { hideModalLoading } from "./atom";
import { queryClient } from "./reactQuery";
import store from "./store";

interface AuthProps {
  zaloToken: string;
  isLogin: boolean;
  isPending: boolean;
  phoneNumber: string;
  storeCode: string;
  userGameSessionId: string;
}

const initialState: AuthProps = {
  zaloToken: "",
  isLogin: false,
  isPending: false,
  phoneNumber: "",
  storeCode: "",
  userGameSessionId: "",
};

const authAtom = atomWithStorage<AuthProps>("auth", initialState, undefined, {
  getOnInit: true,
});

export const signInAction = () => {
  store.set(authAtom, {
    zaloToken: "",
    isLogin: true,
    isPending: false,
    phoneNumber: "",
    storeCode: "",
    userGameSessionId: "",
  });
};

interface loginInfo {
  phoneNumber: string;
  zaloId: string;
  zaloToken: string;
  userFullName: string;
  merchantId: string;
}

const initialLoginInfo: loginInfo = {
  phoneNumber: "",
  zaloId: "",
  zaloToken: "",
  userFullName: "",
  merchantId: "",
};

export const loginInfoAtom = atomWithStorage<loginInfo>(
  "loginInfo",
  initialLoginInfo,
  undefined,
  {
    getOnInit: true,
  }
);

export const signOutAction = () => {
  store.set(authAtom, initialState);
  store.set(loginInfoAtom, initialLoginInfo);

  setTimeout(() => {
    queryClient.clear();
  }, 1000);

  hideModalLoading();
  clearLocalStorage();
};

export default authAtom;
