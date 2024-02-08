import fastify from 'fastify'
import { createPoll } from '../routes/create-poll'
import { getPoll } from '../routes/get-poll'
import { voteOnPoll } from '../routes/vote-on-poll'
import cookie from '@fastify/cookie'

const app = fastify()

void app.register(cookie, {
  secret: 'pools-app-nlw',
  hook: 'onRequest'
})

void app.register(createPoll)
void app.register(getPoll)
void app.register(voteOnPoll)

app.listen(({ port: 3333 })).then(() => { console.log('Server is running on port 3333') }).catch(error => { console.error(error) })
