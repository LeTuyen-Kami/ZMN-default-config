import axios from "axios";
import { refreshAccessToken } from "@/services/other/jwtService";
import { BASE_URL, getToken, handleExpiredToken } from "@/utils/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `${token.tokenType} ${token.accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: any) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const { response, config } = error;
    const originalRequest = config;

    if (response && response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance.request(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          const newToken = await refreshAccessToken();

          processQueue(null, newToken);
          resolve(axiosInstance.request(originalRequest));
        } catch (err) {
          processQueue(err, null);
          handleExpiredToken();
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);
export const IDP_ENDPOINT = "/third-party/api/v2/idp";
export const GAME_ENDPOINT = "/game/api";

// Implement cancellation
const { CancelToken } = axios;
export const source = CancelToken.source();
