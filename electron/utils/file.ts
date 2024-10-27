import fs from 'fs'
import path from 'path'

const getAllFilePaths = (dir) => {
  const filePaths: Array<string> = []
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory())
      filePaths.push(...getAllFilePaths(filePath))
    else
      filePaths.push(filePath)
  })
  return filePaths
}

export default {
  getAllFilePaths
}