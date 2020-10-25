const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION, SADNESS - shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
