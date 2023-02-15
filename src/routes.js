const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');
const axios = require('axios');

const Avatar = require('./models/Avatar');
const Wish = require('./models/Wish');

/**Begin:Wish */
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

    const { _limit, _page } = req.query;
    const options = {
        page: parseInt(_page, 10),
        limit: parseInt(_limit, 10),
    };

    const wish = await Wish.paginate({}, options);
    return res.json(wish);
});
routes.post('/wish/:user', multer(multerConfig).single('file'), async (req, res) => {
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

/**End:Wish */





/**Begin:Avatar */
routes.post('/avatar/:user', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = ""} = req.file;
    const avatar = await Avatar.create({
        user: req.params.user,
        type: 'avatar',
        name,
        size,
        key,
        url
    });

    return res.json(avatar);
    
    
});
routes.get('/avatar', async (req, res) => {
    const avatar = await Avatar.find();
    return res.json(avatar);
});
routes.get('/avatar/:user', async(req, res) => {
    const { user} = req.params;
    const data = await Avatar.find({user});
    return res.json(data);
});
routes.put('/avatar/:user', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, key, location: url = "" } = req.file;

    await Avatar.findOneAndUpdate({
        user: req.params.user,
        type: 'avatar',
        name,
        size,
        key,
        url
    });

    return res.json({'message': 'Update successfully'});
    
});

routes.delete('/avatar/:user', async(req, res) => {
    const avatar = await Avatar.findOneAndDelete(req.params.user);

    await avatar.remove();
    
    return res.json({'message': 'Deleted with successfylly'})
});

routes.get('/search/:user/:type', async (req, res) => {
    const type = await Avatar.find({user: req.params.user, type: req.params.type});
    return res.send(type);
});
/**End:Post */

module.exports = routes;