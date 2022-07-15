const Thing = require('../models/thing');
const fs = require('fs');
const {json} = require("express");

exports.createThing = (req, res, next) => {
    const check = JSON.stringify(req.body);
    const checkThing = JSON.parse(check);

    delete checkThing._id;
    delete checkThing.userId;

    const thing = new Thing({
            ...checkThing,
            userId: req.auth.userId
        });
    thing.save().then(
            () => {
                res.status(201).json({
                    message: 'Post saved successfully!'
                });
            }
        ).catch(
            (error) => {
                res.status(400).json({
                    error: error
                });
            }
        );
};


exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete thingObject.userId;
    Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId ) {
                res.status(401).JSON({message: 'Not authorized'});
            } else {
                Thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})
                    .then(() => res.status(200).JSON({message : 'Thing updated successfully!'}))
                    .catch(error => res.status(401).JSON({ error }));
            }
        })
        .catch((error) => {
            res.status(400).JSON({ error });
        });
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({_id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                        .then(() => {
                            res.status(200).JSON({message: 'Thing deleted !'})
                        })
                        .catch(error => res.status(401).JSON({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).JSON({ error });
        });
};

exports.getAllStuff = (req, res, next) => {
    Thing.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};