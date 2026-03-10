const fs = require('fs');
const path = require('path');

const frPath = path.join(process.cwd(), 'src/locales/fr.json');
const enPath = path.join(process.cwd(), 'src/locales/en.json');
const dePath = path.join(process.cwd(), 'src/locales/de.json');

const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const de = JSON.parse(fs.readFileSync(dePath, 'utf8'));

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(getKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

const frKeys = new Set(getKeys(fr));
const enKeys = new Set(getKeys(en));
const deKeys = new Set(getKeys(de));

const allKeys = new Set([...frKeys, ...enKeys, ...deKeys]);

console.log('--- Missing in FR ---');
allKeys.forEach(key => {
    if (!frKeys.has(key)) console.log(key);
});

console.log('\n--- Missing in EN ---');
allKeys.forEach(key => {
    if (!enKeys.has(key)) console.log(key);
});

console.log('\n--- Missing in DE ---');
allKeys.forEach(key => {
    if (!deKeys.has(key)) console.log(key);
});
