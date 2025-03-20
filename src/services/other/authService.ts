import { ENV } from "@/utils/api";
import { axiosInstance, source } from "../base/axiosInstance";

export const quickLoginApi = (data: {
  phoneNumber?: string;
  userFullName?: string;
  token?: string;
  id?: string;
  merchantId?: string;
}) => {
  return axiosInstance
    .post("/auth/enduser/api/v2/auth/motul/zalo-mini-app/quick-login", data, {
      cancelToken: source.token,
    })
    .then((res) => res.data);
};

export const getZaloInfoApi = (token: string, accessToken: string) => {
  return new Promise((resolve, reject) => {
    // showModalLoading();
    axiosInstance
      .post(`/third-party/api/v1/motul/retrive-zalo-phone-number`, {
        access_token: accessToken,
        code: token,
        secret_key: ENV.VITE_APP_ZALO_SECRET_KEY,
      })
      .then((res) => {
        const data = res.data;
        if (data?.error) {
          reject(data);
        }
        resolve(data);
      })
      .catch((error) => reject(error));
    // .finally(() => hideModalLoading());
  });
};
