import fs from 'fs'
import express from 'express'
import db from './db/db.json'

export const app = express()
const port = 3003

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.get('/', (req: any, res: any) => {
  res.send('<h1>hello world</h1>')
})

app.get('/success', (req: any, res: any) => {
  res.send(204)
})

/*
FRUITS
*/
app.get('/fruits', (req: any, res: any) => {
  const fruits = db.fruits
  let foundedFruits = fruits

  if (req.query.title) {
    foundedFruits = fruits.filter((el) => el.name.includes(req.query.title))
  }
  res.json(foundedFruits)
})

app.post('/fruits', (req: any, res: any) => {
  if (!req.body.name || !req.body.name.trim()) {
    res.sendStatus(400)
    return
  }

  const fruits = db.fruits
  const lastFruit = fruits.at(-1)

  const newFruit = {
    id: 0,
    name: '',
    color: '',
    price: 0,
  }

  if (lastFruit?.id) {
    newFruit.id = lastFruit.id + 1
  }

  newFruit.name = req.body.name
  newFruit.color = req.body.color
  newFruit.price = +req.body.price

  fruits.push(newFruit)

  fs.writeFile('./src/db/db.json', JSON.stringify(db, null, 2), (err) => {
    if (err) {
      throw err
    }
  })
  res.status(201).json(newFruit)
})

app.get('/fruits/:id', (req: any, res: any) => {
  const fruits = db.fruits

  const foundedFruit = fruits.find((el: any) => el.id === +req.params.id)
  if (foundedFruit) {
    res.json(foundedFruit)
  } else {
    res.sendStatus(404)
  }
})

app.delete('/fruits/:id', (req: any, res: any) => {
  if (!req.params.id) {
    res.status(404).json({ message: 'Id is require' })
    return
  }

  const fruits = db.fruits

  let idIsNotExist = true

  const newFruits = fruits.filter((el) => {
    if (el.id === +req.params.id) {
      idIsNotExist = false
    }

    return el.id !== +req.params.id
  })

  if (idIsNotExist) {
    res.status(404).json({ message: 'Current id is not found' })
    return
  }

  db.fruits = newFruits

  fs.writeFile('./src/db/db.json', JSON.stringify(db, null, 2), (err) => {
    if (err) {
      res.sendStatus(500)
      throw err
    }

    console.log('Data written to file')
  })

  res.sendStatus(204)
})

app.listen(port, () => {
  console.log('listening port: ' + port)
})

/*
TESTING
*/

app.delete('/__test__/data', (req: any, res: any) => {
  db.fruits = []
  res.status(204).json([...db.fruits])
})
