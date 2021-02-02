import { BlobServiceClient } from "@azure/storage-blob";

const blobSasUrl =
  "https://romstorageaccounttdg.blob.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2022-01-28T21:48:25Z&st=2021-01-28T13:48:25Z&spr=https&sig=cMJb4git%2BDJbp7jpx8Rw0E2eb0AiEAPVPMtMlRKPaZU%3D";
const containerName = "tdgblobcontainer";

async function listFiles() {
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  const containerClient = blobServiceClient.getContainerClient(containerName);
  console.log(containerClient);

  try {
    let iter = containerClient.listBlobsFlat();
    let blobItem = await iter.next();
    while (!blobItem.done) {
      console.log(blobItem.value.name);
      blobItem = await iter.next();
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function downloadFile(file) {
  try {
    debugger
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.fileName);

    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    await blobToFile(await downloadBlockBlobResponse.blobBody, file.fileName);
  } catch (error) {
    console.log(error.message);
  }
}

// [Browsers only] A helper method used to convert a browser Blob into string.
async function blobToFile(blob, fileName) {
  const fileReader = new FileReader();
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    fileReader.onloadend = ev => {
      resolve(ev.target.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsDataURL(blob);
    fileReader.onload = function(e) {
      console.log("Started downloading file...");
      var link = document.createElement("a");
      link.href = e.target.result;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(function() {
        // For Firefox it is necessary to delay revoking the ObjectURL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(e.target.result);
      }, 100);
    };
  });
}

async function uploadFile(file) {
  try {
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    await blockBlobClient
      .uploadBrowserData(file)
      .then(r => {
        console.log(r);
      })
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

async function deleteFile(file) {
  try {
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    await containerClient
      .deleteBlob(file.fileName)
      .then(r => {
        console.log(r);
      })
      .catch(error => {
        console.log(error);
      });
  } catch (error) {
    console.log(error.message);
  }
}

export default {
  listFiles,
  downloadFile,
  blobToFile,
  uploadFile,
  deleteFile
};
