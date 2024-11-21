/*
 * @Author: Knight
 * @Date: 2024-11-21 10:05:12
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-21 14:45:08
 */
import { camelCase } from "lodash";
import { XmlData } from "../commands/createIcon";
import { whitespace } from "./whitespace";

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
      sub.$.fill = sub.$.fill || "currentColor";
    }

    for (let attributeName in sub.$) {
      if (attributeName === "fill") {
        template += `\n${whitespace(counter.baseIdent + 4)}${camelCase(
          attributeName
        )}='${sub.$[attributeName]}'`;
        counter.colorIndex += 1;
      } else {
        template += `\n${whitespace(counter.baseIdent + 4)}${camelCase(
          attributeName
        )}="${sub.$[attributeName]}"`;
      }
    }
  }

  return template;
};
