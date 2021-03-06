const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
//const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
//const expressValidator = require('express-validator');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const statsRouter = require('./routes/statsRoutes');
const playerRouter = require('./routes/playerRoutes');
const mapRouter = require('./routes/mapRoutes');
const groupRouter = require('./routes/groupRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.options('*', cors());

app.use(express.static(`${__dirname}/public`));

app.use(helmet());

//app.use(expressValidator());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(xss());

app.use(
  hpp({
    whitelist: ['statpack'],
  })
);

app.use(compression());

app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/players', playerRouter);
app.use('/api/v1/maps', mapRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
