import { app } from '../../src'
import request from 'supertest'
import { AddFruitModel } from '../../src/DTO/AddFruitModel'

describe('/fruits', () => {
  beforeAll(async () => {
    await request(app).delete('/__test__/data')
  })

  it('should returns 200 and empty array', async () => {
    await request(app).get('/fruits').expect(200, [])
  })

  it('should returns 400', async () => {
    await request(app).post('/fruits').expect(400)
    await request(app).post('/fruits').send({ name: '' }).expect(400)
  })

  it('should returns 201 and new fruit', async () => {
    const data: AddFruitModel = {
      name: 'lemon',
      color: 'green',
      price: 12,
    }
    const fruitsResponse = await request(app).get('/fruits')
    const initialFruitsLength = fruitsResponse.body.length

    const createdFruitResponse = await request(app).post('/fruits').send(data)
    const createdFruit = createdFruitResponse.body

    expect(createdFruit).toEqual({ id: expect.any(Number), ...data })

    const fruitsResponse2 = await request(app).get('/fruits')
    const newFruitsLength = fruitsResponse2.body.length

    expect(newFruitsLength).toBe(initialFruitsLength + 1)
  })
})
