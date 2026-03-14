const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                searchFiles(fullPath);
            }
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                if (line.includes('createNotification') && !line.includes('require') && !line.includes('const') && !line.includes('let') && !line.includes('var') && !line.includes('function') && !line.includes('=>') && !line.includes('exports.')) {
                    console.log(`Potential issue at ${fullPath}:${index + 1}: ${line.trim()}`);
                }
            });
        }
    }
}

searchFiles('.');
