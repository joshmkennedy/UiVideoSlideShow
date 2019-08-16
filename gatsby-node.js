const fs = require("fs")
//const path = require("path")
const util = require("util")

/* this code creates some extra fields on the file node for video duration */
const openFile = util.promisify(fs.open)
const readFile = util.promisify(fs.read)

const getMovieDuration = async file => {
  var buff = await new Buffer.alloc(100)

  const fileOpen = await openFile(file, "r")
  const fileRead = await readFile(fileOpen, buff, 0, 100, 0).then(
    ({ err, bytesRead, buffer }) => {
      var start = buffer.indexOf(new Buffer.from("mvhd")) + 17
      var timeScale = buffer.readUInt32BE(start, 4)
      var duration = buffer.readUInt32BE(start + 4, 4)
      var movieLength = Math.floor(duration / timeScale)
      return movieLength * 1000
    }
  )
  return fileRead
}

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name === `File`) {
    return {
      videoDuration: {
        type: `Int`,
        args: {
          myArgument: {
            type: `Int`,
          },
        },
        resolve: async (source, fieldArgs) => {
          const time =
            source.ext === ".mp4"
              ? await getMovieDuration(source.absolutePath)
              : 0
          return time
        },
      },
    }
  }
  return {} //default retunr empty obj
}
