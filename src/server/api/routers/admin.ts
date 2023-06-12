import { adminProcedure, createTRPCRouter } from '@/server/api/trpc';
import { z } from 'zod';

export const adminRouter = createTRPCRouter({
    searchItems: adminProcedure.input(z.string()).query(({ ctx, input: searchInput }) => {
        console.log(2, searchInput);
        return ctx.prisma.$queryRaw`
            SELECT * FROM Item
            WHERE name LIKE ${`%${searchInput}%`}
        `;
    }),
    updateItem: adminProcedure
        .input(
            z.object({
                id: z.number(),
                price: z.number(),
                oldPrice: z.number().nullable(),
            })
        )
        .mutation(({ ctx, input: { id, price, oldPrice } }) => {
            return ctx.prisma.item.update({
                where: { id },
                data: { price, oldPrice },
            });
        }),
    getOrders: adminProcedure.query(async ({ ctx }) => {
        const limit = 10;
        const items = await ctx.prisma.orderItem.findMany({
            take: limit + 1,
            select: {
                id: true,
                orderId: true,
                userId: true,
                colour: true,
                size: true,
                quantity: true,
                amountPaid: true,
                createdAt: true,
                shippingCost: true,
                item: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        mainImage: {
                            select: { url: true },
                        },
                    },
                },
                address: {
                    select: {
                        recipientName: true,
                        line1: true,
                        line2: true,
                        postal_code: true,
                        city: true,
                        state: true,
                        country: true,
                    },
                },
            },
            cursor: undefined,
            orderBy: {
                id: 'desc',
            },
        });
        let nextCursor: any;
        if (items.length > limit) {
            const nextItem = items.pop();
            nextCursor = nextItem!.id;
        }
        return {
            items,
            nextCursor,
        };
    }),
});