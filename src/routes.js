const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const axios = require('axios');

const Post = require('./models/Post');
const Wish = require('./models/Wish')

/**Begin:Wish */
routes.post('/wish', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = ""} = req.file;
    const wish = await Wish.create({
        box: req.headers.box,
        user: req.headers.user,
        description : req.headers.description,
        status: req.headers.status,
        type: 'wish',
        name,
        size,
        key,
        url
    });
    return res.json(wish);
});

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

routes.get('/wish', async(req, res) => {
    const wish = await Wish.find();
    return res.json(wish);
});

/**End:Wish */

/**Begin:Post */
routes.get('/posts', async (req, res) => {
    const post = await Post.find();
    return res.json(post);
});
routes.get('/post/:user', async(req, res) => {
    const { user} = req.params;
    const data = await Post.find({user});
    return res.json(data);
});
routes.post('/posts/:id/:type', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = ""} = req.file;

    //axios({
    //    method: "get",
    //    url: "http://172.20.49.196:8080/api/v1/resize",
    //    data: {
    //        "path_thumbnail":"/home/jieff/uploadexample/backend",
    //        "height": 140
    //    }
//
    //});


    const post = await Post.create({
        user: req.params.id,
        type: req.params.type,
        name,
        size,
        key,
        url
    });
    return res.json(post);
});

routes.put('/posts/:id', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = "" } = req.file;

    const post = await Post.findById(req.params.id);

    const newpost = await Post.create({
        user: post.user,
        type: post.type,
        name,
        size,
        key,
        url
    });

    await post.remove();

    return res.json(newpost);

});

routes.delete('/posts/:id', async(req, res) => {
    const post = await Post.findById(req.params.id);

    await post.remove();
    
    return res.send();
});

routes.get('/search/:user/:type', async (req, res) => {
    const type = await Post.find({user: req.params.user, type: req.params.type});
    return res.send(type);
});
/**End:Post */

module.exports = routes;