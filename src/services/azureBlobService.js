import { BlobServiceClient } from '@azure/storage-blob'

const blobSasUrl = 'https://romstorageaccounttdg.blob.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2022-01-28T21:48:25Z&st=2021-01-28T13:48:25Z&spr=https&sig=cMJb4git%2BDJbp7jpx8Rw0E2eb0AiEAPVPMtMlRKPaZU%3D'
const containerName = 'tdgblobcontainer'

async function listFiles() {
    const blobServiceClient = new BlobServiceClient(blobSasUrl)

    const containerClient = blobServiceClient.getContainerClient(containerName)
    console.log(containerClient)

    try {
      let iter = containerClient.listBlobsFlat()
      let blobItem = await iter.next()
      while (!blobItem.done) {
        console.log(blobItem.value.name)
        blobItem = await iter.next()
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  async function downloadFile(file) {
    try {
        debugger
        const blobServiceClient = new BlobServiceClient(blobSasUrl)
        const containerClient = blobServiceClient.getContainerClient(containerName)
        const blockBlobClient = containerClient.getBlockBlobClient(file.title)

        const downloadBlockBlobResponse  = await blockBlobClient.download(0)
        const downloaded = await blobToString(await downloadBlockBlobResponse.blobBody)
        console.log(downloaded)

        // await streamToString(downloadBlockBlobResponse.blobBody).then(r => {
        //     console.log('....')
        //         console.log(r)
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })
    }
    catch (error) {
        console.log(error.message)
    }
}

// [Browsers only] A helper method used to convert a browser Blob into string.
async function blobToString(blob) {
    const fileReader = new FileReader();
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve(ev.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsDataURL(blob);
      fileReader.onload =  function(e){
        console.log('DataURL:', e.target.result);
        let metadata = {
            type: 'image/jpeg'
          };
          let file = new File([e.target.result], "a1.pdf", metadata);
          console.log(file)
    };
    });
  }
// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      const chunks = [];
      debugger
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }

  async function uploadFile(file) {
    try {
        const blobServiceClient = new BlobServiceClient(blobSasUrl)
        const containerClient = blobServiceClient.getContainerClient(containerName)

        const blockBlobClient = containerClient.getBlockBlobClient(file.name)
        await blockBlobClient.uploadBrowserData(file).then(r => {
                console.log(r)
            })
            .catch(error => {
                console.log(error)
            })
    }
    catch (error) {
        console.log(error.message)
    }
}

async function deleteFile(file) {
    try {
        const blobServiceClient = new BlobServiceClient(blobSasUrl)
        const containerClient = blobServiceClient.getContainerClient(containerName)

        await containerClient.deleteBlob(file.title).then(r => {
                console.log(r)
            })
            .catch(error => {
                console.log(error)
            })
    }
    catch (error) {
        console.log(error.message)
    }
}

export default {
    listFiles,
    downloadFile,
    streamToString,
    blobToString,
    uploadFile,
    deleteFile
}