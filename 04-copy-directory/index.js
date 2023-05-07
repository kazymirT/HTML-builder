const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = async (pathDirCopy, pathDir) => {
  try {
    if (await fsPromises.access(pathDirCopy).then(() => true).catch(() => false)) {
      await fsPromises.rm(pathDirCopy, { recursive: true });
    }
    await fsPromises.mkdir(pathDirCopy, { recursive: true });
    const contents = await fsPromises.readdir(pathDir, { withFileTypes: true });

    for(const e of contents) {
      if (e.isFile() && /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i.test(e.name)) {
        const fileContent = await fsPromises.readFile(path.join(pathDir, e.name));
        await fsPromises.writeFile(path.join(pathDirCopy, e.name), fileContent, { encoding: 'binary' });
      } else {
        await fsPromises.writeFile(path.join(pathDirCopy, e.name), '');
        const fileContent = await fsPromises.readFile(path.join(pathDir, e.name), 'utf-8');
        await fsPromises.appendFile(path.join(pathDirCopy, e.name), fileContent);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

copyDir(path.join(__dirname, 'files-copy'), path.join(__dirname, 'files'));
