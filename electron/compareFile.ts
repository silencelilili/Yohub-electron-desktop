/**
 * 文件比较
 * 1. 计算文件的 MD5 值
 * 2. 比较两个文件的 MD5 值
 * 3. 更新文件
 *
 * 性能问题：对于大文件，计算 MD5 值可能需要一些时间
 */
import fs from "fs";
import crypto from "crypto";

/**
 * 1. 计算文件的 MD5 值
 * @param filePath 文件路径
 * @returns Promise<string>
 */
function calculateMD5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = fs.createReadStream(filePath);

    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("data", (chunk) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });
  });
}

function calculateStreamMD5(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = text;
    hash.update(stream);
    resolve(hash.digest("hex"));
  });
}

/**
 * 2. 比较两个文件的 MD5 值
 * @param file1 旧文件
 * @param file2 新文件
 * @param callback 回调函数
 */
async function compareFiles(
  file1: string,
  file2: string,
  callback: Function
): Promise<void> {
  try {
    const md5File1 = await calculateMD5(file1);
    const md5File2 = await calculateStreamMD5(file2);
    if (md5File1 === md5File2) {
      console.log("文件内容一致，无需更新。");
      callback(true);
    } else {
      console.log("文件内容不一致，需要更新。");
      callback(false);
      // updateFile(file1, file2);
    }
  } catch (error) {
    console.error("计算 MD5 时出错:", error);
  }
}

/**
 * 3. 更新文件
 * @param sourceFile
 * @param targetFile
 * @desc 如果文件内容不一致，可以替换旧文件为新文件
 */
function updateFile(sourceFile: string, targetFile: string): void {
        // fs.copyFile
  fs.writeFileSync(sourceFile, targetFile, (err) => {
    if (err) {
      console.error("文件更新失败:", err);
    } else {
      console.log("文件更新成功。");
    }
  });
}

/**
 * How to use:
  const filePath1 = "path/to/old/file";
  const filePath2 = "path/to/new/file";
  compareFiles(filePath1, filePath2);
 */

export default compareFiles;
