// import { getPhoneNumberApi } from "./login";
// import { toggleIsLoadingOverlay } from "appRedux/slices/appSlice";
// import { zaloLoginAction } from "appRedux/actions/auth";

// export const handleLogin = async (dispatch) => {
//   const data = await getPhoneNumberApi();
//   const params = {
//     phoneNumber: data?.phoneNumber,
//     fullName: data?.zaloInfo?.userInfo?.name,
//     zaloToken: data?.zaloInfo?.accessToken,
//     zaloId: data?.zaloInfo?.userInfo?.id,
//   };
//   if (data?.phoneNumber) {
//     dispatch(toggleIsLoadingOverlay(true));
//     dispatch(
//       zaloLoginAction({
//         ...params,
//         callback: (isSuccess, res) => {
//           console.log("isSuccess", isSuccess);
//           dispatch(toggleIsLoadingOverlay(false));
//         },
//       })
//     );
//   }
// };

export const reload = () => {
  ZJSBridge.callCustomAction("action.ma.menu.reload", {}, () => {});
};
