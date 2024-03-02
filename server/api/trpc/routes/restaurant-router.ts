import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router } from "..";
import { authedProcedure } from "../../auth/authed-procedure";

const restaurantOwnerProcedure = authedProcedure
  .input(z.object({ restaurantId: z.string() }))
  .use(async (opts) => {
    const ownedRestaurant = await opts.ctx.prisma.restaurant.findUnique({
      where: {
        id: opts.input.restaurantId,
        ownerId: opts.ctx.user.id,
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
      .input(
        z.object({
          name: z.string(),
          ingredientIds: z.array(z.object({ ingredientId: z.string() })),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        return ctx.prisma.food.create({
          data: {
            name: input.name,
            restaurant: {
              connect: {
                id: ctx.restaurant.id,
              },
            },
            ingredients: {
              createMany: {
                data: input.ingredientIds,
              },
            },
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
});
