const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src', function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        if (content.includes('`http://localhost:8080')) {
            content = content.replace(/`http:\/\/localhost:8080/g, '`${process.env.REACT_APP_API_BASE_URL}');
            modified = true;
        }

        if (content.includes('"http://localhost:8080')) {
            content = content.replace(/"http:\/\/localhost:8080/g, 'process.env.REACT_APP_API_BASE_URL + "');
            modified = true;
        }

        if (content.includes("'http://localhost:8080")) {
            content = content.replace(/'http:\/\/localhost:8080/g, "process.env.REACT_APP_API_BASE_URL + '");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Modified: ' + filePath);
        }
    }
});
