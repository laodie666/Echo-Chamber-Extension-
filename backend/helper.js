import { promises as fs } from 'node:fs'; // Importing the file system module

export async function readFile() {
    try {
        const data = await fs.readFile('./backend/data.json', 'utf8');
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const data = await readFile();
console.log(data);
