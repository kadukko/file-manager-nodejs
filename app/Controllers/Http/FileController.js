"use strict";

const path = require("path");
const fs = require("fs");

const Helpers = use("Helpers");

class FileController {
  async index({ request, response }) {
    const publicPath = path.join(Helpers.appRoot(), "public");

    let dir = [];

    const exploreDir = async (caminho) => {
      const files = await fs.promises.readdir(path.join(publicPath, caminho));

      for (let i = 0; i < files.length; i++) {
        const filename = files[i];

        const file = await fs.promises.lstat(
          path.join(publicPath, caminho, filename)
        );

        dir.push({
          path: caminho,
          filename,
          type: file.isDirectory() ? "folder" : "file",
          size: file.size,
        });

        if (file.isDirectory()) {
          await exploreDir(path.join(caminho, filename));
        }
      }
    };

    await exploreDir("/");

    dir = dir.map((elem, index) => {
      return { ...elem, id: index };
    });

    return dir;
  }
}

module.exports = FileController;
