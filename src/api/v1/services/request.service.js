const { Request } = require("../models/request.model");
/**
 * Creates Request Entry in the Db
 * @param {ObjectId} emitter
 * @param {ObjectId} receiver
 * @param {String} type
 */
exports.createOne = async (emitter, receiver, type) => {
    return await Request.updateOne(
        { emitter, receiver, type },
        { emitter, receiver, type, active: true },
        { lean: true, upsert: true },
    ).exec();
};
/**
 *
 * @param {ObjectId} RequestId
 * @returns Promise<Request | LeanDocument<Request> >
 */
exports.findOneById = async (RequestId) => {
    return await Request.findById(RequestId).lean().exec();
};
/**
 * Returns Emitted Requests by Request type
 * @param {ObjectId} emitterId
 * @param {String} type
 * @returns Promise<Request[] | LeanDocument<Request>[]>
 */
exports.findEmittedbyType = async (emitterId, type) => {
    return await Request.find({ emitter: emitterId, type })
        .sort("active:1")
        .lean()
        .exec();
};

/**
 * Returns Emitted Requests by Request type Paginated
 * @param {ObjectId} emitterId
 * @param {String} type
 * @param {Number} pagenumber
 * @param {Number} pagesize
 * @returns
 */
exports.findEmittedbyTypePaginated = async (
    emitterId,
    type,
    pagenumber,
    pagesize,
) => {
    const skip = (pagenumber - 1) * pagesize;
    return await Request.aggregate([
        {
            $match: { emitter: emitterId, type },
        },
        {
            $sort: { active: 1 },
        },
        {
            $skip: skip,
        },
        {
            $limit: pagesize,
        },
        {
            $lookup: {
                from: "users",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver",
            },
        },
        {
            $unwind: "$receiver",
        },
        {
            $project: {
                _id: 0,
                requestId: "$_id",
                email: "$receiver.email",
                username: "$receiver.username",
                name: "$receiver.name",
                profilePhoto: "$receiver.profilePhoto",
                active: "$active",
            },
        },
    ]);
};
/**
 * Returns received Requests by Request type
 * @param {ObjectId} receiverId
 * @param {String} type
 * @returns Promise<Request[] | LeanDocument<Request>[]>
 */
exports.findreceivedbyType = async (receiverId, type) => {
    return await Request.find({ receiver: receiverId, type, active: true })
        .lean()
        .exec();
};

/**
 * Returns received Requests by Request type Paginated
 * @param {ObjectId} receiverId
 * @param {String} type
 * @param {Number} pagenumber
 * @param {Number} pagesize
 * @returns Promise<Request[] | LeanDocument<Request>[]>
 */
exports.findreceivedbyTypePaginated = async (
    receiverId,
    type,
    pagenumber,
    pagesize,
) => {
    const skip = (pagenumber - 1) * pagesize;
    return await Request.aggregate([
        {
            $match: {
                receiver: receiverId,
                type,
                active: true,
                // block functionality to be decided
                // emitter: { $nen: [] },
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: pagesize,
        },
        {
            $lookup: {
                from: "users",
                localField: "emitter",
                foreignField: "_id",
                as: "emitter",
            },
        },
        { $unwind: "$emitter" },
        {
            $project: {
                _id: 0,
                requestId: "$_id",
                email: "$emitter.email",
                username: "$emitter.username",
                name: "$emitter.name",
                profilePhoto: "$emitter.profilePhoto",
            },
        },
    ]);
};

/**
 * Deletes One Request Entry By type
 * @param {ObjectId} emitter
 * @param {ObjectId} receiver
 * @param {String} type
 * @returns
 */
exports.deleteOne = async (emitter, receiver, type) => {
    return await Request.deleteOne({ emitter, receiver, type }).exec();
};

/**
 * Deactivates One Request Entry By Id
 * @param {ObjectId} requestId
 * @param {ObjectId} receiver
 * @returns
 */
exports.expireOne = async (requestId, receiver) => {
    return await Request.updateOne(
        { id: requestId, receiver },
        { active: false },
        { lean: true, new: true },
    ).exec();
};
