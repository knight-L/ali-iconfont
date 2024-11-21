/*
 * @Author: Knight
 * @Date: 2024-10-24 15:51:37
 * @LastEditors: Knight
 * @LastEditTime: 2024-11-21 10:14:18
 */
export const replaceSize = (content: string, size: number) => {
  return content.replace(/#size#/g, String(size));
};

export const replaceCases = (content: string, cases: string) => {
  return content.replace(/#cases#/g, cases);
};

export const replaceNames = (content: string, names: string[]) => {
  return content.replace(/#names#/g, names.join(`' | '`));
};

export const replaceNamesArray = (content: string, names: string[]) => {
  return content.replace(
    /#namesArray#/g,
    JSON.stringify(names).replace(/"/g, "'").replace(/','/g, "', '")
  );
};

export const replaceComponentName = (content: string, name: string) => {
  return content.replace(/#componentName#/g, name);
};

export const replaceSingleIconContent = (content: string, render: string) => {
  return content.replace(/#iconContent#/g, render);
};

export const replaceImports = (content: string, imports: string[]) => {
  return content.replace(
    /#imports#/g,
    imports.map((item) => `import ${item} from './${item}';`).join("\n")
  );
};

export const replaceSizeUnit = (content: string, unit: string) => {
  return content.replace(/\{size\}/g, `{size + '${unit}'}`);
};

export const replaceExports = (content: string, exports: string[]) => {
  return content.replace(
    /#exports#/g,
    exports
      .map((item) => `export { default as ${item} } from './${item}';`)
      .join("\n")
  );
};

export const replaceHexToRgb = (hex) => {
  const rgb: number[] = [];

  //去除前缀 # 号
  hex = hex.substr(1);

  if (hex.length === 3) {
    // 处理 '#abc' 成 '#aabbcc'
    hex = hex.replace(/(.)/g, "$1$1");
  }

  hex.replace(/../g, (color: string) => {
    // 按16进制将字符串转换为数字
    rgb.push(parseInt(color, 0x10));

    return color;
  });

  return "rgb(" + rgb.join(",") + ")";
};

export const replaceIsRpx = (content: string, useRpx: boolean) => {
  return content
    .replace(/#rpx-1:(.+?):#/g, useRpx ? "$1" : "")
    .replace(/#rpx-0:(.+?):#/g, useRpx ? "" : "$1");
};
