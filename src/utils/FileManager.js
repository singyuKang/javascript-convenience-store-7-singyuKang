import fs from "fs";
import { ERROR_MESSAGE } from "../constants.js";

const HEADER_NUMBER = 0;
const START_ROW_NUMBER = 1;
const ROW_SPLIT_STANDARD = "\n";
const COLUMN_SPLIT_STANDARD = ",";

class FileManager {
  readFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async parseFile(filePath) {
    try {
      const data = await this.readFile(filePath);
      const rows = data
        .split(ROW_SPLIT_STANDARD)
        .filter((row) => row.trim() !== "");
      const headers = rows[HEADER_NUMBER].split(COLUMN_SPLIT_STANDARD);

      return rows.slice(START_ROW_NUMBER).map((row) => {
        const values = row.split(COLUMN_SPLIT_STANDARD);
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] === "null" ? null : values[index];
          return obj;
        }, {});
      });
    } catch (err) {
      throw new Error(ERROR_MESSAGE.FILE_PARSING);
    }
  }
}

export { FileManager };
