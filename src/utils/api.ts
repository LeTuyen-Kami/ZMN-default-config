import axios from "axios";
import _ from "lodash";

import { CODE_KEY } from "../constants/errors";
import { signOutAction } from "@/contexts/auth";

interface IENV {
  VITE_APP_ID: string;
  VITE_APP_API_URL: string;
  VITE_APP_ENVIRONMENT: string;
  VITE_APP_ACCOUNT: string;
  VITE_APP_ZALO_NAME: string;
  VITE_APP_ZALO_ID: string;
  VITE_APP_MERCHANT_ID: string;
  VITE_APP_ZALO_SECRET_KEY: string;
  VITE_APP_AUTH_CLIENT_ID: string;
  VITE_APP_AUTH_CLIENT_SECRET: string;
  VITE_APP_IDENTITY_SERVER: string;
}

export const ENV: IENV = (import.meta as any).env;

export const BASE_URL = ENV.VITE_APP_API_URL || "";

export const getToken = () => {
  const token = localStorage.getItem("token");
  return token
    ? (JSON.parse(token) as {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        tokenType: string;
      })
    : null;
};

export const setToken = (token: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}) => {
  const oldToken = getToken();
  if (oldToken) {
    localStorage.setItem(
      "token",
      JSON.stringify({
        accessToken: token.accessToken ?? oldToken.accessToken,
        refreshToken: token.refreshToken ?? oldToken.refreshToken,
        expiresIn: token.expiresIn ?? oldToken.expiresIn,
        tokenType: token.tokenType ?? oldToken.tokenType,
      })
    );
  } else {
    localStorage.setItem("token", JSON.stringify(token));
  }
};

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const clearAccessToken = () => {
  const token = getToken();
  if (token) {
    token.accessToken = "";
    setToken(token);
  }
};

export const clearLocalStorage = () => {
  const allKeys = Object.keys(localStorage);
  for (const key of allKeys) {
    if (key !== "isFirstLogin" && key !== "REACT_QUERY_OFFLINE_CACHE") {
      localStorage.removeItem(key);
    }
  }
};

export const setAuthToken = (token?: {
  accessToken: string;
  tokenType: string;
}) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `${token.tokenType} ${token.accessToken}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

function convertDataError(error: any) {
  const { code = {}, message, status, Messages, messages } = error;

  if (message && message.search("Cannot read property") >= 0) {
    return {
      code: CODE_KEY.UNDEFINED,
      message: "Truy vấn dữ liệu lỗi.",
      status,
    };
  }
  if (message && message.search("Network Error") >= 0) {
    return {
      code: CODE_KEY.ERROR_NETWORK,
      message: "Không thể kết nối tới server.",
      status,
    };
  }

  if (Array.isArray(messages) && !_.isEmpty(messages)) {
    return {
      code,
      message: messages[0]?.content,
      status,
    };
  }

  if (Array.isArray(Messages) && !_.isEmpty(Messages)) {
    return {
      code,
      message: Messages[0]?.Content,
      status,
    };
  }

  return error;
}

export function handleErrorMessage(err: any) {
  const { response } = err;
  if (response?.data) {
    return convertDataError(response.data);
  }
  return convertDataError(err);
}

export const handleExpiredToken = () => {
  const token = getToken();
  const accessToken = token?.accessToken;
  if (!accessToken) {
    signOutAction();
  }
};
