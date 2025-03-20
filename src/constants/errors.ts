export const CODE_KEY = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ERROR_NETWORK: "ERROR_NETWORK",
  TIME_OUT: 408,
  UNAUTHORIZED_STATUS: 401,
  NOT_INTERNET: "NOT_INTERNET",
  UNDEFINED: "UNDEFINED",
  UNKNOWN: "UNKNOWN",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  LOGIN_FAILED: "LOGIN_FAILED",

  NOT_PERMISSION: "NOT_PERMISSION",
  DUPPLICATE: "DUPPLICATE",
};

export const ERROR_MESSAGE = {
  [CODE_KEY.UNAUTHORIZED_STATUS]:
    "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.",
  [CODE_KEY.USER_NOT_FOUND]: "Người dùng không tồn tại.",
  [CODE_KEY.LOGIN_FAILED]:
    "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập.",
  [CODE_KEY.NOT_INTERNET]:
    "Không có kết nối internet. Vui lòng kiểm tra đường truyền",
  [CODE_KEY.NOT_FOUND]: "Không tìm thấy trang.",
};
