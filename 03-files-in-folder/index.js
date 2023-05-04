const fs = require('fs/promises');
const path = require('path');

const getDirectoryContents = async (dirPath) => {
  try {
    const contents = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of contents) {
      if (entry.isFile()) {
        const {name} = path.parse(entry.name);
        const ext = path.parse(entry.name).ext.slice(1);
        const { size } = await fs.stat(path.join(dirPath, entry.name));
        console.log(`${name}--${ext}--${size}`);
      }
    }
  } catch (err) {
    console.error(`Помилка при читанні папки ${dirPath}: ${err}`);
  }
};

getDirectoryContents(path.join(__dirname, 'secret-folder'));
