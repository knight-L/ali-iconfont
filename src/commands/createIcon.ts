#!/usr/bin/env node

import axios from "axios";
import colors from "colors";
import { parseString } from "xml2js";
import { getConfig } from "../libs/getConfig";
import { generateComponent } from "../libs/generateComponent";
import { generateTaroComponent } from "../libs/generateTaroComponent";

export interface XmlData {
  svg: {
    symbol: Array<{
      $: {
        viewBox: string;
        id: string;
      };
      path: Array<{
        $: {
          d: string;
          fill?: string;
        };
      }>;
    }>;
  };
}

const config = getConfig();

axios
  .get(config.symbol_url)
  .then((result) => {
    const matches = String(result.data).match(/<svg>[\s\S]*?<\/svg>/);

    if (!matches?.length) {
      throw new Error("Unable to get svg content");
    }

    parseString(matches?.[0]!, (err, result: XmlData) => {
      if (result) {
        switch (config.type) {
          case "H5":
            generateComponent(result, config);
            break;
          case "Taro":
            generateTaroComponent(result, config);
            break;
        }
      } else {
        throw err;
      }
    });
  })
  .catch((e) => {
    console.error(colors.red(e.message || "Unknown Error"));
    process.exit(1);
  });
