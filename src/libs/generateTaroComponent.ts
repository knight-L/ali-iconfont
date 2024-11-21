/*
 * @Author: Knight
 * @Date: 2024-11-21 10:09:21
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-21 16:11:31
 */
import fs from "fs";
import path from "path";
import colors from "colors";
import { Config } from "./getConfig";
import {
  replaceComponentName,
  replaceExports,
  replaceSingleIconContent,
} from "./replace";
import { getTemplate } from "./getTemplate";
import { XmlData } from "../commands/createIcon";
import { camelCase, upperFirst } from "lodash";
import { whitespace } from "./whitespace";

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

    const component = generateCase(item, 4);

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

const ATTRIBUTE_FILL_MAP = ["path"];

export const generateCase = (
  data: XmlData["svg"]["symbol"][number],
  baseIdent: number
) => {
  let template = `<svg viewBox='${data.$.viewBox}' xmlns='http://www.w3.org/2000/svg' width='1em' height='1em'>`;

  for (const domName of Object.keys(data)) {
    if (domName === "$") {
      continue;
    }

    const counter = {
      colorIndex: 0,
      baseIdent,
    };

    if (data[domName].$) {
      template += `<${domName}${addAttribute(
        domName,
        data[domName],
        counter
      )} />`;
    } else if (Array.isArray(data[domName])) {
      data[domName].forEach((sub) => {
        template += `<${domName}${addAttribute(domName, sub, counter)} />`;
      });
    }
  }

  template += `</svg>`;

  return template.replace(/<|>/g, (matched) => encodeURIComponent(matched));
};

export const addAttribute = (
  domName: string,
  sub: XmlData["svg"]["symbol"][number]["path"][number],
  counter: { colorIndex: number; baseIdent: number }
) => {
  let template = "";

  if (sub && sub.$) {
    if (ATTRIBUTE_FILL_MAP.includes(domName)) {
      sub.$.fill ??= "#999999";
    }

    for (let attributeName in sub.$) {
      if (attributeName === "fill") {
        template +=
          `${whitespace(counter.baseIdent + 4)}${camelCase(attributeName)}=` +
          "${color ??" +
          `'${sub.$[attributeName]}'` +
          "}";
        counter.colorIndex += 1;
      } else {
        template += `${whitespace(counter.baseIdent + 4)}${camelCase(
          attributeName
        )}='${sub.$[attributeName]}'`;
      }
    }
  }

  return template;
};
