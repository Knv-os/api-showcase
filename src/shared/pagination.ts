import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export function getPaginationParams(query: unknown): PaginationParams {
  return paginationSchema.parse((query as any) ?? {});
}

export function buildPaginated<T>(
  rows: T[],
  page: number,
  perPage: number,
  total: number
) {
  return {
    data: rows,
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
}
