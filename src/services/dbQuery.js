console.log(process.env.REPLIT_DB_URL);
const Database = require("@replit/database")
const db = new Database()
db.get("cali").then(value => console.log('cali', value));
db.get("caliRole").then(value => console.log('caliRole', value));
db.get("epic").then(value => console.log('epic', value));
db.get("epicRole").then(value => console.log('epicRole', value));
db.get("buffs").then(value => console.log('buffs', value));
db.get("gang").then(value => console.log('gang', value));

// '763836152288903198': '<@&962215054005141575>'
