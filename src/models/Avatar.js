const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

const AvatarSchema = new mongoose.Schema({
    user: Number,
    name: String,
    type: String,
    size: Number,
    key: String,
    url: String,
    createAt: {
        type: Date,
        default: Date.now,
    },
});

AvatarSchema.pre('save', function(){
    if(!this.url){
        this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
});

AvatarSchema.pre('remove', function(){
    if(process.env.STORAGE_TYPE ==='s3') {
        return s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: this.key,
        })
        .promise()
    } else {
        return promisify(fs.unlink)(
            path.resolve(__dirname, '..','..', 'tmp', 'uploads', this.key )
        );
    }
});

module.exports = mongoose.model('Avatar', AvatarSchema);