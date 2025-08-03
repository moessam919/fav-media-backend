"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredMedia = exports.deleteMedia = exports.updateMedia = exports.getAllMedia = exports.createMedia = exports.getMediaById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getMediaById = (id) => {
    return prisma.media.findUnique({ where: { id } });
};
exports.getMediaById = getMediaById;
const createMedia = (data) => {
    return prisma.media.create({ data });
};
exports.createMedia = createMedia;
const getAllMedia = (page, limit) => {
    const skip = (page - 1) * limit;
    return prisma.media.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};
exports.getAllMedia = getAllMedia;
const updateMedia = (id, data) => {
    return prisma.media.update({
        where: { id },
        data,
    });
};
exports.updateMedia = updateMedia;
const deleteMedia = (id) => {
    return prisma.media.delete({
        where: { id },
    });
};
exports.deleteMedia = deleteMedia;
const getFilteredMedia = (filters, page, limit) => {
    const { title, type, year, userId } = filters;
    const skip = (page - 1) * limit;
    const where = { userId };
    if (title)
        where.title = { contains: title, mode: "insensitive" };
    if (type)
        where.type = { equals: type };
    if (year)
        where.year = { equals: year };
    return prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};
exports.getFilteredMedia = getFilteredMedia;
