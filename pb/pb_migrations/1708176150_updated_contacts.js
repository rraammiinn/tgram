/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jq36sjkt311u0x6")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_p09tgxJ` ON `contacts` (\n  `follower`,\n  `following`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jq36sjkt311u0x6")

  collection.indexes = [
    "CREATE INDEX `idx_4VidiNE` ON `contacts` (\n  `follower`,\n  `following`\n)"
  ]

  return dao.saveCollection(collection)
})
