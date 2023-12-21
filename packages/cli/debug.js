import list from './lib/commands/list.js'
import verifySetup from './lib/util/verifySetup.js'

async function run () {
  await verifySetup()
  await list()
}

void run()