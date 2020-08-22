"use strict";

const Path = require("path");
const Fs = require("fs");

const Helpers = use("Helpers");
const Drive = use("Drive");

class FileController {
  async index({ request, response }) {
    const publicPath = Path.join(Helpers.appRoot(), "public");

    let dir = [];

    const exploreDir = async (caminho) => {
      const files = await Fs.promises.readdir(Path.join(publicPath, caminho));

      for (let i = 0; i < files.length; i++) {
        const filename = files[i];

        const file = await Fs.promises.lstat(
          Path.join(publicPath, caminho, filename)
        );

        dir.push({
          path: caminho,
          filename,
          type: file.isDirectory() ? "folder" : "file",
          size: file.size,
        });

        if (file.isDirectory()) {
          await exploreDir(Path.join(caminho, filename));
        }
      }
    };

    await exploreDir("/");

    dir = dir.map((elem, index) => {
      return { ...elem, id: index };
    });

    return dir;
  }

  async store({ request, response }) {
    const { path } = request.all();

    const file = request.file("file", {
      size: "200mb",
    });

    await file.move(Helpers.publicPath(path), { overwrite: true });
  }

  async destroy({ request, response }) {
    const { file } = request.all();

    await Drive.delete(Helpers.publicPath(file));
  }

  async move({ request, response }) {
    const { file, path } = request.all();

    const filename = file.split("/").reverse()[0];

    const f = await Drive.move(
      Helpers.publicPath(file),
      Helpers.publicPath(Path.join(path, filename)),
      { overwrite: true }
    );
  }

  async copy({ request, response }) {
    const { file, path } = request.all();

    const filename = file.split("/").reverse()[0];

    const f = await Drive.copy(
      Helpers.publicPath(file),
      Helpers.publicPath(Path.join(path, filename)),
      { overwrite: true }
    );
  }

  async newfolder({ request, response }) {
    const { path } = request.all();

    if (!Fs.existsSync(Helpers.publicPath(path))) {
      Fs.mkdirSync(Helpers.publicPath(path));
    }
  }
}

module.exports = FileController;
