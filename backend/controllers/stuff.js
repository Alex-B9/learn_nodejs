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
    // const thingObject = req.file ? {
    //     ...JSON.parse(req.body.thing)
    // } : {...req.body};
    //
    // delete thingObject.userId;
    // Thing.findOne({_id: req.params.id})
    //     .then((thing) => {
    //         if (thing.userId != req.auth.userId) {
    //             res.status(401).json({ message: "Non-autorisé" })
    //         } else {
    //             thing.updateOne({ _id: req.params.id }, {...thingObject, _id: req.params.id})
    //                 .then(() => res.status(200).json({ message:"Objet modifié !" }))
    //                 .catch(error => res.status(401).json({ error }));
    //         }
    //     })

    const thing = new Thing({
        _id: req.params.id,
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        userId: req.body.userId
    });
    Thing.updateOne({_id: req.params.id}, thing).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
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

exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({_id: req.params.id}).then(
        () => {
            res.status(200).json({
                message: 'Deleted!'
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