const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('../config/multer');
const axios = require('axios');

const Wish = require('../models/Wish');

routes.get('/wish/:user', async(req, res) => {

    const { user } = req.params;

    const data = await Wish.find({ user});
    return res.json(data);
});

routes.delete('/wish/:id', async(req, res) => {
    const wish = await Wish.findById(req.params.id);  

    await wish.remove();
    
    return res.json({ "message": 'Deleted with successfylly'});
});

routes.get('/wishes', async(req, res) => {
    const wishes = await Wish
    .find({}, 'description status createAt')
    .populate('avatar', 'url').exec();
    return res.json(wishes);
});

routes.get('/wish', async (req, res) => {
    const wish = await Wish.find();
    return res.json(wish);
});

routes.get('/wish', async(req, res) => {

    const { _limit, _page } = req.query;
    const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
    };

    const wish = await Wish.paginate({}, options);
    return res.json(wish);
});
routes.post('/wish/:author', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = ""} = req.file;
    const wish = await Wish.create({
        //box: req.headers.box,
        author: req.params.author,
        description : req.headers.description,
        status: req.headers.status,
        //type: 'wish',
        name,
        size,
        key,
        url
    });
    return res.json(wish);
});

module.exports = routes;