import { PrismaClient } from "@prisma/client";
import { MediaInput } from "../validators/media.validator";

const prisma = new PrismaClient();

export const getMediaById = (id: number) => {
    return prisma.media.findUnique({ where: { id } });
};

export const createMedia = (data: MediaInput & { userId: number }) => {
    console.log("=== PRISMA CREATE DEBUG ===");
    console.log("Data received by service:", data);
    console.log("Data types:", {
        title: typeof data.title,
        type: typeof data.type,
        director: typeof data.director,
        budget: typeof data.budget,
        location: typeof data.location,
        duration: typeof data.duration,
        year: typeof data.year,
        poster: typeof data.poster,
        userId: typeof data.userId
    });
    
    return prisma.media.create({ 
        data,
        include: {
            user: false
        }
    });
};

export const getAllMedia = (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return prisma.media.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};

export const updateMedia = (id: number, data: MediaInput) => {
    return prisma.media.update({
        where: { id },
        data,
    });
};

export const deleteMedia = (id: number) => {
    return prisma.media.delete({
        where: { id },
    });
};

export const getFilteredMedia = (
    filters: { title?: any; type?: any; year?: any; userId: number },
    page: number,
    limit: number
) => {
    const { title, type, year, userId } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (title) where.title = { contains: title, mode: "insensitive" };
    if (type) where.type = { equals: type };
    if (year) where.year = { equals: year };

    return prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
};
