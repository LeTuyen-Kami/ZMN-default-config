import { closeApp } from "zmp-sdk";
import { reload } from ".";

export const reloadZaloMiniApp = () => {
  return reload();
};

export const closeZaloMiniApp = () => {
  try {
    closeApp();
  } catch (error) {
    console.log("closeZaloMiniApp", error);
  }
};
