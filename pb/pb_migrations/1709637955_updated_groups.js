/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "onjsks6h",
    "name": "avatar",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/x-xpixmap",
        "image/vnd.adobe.photoshop",
        "image/png",
        "image/vnd.mozilla.apng",
        "image/jpeg",
        "image/jxl",
        "image/jp2",
        "image/jpx",
        "image/jpm",
        "image/jxs",
        "image/gif",
        "image/webp",
        "image/tiff",
        "image/bmp",
        "image/x-icon",
        "image/vnd.djvu",
        "image/bpg",
        "image/vnd.dwg",
        "image/x-icns",
        "image/heic",
        "image/heic-sequence",
        "image/heif",
        "image/heif-sequence",
        "image/vnd.radiance",
        "image/x-xcf",
        "image/x-gimp-pat",
        "image/x-gimp-gbr",
        "image/avif",
        "image/jxr",
        "image/svg+xml"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c6ptx6r7mg3vdl7")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "onjsks6h",
    "name": "avatar",
    "type": "file",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/x-xpixmap",
        "image/vnd.adobe.photoshop",
        "image/png",
        "image/vnd.mozilla.apng",
        "image/jpeg",
        "image/jxl",
        "image/jp2",
        "image/jpx",
        "image/jpm",
        "image/jxs",
        "image/gif",
        "image/webp",
        "image/tiff",
        "image/bmp",
        "image/x-icon",
        "image/vnd.djvu",
        "image/bpg",
        "image/vnd.dwg",
        "image/x-icns",
        "image/heic",
        "image/heic-sequence",
        "image/heif",
        "image/heif-sequence",
        "image/vnd.radiance",
        "image/x-xcf",
        "image/x-gimp-pat",
        "image/x-gimp-gbr",
        "image/avif",
        "image/jxr",
        "image/svg+xml"
      ],
      "thumbs": [
        "64x64"
      ],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
