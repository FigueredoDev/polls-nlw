import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const app = fastify()

app.post('/polls', async (request, reply) => {
  const createPollBody = z.object({
    title: z.string()
  })

  const { title } = createPollBody.parse(request.body)

  const poll = await prisma.poll.create({
    data: {
      title
    }
  })

  return await reply.status(201).send({ pollId: poll.id })
})

app.listen(({ port: 3333 })).then(() => { console.log('Server is running on port 3333') }).catch(error => { console.error(error) })
