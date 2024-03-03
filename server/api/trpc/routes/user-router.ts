import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router } from "..";
import { authedProcedure } from "../../auth/authed-procedure";

export const customerProcedure = authedProcedure.use(async (opts) => {
  const customer = await opts.ctx.prisma.customer.findUnique({
    where: {
      userId: opts.ctx.user.id,
    },
  });

  if (!customer) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No order found",
    });
  }

  return opts.next({
    ctx: {
      customer,
    },
  });
});

export const userRouter = router({
  joinTable: authedProcedure
    .input(z.object({ tableId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.table.update({
        where: {
          id: input.tableId,
        },
        data: {
          occupied: true,
          customers: {
            connectOrCreate: {
              where: {
                userId: ctx.user.id,
                tableId: input.tableId,
              },
              create: {
                userId: ctx.user.id,
              },
            },
          },
        },
      });
    }),
  addLikes: authedProcedure
    .input(z.object({ likes: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          likes: {
            push: input.likes,
          },
        },
      });
    }),
  addDislikes: authedProcedure
    .input(z.object({ dislikes: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          dislikes: {
            push: input.dislikes,
          },
        },
      });
    }),
  completeOnboarding: authedProcedure
    .mutation(async ({ ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.user.id
        },
        data: {
          hasOnboarded: true
        }
      });
    }),
  addToOrder: customerProcedure
    .input(z.object({ foodId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const table = await ctx.prisma.table.findFirst({
        where: {
          customers: {
            some: {
              id: ctx.customer.id,
            },
          },
        },
      });

      if (!table) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Table not found",
        });
      }

      const food = await ctx.prisma.food.findUnique({
        where: {
          id: input.foodId,
          restaurantId: table.restaurantId,
        },
      });

      if (!food) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Food not found at this restaurant",
        });
      }

      return ctx.prisma.customer.update({
        where: {
          id: ctx.customer.id,
        },
        data: {
          foods: {
            create: {
              foodId: input.foodId,
            },
          },
        },
      });
    }),
  getOrder: customerProcedure.query(async ({ ctx }) => {
    return ctx.prisma.table.findFirst({
      where: {
        customers: {
          some: {
            id: ctx.customer.id,
          },
        },
      },
      select: {
        customers: {
          include: {
            foods: {
              select: {
                food: {
                  include: {
                    ingredients: {
                      select: {
                        ingredient: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        restaurant: {
          select: {
            name: true,
            menu: true,
          },
        },
      },
    });
  }),
  removeFromOrder: customerProcedure
    .input(z.object({ foodId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.foodOnCustomer.delete({
        where: {
          customerId_foodId: {
            customerId: ctx.customer.id,
            foodId: input.foodId,
          },
        },
      });
    }),
});
