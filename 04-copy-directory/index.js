const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = async (pathDirCopy, pathDir) => {
  try {
    if (await fsPromises.access(pathDirCopy).then(() => true).catch(() => false)) {
      await fsPromises.rm(pathDirCopy, { recursive: true });
    }
    await fsPromises.mkdir(pathDirCopy, { recursive: true });
    const contents = await fsPromises.readdir(pathDir);
    contents.forEach((e) => {
      fsPromises.writeFile(
        path.join(pathDirCopy, e),
        '',
        (err) => {
          if (err) throw err;
        }
      );
      const readableStream = fs.createReadStream(path.join(pathDir, e), 'utf-8');
      readableStream.on('data', chunk => {
        fs.appendFile(
          path.join(pathDirCopy, e),chunk,err => {
            if (err) throw err;
          }
        );
      });
    });
  } catch (err) {
    console.error(err.message);
  }
};

copyDir(path.join(__dirname, 'files-copy'), path.join(__dirname, 'files'));
