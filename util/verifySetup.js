import setup from '../util/setup'

export default async function () {
  if (await neededFoldersExist()) {
    // all good
    // todo decide what to do if setup is good, or if we need to invert this logic
  } else {
    await setup()
  }
}

async function neededFoldersExist() {
  // check for needed folders
  return true //fixme make this actually check folders
}