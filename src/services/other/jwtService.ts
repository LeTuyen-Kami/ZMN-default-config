import axios from "axios";
import {
  clearAccessToken,
  getToken,
  handleErrorMessage,
  setToken,
  ENV,
} from "@/utils/api";

const REQUEST_TIMEOUT = 15000;

export const refreshTokenApi = ({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}> => {
  const payload = {
    client_id: ENV.VITE_APP_AUTH_CLIENT_ID,
    client_secret: ENV.VITE_APP_AUTH_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  const data = new URLSearchParams(payload).toString();

  return new Promise((resolve, reject) => {
    axios
      .post(`${ENV.VITE_APP_IDENTITY_SERVER}connect/token`, data, {
        timeout: REQUEST_TIMEOUT,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const { data } = response;
        resolve(data);
      })
      .catch((err) => {
        //clear token
        clearAccessToken();
        reject(handleErrorMessage(err));
      });
  });
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const token = await getToken();
  if (token) {
    const data = await refreshTokenApi({
      refreshToken: token.refreshToken,
    });

    await setToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
    });
    return data?.access_token;
  }
  throw new Error("Token not found");
};
