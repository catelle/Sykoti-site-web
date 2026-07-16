import 'dotenv/config'
import app from './app.js'
import { connectDb } from './db.js'

const port = process.env.PORT || 4000

connectDb()
  .then(() => {
    app.listen(port, () => console.log(`SykotiCenter API running on http://localhost:${port}`))
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
