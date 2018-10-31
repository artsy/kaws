const typeorm = require.requireActual("typeorm")

module.exports = {
  ...typeorm,
  getMongoRepository: jest.fn(),
}
