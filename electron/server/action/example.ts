import Db from "#root/utils/db.js"

console.log(__dirname)
let db
(async () => await Db.getInstance('main.db'))().then((instance) => db = instance)
export const post = async (req, res) => {
  const result = await db.all('SELECT * FROM users')
  res.send({ message: 'success' + req.body.name, data: result })
}