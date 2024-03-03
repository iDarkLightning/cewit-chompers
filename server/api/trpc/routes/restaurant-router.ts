import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createMenuItemScheme, createTableSchema } from "~/shared/schemas";
import { router } from "..";
import { authedProcedure } from "../../auth/authed-procedure";

const restaurantOwnerProcedure = authedProcedure
  .input(z.object({ restaurantSlug: z.string() }))
  .use(async (opts) => {
    const ownedRestaurant = await opts.ctx.prisma.restaurant.findUnique({
      where: {
        slug: opts.input.restaurantSlug,
        ownerId: opts.ctx.user.id,
      },
      include: {
        menu: true,
        tables: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!ownedRestaurant)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Restaurant not found",
      });

    return opts.next({
      ctx: {
        restaurant: ownedRestaurant,
      },
    });
  });

export const restaurantRouter = router({
  menu: {
    create: restaurantOwnerProcedure
      .input(createMenuItemScheme)
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.food.create({
          data: {
            name: input.name,
            restaurant: {
              connect: {
                id: ctx.restaurant.id,
              },
            },
            price: input.price,
            description: input.description,
            ingredients: {
              createMany: {
                data: input.ingredientIds,
              },
            },
          },
        });
      }),
    deleteMenuItem: restaurantOwnerProcedure
      .input(z.object({ foodId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.food.delete({
          where: {
            id: input.foodId,
            restaurantId: ctx.restaurant.id,
          },
        });
      }),
    delete: restaurantOwnerProcedure.mutation(async ({ ctx }) => {
      return ctx.prisma.food.delete({
        where: {
          id: ctx.restaurant.id,
        },
      });
    }),
  },

  table: {
    create: restaurantOwnerProcedure
      .input(createTableSchema)
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.table.create({
          data: {
            restaurantId: ctx.restaurant.id,
            seats: input.seats,
          },
        });
      }),
    clear: restaurantOwnerProcedure
      .input(z.object({ tableId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.$transaction(async (tx) => {
          const customerFoods = await tx.customer.findMany({
            where: {
              tableId: input.tableId,
            },
            select: {
              userId: true,
              foods: true,
            },
          });

          customerFoods.forEach(async ({ userId, foods }) => {
            await tx.user.update({
              where: {
                id: userId,
              },
              data: {
                pastOrders: {
                  create: {
                    restaurantId: ctx.restaurant.id,
                    foods: {
                      createMany: {
                        data: foods.map((food) => ({ foodId: food.foodId })),
                      },
                    },
                  },
                },
              },
            });
          });

          await tx.table.update({
            where: {
              id: input.tableId,
            },
            data: {
              occupied: false,
              customers: {
                deleteMany: {},
              },
            },
          });
        });
      }),
    delete: restaurantOwnerProcedure
      .input(z.object({ tableId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.table.delete({
          where: {
            id: input.tableId,
          },
        });
      }),
  },

  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const attemptedSlug = input.name.toLowerCase().replace(/ /g, "-");
      const slugCount = await ctx.prisma.restaurant.count({
        where: { slug: attemptedSlug },
      });

      const slug =
        slugCount === 0 ? attemptedSlug : `${attemptedSlug}-${slugCount}`;

      return ctx.prisma.restaurant.create({
        data: {
          name: input.name,
          slug,

          owner: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });
    }),

  getBySlug: restaurantOwnerProcedure.query(async ({ ctx }) => ctx.restaurant),
});
