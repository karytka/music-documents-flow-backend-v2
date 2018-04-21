require('bluebird');

const models = require('../../index');
const { sequelize } = models;


const fetchById = (id, options = {}) => {
  return sequelize.continueTransaction(options, () => {
    return models.Artist.findById(id, {
      include: [
        {
          model: models.Label,
          as: 'label'
        },
        {
          model: models.Song,
          as: 'songs',
          through: {attributes: []} // remove junction table from result
        }
      ],
      ...options
    })
  })
};


const fetchAll = (options = {}) => {
  return sequelize.continueTransaction(options, () => {
    return models.Artist.findAll(options)
  })
};


const createOne = (content, options = {}) => {
  return sequelize.continueTransaction(options, () => {
    return models.Artist.create(content, options)
  })
};


const updateOne = (where, content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Artist.update(content, {where, ...options, individualHooks: true})
    .then(() => models.Artist.findById(content.id, {transaction}))
    .tap(artist => artist.setSongs(content.songs.map(song => song.id), {transaction, individualHooks: true}))
  })
};


const deleteOne = (where, content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.Artist.destroy(
      {where, ...options}
    )
  })
}


module.exports = {
  fetchById,
  fetchAll,
  createOne,
  updateOne,
  deleteOne
};