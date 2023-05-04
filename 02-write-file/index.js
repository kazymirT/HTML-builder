const path = require('path');
const fs = require('fs');
const { stdin, stdout, exit } = process;

stdout.write('Уведіть ваш текст, для скасування введіть "exit"\n');

fs.writeFile(
  path.join(__dirname, 'text.txt'), '' ,(err) => {
    if (err) throw err;});

stdin.on('data', data=>{
  if (data.toString().trim() === 'exit') {
    stdout.write('\nВи закінчили ввід тексту\n');
    exit();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text.txt'),data,err => {
        if (err) throw err;
      }
    );
  }
});

process.on('SIGINT', ()=>{
  stdout.write('\nВи закінчили ввід тексту\n');
  stdin.pause();
  exit();
});
