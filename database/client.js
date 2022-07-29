const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: '6kpvyv13',
  dataset: 'production',
  apiVersion: '2022-07-10',
  token: "skrCGrO8A7bdThdlmyldvNzyxNgOUFvFYl2YyPsZiqkvYvYfg7J1hflRhTonVxDZ0nx6M78wItXwXQGSNtaoHB0jOKQAyytw9Yy45iUG6Gg70j6cM77HLjl12GuBUQeKUrg0VmrfUoRfiiZvviSYajqNf4eApL4DDx02KD11eOMHAd81Tm0O",
  useCdn: false,
});

/*
  client.delete({
  query: `*[_type == "messages"]`
}).then((res) => console.log('deleted all:',res))

*/


var { basename } = require('path');
var { createReadStream } = require('fs');

async function getData(query,params){
  return await client.fetch(query, params);
}

async function addData(doc){
  return await client.create(doc);
}

async function updateData(doc_id,new_doc){
  return await client.patch(doc_id).set(new_doc).commit();
}

async function uploadProfile(filePath,doc_id){
  console.log('file_path:',filePath)
  try {
      var imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
  } catch(err) {
      console.log('db_error:',err)
  }
  var doc_info = await client.patch(doc_id).set({
      profile_image: {
        _type: 'image',
        asset: {
          _type: "reference",
          _ref: imageAsset._id
        }
      }
  }).commit()
  return { ...doc_info,profile_image:imageAsset }
}

async function uploadCover(filePath,doc_id){
  try {
      var imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
  } catch(err) {
      console.log('db_error:',err)
  }
  var doc_info = await client.patch(doc_id).set({
      cover_image: {
        _type: 'image',
        asset: {
          _type: "reference",
          _ref: imageAsset._id
        }
      }
  }).commit()
  return { ...doc_info,cover_image:imageAsset }
}

async function uploadImage(filePath){
  console.log('file_path:',filePath)
  try {
      var imageAsset = await client.assets.upload('image', createReadStream(filePath),{ filename: basename(filePath) });
  } catch(err) {
      console.log('db_error:',err)
  }
  
  return { image:imageAsset }
}

module.exports = {
  updateData,getData,addData,uploadProfile,uploadCover,uploadImage
};