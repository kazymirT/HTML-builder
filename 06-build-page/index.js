const fsPromises = require('fs/promises');
const path = require('path');
const assets = path.join(__dirname, 'assets');
const projectDistAssets = path.join(__dirname, 'project-dist', 'assets');
const styles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');
const projectDistHtml = path.join(__dirname, 'project-dist', 'index.html');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');

const mergeStyle = async (pathStyles, pathMerge) => {
  await fsPromises.mkdir(pathMerge, { recursive: true });
  const contents = await fsPromises.readdir(pathStyles);
  await fsPromises.writeFile(path.join(pathMerge, 'style.css'), '');

  for (const e of contents) {
    const ext = path.parse(e).ext;
    if (ext === '.css') {
      const fileContent = await fsPromises.readFile(path.join(pathStyles, e), 'utf-8');
      await fsPromises.appendFile(path.join(pathMerge, 'style.css'), fileContent);
        
    }
  }
};
mergeStyle(styles, projectDist);

const copyDir = async (pathDirCopy, pathDir) => {
  try {
    if (await fsPromises.access(pathDirCopy).then(() => true).catch(() => false)) {
      await fsPromises.rm(pathDirCopy, { recursive: true });
    }
    await fsPromises.mkdir(pathDirCopy, { recursive: true });
    const contents = await fsPromises.readdir(pathDir, { withFileTypes: true });

    for(const e of contents) {
      if (e.isDirectory()) {
        copyDir(path.join(pathDirCopy, e.name), path.join(pathDir, e.name));
      } else if (e.isFile() && /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i.test(e.name)) {
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
copyDir(projectDistAssets, assets);

const copyHtml = async (pathTemplate, pathHtml, componentsDir) => {
  const exists = await fsPromises.access(pathHtml).then(() => true).catch(() => false);
  if (exists) {
    await fsPromises.unlink(pathHtml);
  }
  const componentObj = {};
  let fileContent = await fsPromises.readFile(path.join(pathTemplate), 'utf-8');
  await fsPromises.appendFile(path.join(pathHtml), fileContent);
  const components = await fsPromises.readdir(componentsDir);
  for(const component of components) {
    if (path.parse(component).ext === '.html') {
      componentObj[path.parse(component).name] = await fsPromises.readFile(path.join(componentsDir, component), 'utf-8');
    }
  }
  let keys = Object.keys(componentObj);
  for(let key of keys) {
    fileContent = fileContent.replace(`{{${key}}}`,componentObj[key]);
  }
  await fsPromises.writeFile(pathHtml, fileContent);

};
copyHtml(template, projectDistHtml, components);