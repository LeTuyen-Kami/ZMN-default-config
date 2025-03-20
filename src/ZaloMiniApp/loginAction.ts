import { loginInfoAtom } from "@/contexts/auth";
import { quickLoginApi } from "@/services/other/authService";
import store from "../contexts/store";
import { ENV, setToken } from "../utils/api";
import { getPhoneNumberApi } from "./login";

export const handleLogin = async (forceDevData?: boolean) => {
  return await getPhoneNumberApi()
    .then(async (data) => {
      console.log("data", data);
      const devData =
        ((ENV.VITE_APP_ENVIRONMENT === "dev" ||
          ENV.VITE_APP_ENVIRONMENT === "stage") &&
          !data) ||
        forceDevData
          ? {
              phoneNumber: ENV.VITE_APP_ACCOUNT,
              zaloInfo: {
                userInfo: {
                  name: ENV.VITE_APP_ZALO_NAME,
                  id: ENV.VITE_APP_ZALO_ID,
                },
              },
            }
          : data;

      console.log("devData", devData);
      if (!devData || !devData?.phoneNumber) {
        throw {
          code: 1000,
          message: "Không lấy được số điện thoại!",
        };
      }

      const params = {
        phoneNumber: devData?.phoneNumber,
        userfullName: devData?.zaloInfo?.userInfo?.name || devData?.phoneNumber,
        id: devData?.zaloInfo?.userInfo?.id || devData?.phoneNumber,
        merchantId: ENV.VITE_APP_MERCHANT_ID,
      };

      store.set(loginInfoAtom, {
        phoneNumber: devData?.phoneNumber,
        zaloId: devData?.zaloInfo?.userInfo?.id,
        userFullName: devData?.zaloInfo?.userInfo?.name,
        merchantId: ENV.VITE_APP_MERCHANT_ID,
        zaloToken: "",
      });

      // showModalLoading();
      return await quickLoginApi(params)
        .then(async (res) => {
          await setToken({
            accessToken: res?.data?.accessToken,
            refreshToken: res?.data?.refreshToken,
            expiresIn: res?.data?.expiresIn,
            tokenType: res?.data?.tokenType,
          });
          console.log("res", res);

          return res;
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => {
          // hideModalLoading();
        });
    })
    .catch((error) => {
      throw error;
    });
};
