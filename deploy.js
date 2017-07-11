var fs = require('fs');

function renameFile(oldFileName, newFileName) {
  const oldFilePath = __dirname + '/dist/' + oldFileName;
  const newFilePath = __dirname + '/dist/' + newFileName;
  if (fs.existsSync(oldFilePath)) {
    fs.rename(oldFilePath, newFilePath, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`The file ${oldFileName} has been re-named to ${newFileName}`);
    });
  }
}

renameFile('index_prod.html','index.html');
renameFile('app.config.prod.json','app.config.json');