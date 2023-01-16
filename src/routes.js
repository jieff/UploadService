const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const Post = require('./models/Post');

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

    const data = {
        wish_name: "nome do desejo test node",
        wish_description: "nome da descriptio",
        wish_status: 4,
        wish_url: "url test",
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    };

    //fetch('http://172.17.146.5:8080/api/v1/add_wish', options)

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