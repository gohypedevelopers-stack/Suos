const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://suos:suosghm@2026@127.0.0.1:5433/suos' });

client.connect()
  .then(() => client.query("UPDATE users SET role = 'ADMIN' WHERE email = 'admin@suos.store'"))
  .then(res => {
    console.log('Updated rows:', res.rowCount);
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
