/*
 * @Author: Knight
 * @Date: 2024-10-24 15:51:37
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-14 10:45:40
 */
import fs from "fs";
import path from "path";

export const getTemplate = (fileName: string) => {
  return fs
    .readFileSync(path.join(__dirname, `../../templates/${fileName}.template`))
    .toString();
};
