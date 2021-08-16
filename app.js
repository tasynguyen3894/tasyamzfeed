require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();

const feedHandler = require('./src/services/feedHandler')
const helper = require('./src/services/helper');

const apiRouter = express.Router();

app.set('views', __dirname + '/src/views');
app.set('view engine', 'twig');
app.set('twig options', { 
    strict_variables: false
});

app.use('/', (req, res, next) => {
    const fullAddress = req.protocol + "://" + req.headers.host + req.originalUrl;
    const datetime = new Date();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    console.log(`[${datetime}][${ip}] ${req.method} - ${fullAddress}`);
    next();
})

app.get('/', async (req, res) => {
    let site = req.query.site;
    let html = '';
    let error = null;
    if(site) {
        try {
            let data = await feedHandler.requestFeedBody(site);
            html = feedHandler.renderFeed(data);
        } catch (err) {
            error = err.message;
        }
    }
    res.render('index.twig', {
        html: html,
        site: site,
        error: error
    }); 
});

apiRouter.get('/render_by_url', async (req, res) => {
    let url = req.query.url;
    if(url) {
        try {
            let data = await feedHandler.requestFeedBody(url);
            let html = await feedHandler.convertStyleToInline(feedHandler.renderFeed(data));
            res.json({
                status: true,
                output: html
            });
        } catch (err) {
            res.json({
                status: false,
                message: err.message
            });
        }
        return false;
    } else {
        res.status(422);
        res.json({
            status: false,
            message: 'params url is required'
        });
    }
    return false;
});

app.get('/about', (req, res) => {
    res.render('about.twig');
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
    helper.startScript({
        PORT: PORT
    });
})