/*
 * @Author: Knight
 * @Date: 2024-10-24 15:51:37
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-02 18:26:25
 */
import path from "path";
import fs from "fs";
import colors from "colors";
import defaultConfig from "./iconfont.json";

export interface Config {
  symbol_url: string;
  save_dir: string;
  trim_icon_prefix: string;
  unit: string;
  default_icon_size: number;
}

let cacheConfig: Config;

export const getConfig = () => {
  if (cacheConfig) {
    return cacheConfig;
  }

  const targetFile = path.resolve("iconfont.json");

  if (!fs.existsSync(targetFile)) {
    console.warn(
      colors.red(
        'File "iconfont.json" doesn\'t exist, did you forget to generate it?'
      )
    );
    process.exit(1);
  }

  const config = require(targetFile) as Config;

  if (!config.symbol_url || !/^(https?:)?\/\//.test(config.symbol_url)) {
    console.warn(colors.red("You are required to provide symbol_url"));
    process.exit(1);
  }

  if (config.symbol_url.indexOf("//") === 0) {
    config.symbol_url = "http:" + config.symbol_url;
  }

  config.save_dir = config.save_dir || defaultConfig.save_dir;
  config.default_icon_size =
    config.default_icon_size || defaultConfig.default_icon_size;
  config.unit = config.unit || defaultConfig.unit;

  cacheConfig = config;

  return config;
};
