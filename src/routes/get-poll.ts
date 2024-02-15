import { type FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import z from 'zod'
import { redis } from '../lib/redis'

export async function getPoll (app: FastifyInstance): Promise<void> {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      include: {
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!poll) {
      return await reply.status(404).send({
        message: 'Poll not found'
      })
    }

    const min = 0
    const max = -1
    const options = 'WITHSCORES'

    const result = await redis.zrange(pollId, min, max, options)
    const votes = result.reduce<Record<string, number>>((object, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1]

        Object.assign(object, { [line]: Number(score) })
      }

      return object
    }, {})

    return await reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => ({
          id: option.id,
          title: option.title,
          score: (option.id in votes) ? votes[option.id] : 0
        }))
      }
    })
  })
}
