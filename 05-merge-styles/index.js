const fsPromises = require('fs/promises');
const path = require('path');

const mergeStyle = async (pathStyles, pathMerge) => {
  const contents = await fsPromises.readdir(pathStyles);
  await fsPromises.writeFile(path.join(pathMerge, 'bundle.css'), '');

  for (const e of contents) {
    const ext = path.parse(e).ext;
    if (ext === '.css') {
      const fileContent = await fsPromises.readFile(path.join(pathStyles, e), 'utf-8');
      await fsPromises.appendFile(path.join(pathMerge, 'bundle.css'), fileContent);
        
    }
  }
};

mergeStyle(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist'));