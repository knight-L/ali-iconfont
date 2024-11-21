/*
 * @Author: Knight
 * @Date: 2024-11-21 10:05:12
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-21 14:30:55
 */
import { XmlData } from "../commands/createIcon";
import { replaceHexToRgb } from "./replace";

const ATTRIBUTE_FILL_MAP = ["path"];

export const generateCase = (
  data: XmlData["svg"]["symbol"][number],
  config?: {
    hexToRgb: boolean;
  }
) => {
  let template = `<svg viewBox='${data.$.viewBox}' xmlns='http://www.w3.org/2000/svg' width='1em' height='1em'>`;

  for (const domName of Object.keys(data)) {
    if (domName === "$") {
      continue;
    }

    const counter = {
      colorIndex: 0,
    };

    if (data[domName].$) {
      template += `<${domName}${addAttribute(
        domName,
        data[domName],
        counter,
        config
      )} />`;
    } else if (Array.isArray(data[domName])) {
      data[domName].forEach((sub) => {
        template += `<${domName}${addAttribute(
          domName,
          sub,
          counter,
          config
        )} />`;
      });
    }
  }

  template += `</svg>`;

  return template.replace(/<|>/g, (matched) => encodeURIComponent(matched));
};

const addAttribute = (
  domName: string,
  sub: XmlData["svg"]["symbol"][number]["path"][number],
  counter: { colorIndex: number },
  config?: {
    hexToRgb: boolean;
  }
) => {
  let template = "";

  if (sub && sub.$) {
    if (ATTRIBUTE_FILL_MAP.includes(domName)) {
      // Set default color same as in iconfont.cn
      // And create placeholder to inject color by user's behavior
      sub.$.fill = sub.$.fill || "currentColor";
    }

    for (const attributeName of Object.keys(sub.$)) {
      if (attributeName === "fill") {
        let color: string | undefined;
        // let keyword: string;
        if (config?.hexToRgb) {
          color = replaceHexToRgb(sub.$[attributeName]);
          //   keyword = "colors";
        } else {
          //   keyword = "color";
          color = sub.$[attributeName];
        }
        template += ` ${attributeName}='${color}'`;
        counter.colorIndex += 1;
      } else {
        template += ` ${attributeName}='${sub.$[attributeName]}'`;
      }
    }
  }

  return template;
};
