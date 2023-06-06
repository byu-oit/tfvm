import StreamZip from 'node-stream-zip'

async function unzipFile (zipPath, newFolder) {
  const zip = new StreamZip.async({ file: zipPath }) // eslint-disable-line new-cap
  await zip.extract(null, newFolder)
  await zip.close()
}

export default unzipFile
