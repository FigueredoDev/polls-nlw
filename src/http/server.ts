import fastify from 'fastify'
import { createPoll } from '../routes/create-poll'
import { getPoll } from '../routes/get-poll'

const app = fastify()

void app.register(createPoll)
void app.register(getPoll)

app.listen(({ port: 3333 })).then(() => { console.log('Server is running on port 3333') }).catch(error => { console.error(error) })
