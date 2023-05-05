const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = async (pathDirCopy, pathDir) => {
  try {
    if (await fsPromises.access(pathDirCopy).then(() => true).catch(() => false)) {
      await fsPromises.rm(pathDirCopy, { recursive: true });
    }
    await fsPromises.mkdir(pathDirCopy, { recursive: true });
    const contents = await fsPromises.readdir(pathDir);

    for(const e of contents) {
      await fsPromises.writeFile(path.join(pathDirCopy, e), '');
      const fileContent = await fsPromises.readFile(path.join(pathDir, e), 'utf-8');
      await fsPromises.appendFile(path.join(pathDirCopy, e), fileContent);
    }
  } catch (err) {
    console.error(err.message);
  }
};

copyDir(path.join(__dirname, 'files-copy'), path.join(__dirname, 'files'));
