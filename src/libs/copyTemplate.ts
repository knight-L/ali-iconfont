/*
 * @Author: Knight
 * @Date: 2024-10-24 15:51:37
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-21 10:53:59
 */
import fs from "fs";
import path from "path";

export const copyTemplate = (fromFile: string, toFile: string) => {
  return fs.copyFileSync(
    path.join(__dirname, `../templates/${fromFile}.template`),
    toFile
  );
};
