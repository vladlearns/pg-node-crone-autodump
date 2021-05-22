const { execute } = require('@getvim/execute');
const compress = require('gzipme');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const dotenv = require('dotenv');

dotenv.config();

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

const date = new Date();

// Add one if you don't want to return the previous month, as it starts from 0
const currentDate = ${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()};

// Tar for size reducing and for restoring it later
const fileName = database-dump-${currentDate}.tar;
const path = "your/path/to/file";

const file = path.join(path, fileName);

function dump() {
  //This isn't the best thing in terms of security, there is a better workaround, but it is the simplest one
  execute(`PGPASSWORD="${password}" pg_dump -U ${username} -d ${database} -f ${file} -F t`).then(async () => {
    await compress(file);
    fs.unlinkSync(file);
    console.log('Dump was created');
  }).catch((err) => {
    console.log(err);
  });
}

function startJob() {
  console.log('Dumping is running');
  //refer to https://crontab.guru/ to learn more
  cron.schedule('* * * * *', () => {
    dump();
  });
}

module.exports = {
  startJob,
};