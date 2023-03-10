const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mongoosePaginate = require('mongoose-paginate');

const s3 = new aws.S3();

const WishSchema = new mongoose.Schema({
    author: String,
    description: String,
    status: Number,
    size: Number,
    key: String,
    url: String,
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Avatar'
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

WishSchema.pre('save', function(){
    if(!this.url){
        this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
});

WishSchema.pre('deleteOne', async () => {
    if(process.env.STORAGE_TYPE ==='s3') {
        return s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            key: this.key
        })
        .promise()
        .then((response) =>{
            console.log(response.status);
        })
        .catch((response) => {
            console.log(response.status);
        });
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..','..', 'tmp', 'uploads', this.key ));
    }
});

WishSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Wish', WishSchema);