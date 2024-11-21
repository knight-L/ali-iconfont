/*
 * @Author: Knight
 * @Date: 2024-11-21 10:09:21
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-21 12:01:17
 */
import fs from "fs";
import path from "path";
import colors from "colors";
import { Config } from "./getConfig";
import { generateCase } from "./utils";
import {
  replaceComponentName,
  replaceExports,
  replaceSingleIconContent,
} from "./replace";
import { getTemplate } from "./getTemplate";
import { XmlData } from "../commands/createIcon";
import { camelCase, upperFirst } from "lodash";

export const generateTaroComponent = (data: XmlData, config: Config) => {
  const names: string[] = [];
  const imports: string[] = [];
  const saveDir = path.resolve(config.save_dir);
  const jsxExtension = ".tsx";

  fs.mkdirSync(saveDir, { recursive: true });

  data.svg.symbol.forEach((item) => {
    let singleFile: string;
    const iconId = item.$.id;
    const iconIdAfterTrim = config.trim_icon_prefix
      ? iconId.replace(
          new RegExp(`^${config.trim_icon_prefix}(.+?)$`),
          (_, value) => value.replace(/^[-_.=+#@!~*]+(.+?)$/, "$1")
        )
      : iconId;
    const componentName = upperFirst(camelCase(iconId));

    names.push(iconIdAfterTrim);
    imports.push(componentName);

    const component = generateCase(item, { hexToRgb: true });

    singleFile = getTemplate("Taro" + jsxExtension);
    singleFile = replaceComponentName(singleFile, componentName);
    singleFile = replaceSingleIconContent(singleFile, component);

    fs.writeFileSync(
      path.join(saveDir, componentName + jsxExtension),
      singleFile
    );

    console.log(`${colors.green("√")} 生成图标 "${colors.yellow(iconId)}"`);
  });

  let iconFile = getTemplate("Icon" + jsxExtension);

  iconFile = replaceExports(iconFile, imports);

  fs.writeFileSync(path.join(saveDir, "index" + jsxExtension), iconFile);

  console.log(
    `\n${colors.green("√")} 图标已生成到目录: ${colors.green(
      config.save_dir
    )}\n`
  );
};
