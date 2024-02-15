import fastify from 'fastify'
import { createPoll } from '../routes/create-poll'
import { getPoll } from '../routes/get-poll'
import { voteOnPoll } from '../routes/vote-on-poll'
import cookie from '@fastify/cookie'
import fastifyWebsocket from '@fastify/websocket'
import { pollResults } from '../ws/poll-results'

const app = fastify()
const PORT = Number(process.env.APPLICATION_PORT) || 3333

void app.register(cookie, {
  secret: 'pools-app-nlw',
  hook: 'onRequest'
})

void app.register(fastifyWebsocket)

void app.register(createPoll)
void app.register(getPoll)
void app.register(voteOnPoll)

void app.register(pollResults)

app.listen(({ port: PORT })).then(() => { console.log(`Server running on port ${PORT}`) }).catch(error => { console.error(error) })
