/*
 * @Author: Knight
 * @Date: 2024-10-24 15:51:37
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-21 14:46:42
 */
import fs from "fs";
import path from "path";
import colors from "colors";
import { camelCase, upperFirst } from "lodash";
import { Config } from "./getConfig";
import { getTemplate } from "./getTemplate";
import {
  replaceComponentName,
  replaceExports,
  replaceSingleIconContent,
} from "./replace";
import { whitespace } from "./whitespace";
import { XmlData } from "../commands/createIcon";
import { addAttribute } from "./utils";

export const generateComponent = (data: XmlData, config: Config) => {
  const names: string[] = [];
  const imports: string[] = [];
  const saveDir = path.resolve(config.save_dir);
  const jsxExtension = ".tsx";
  let cases: string = "";

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

    cases += `${whitespace(4)}case '${iconIdAfterTrim}':\n`;

    imports.push(componentName);
    cases += `${whitespace(6)}return <${componentName} {...rest} />;\n`;

    singleFile = getTemplate("SingleIcon" + jsxExtension);
    singleFile = replaceComponentName(singleFile, componentName);
    singleFile = replaceSingleIconContent(singleFile, generateCase(item, 4));

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
    "\n",
    `${colors.green("√")} 图标已生成到目录: ${colors.green(config.save_dir)}`,
    "\n"
  );
};

const generateCase = (
  data: XmlData["svg"]["symbol"][number],
  baseIdent: number
) => {
  let template = `\n${whitespace(
    baseIdent
  )}<svg width="1em" height="1em" viewBox="${data.$.viewBox}" {...rest}>\n`;

  for (const domName of Object.keys(data)) {
    if (domName === "$") {
      continue;
    }

    if (!domName) {
      console.error(colors.red(`Unable to transform dom "${domName}"`));
      process.exit(1);
    }

    const counter = {
      colorIndex: 0,
      baseIdent,
    };

    if (data[domName].$) {
      template += `${whitespace(baseIdent + 2)}<${domName}${addAttribute(
        domName,
        data[domName],
        counter
      )}\n${whitespace(baseIdent + 2)}/>\n`;
    } else if (Array.isArray(data[domName])) {
      data[domName].forEach((sub) => {
        template += `${whitespace(baseIdent + 2)}<${domName}${addAttribute(
          domName,
          sub,
          counter
        )}\n${whitespace(baseIdent + 2)}/>\n`;
      });
    }
  }

  template += `${whitespace(baseIdent)}</svg>\n`;

  return template;
};
