const express = require('express');
const app = express();
const logger = require('morgan');
const MongoStore = require('connect-mongo');
const authWebRouter = require('./routers/web/auth.js');

const productRoutes = require('./product/productRoutes');

const PORT = process.env.PORT || 8080;

app.use(logger('dev'));
app.use(express.json());
app.use(session({
    store: MongoStore.create({ mongoUrl: config.mongoRemote.cnxStr }),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}))

app.get('/', async (req, res) => {
    res.json({
        response: 'index',
    });
});

app.use('/api/productos', productRoutes);
app.use(authWebRouter);

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});
