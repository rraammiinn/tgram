/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.listRule = "group.members ?= @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tnbtnhf2ihhp4r8")

  collection.listRule = ""

  return dao.saveCollection(collection)
})
