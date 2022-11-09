import type { NextApiRequest, NextApiResponse } from "next";

import { appRouter } from '../../server/trpc/router/_app';
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

const caller = appRouter.createCaller({});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const params = query.rest;

  if (!appRouter._def.procedures[query.rest.join('.')]) {
    return res.status(404).end();
  }

  if (req.method === 'GET') {
    if (!appRouter._def.procedures[query.rest.join('.')]._def.query) {
      return res.status(405).end()
    }
  }

  if (req.method === 'POST') {
    if (!appRouter._def.procedures[query.rest.join('.')]._def.mutation) {
      return res.status(405).end()
    }
  }

  delete query.rest;

  const input = req.method === 'GET' ? query : req.body || {};

  try {
    const result = await caller[params[0]][params[1]](input);
    return res.json(result);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);

      return res.status(httpStatusCode).json({ error: { message: cause.message } });
    }
  }

  // This is not a tRPC error, so we don't have specific information.
  res.status(500).json({
    error: { message: `Unexpected Server Error` },
  });
}
