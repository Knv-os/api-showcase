const fs = require('fs/promises');

async function ensureDir(path) {
  await fs.mkdir(path, { recursive: true });
}

process.argv.forEach(async (val, index) => {
  console.log(val);
  if (index == 2) {
    await ensureDir(`./src/apis/${val}`);
    await ensureDir(`./src/apis/${val}/controllers`);
    await ensureDir(`./src/apis/${val}/dtos`);
    await ensureDir(`./src/apis/${val}/interfaces`);
    await ensureDir(`./src/apis/${val}/repositories`);
    await ensureDir(`./src/apis/${val}/routes`);
    await ensureDir(`./src/apis/${val}/services`);
    await ensureDir(`./src/apis/${val}/tests`);
  }
});
