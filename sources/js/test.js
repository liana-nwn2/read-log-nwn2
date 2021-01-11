document.addEventListener("DOMContentLoaded", function (event) {

/*
   const handleUpload = async(event) => {
      const file = event.target.files[0];
      const fileContentDiv = document.querySelector('div#fileContentTest')

      try {
         fileContentDiv.innerHTML = await readUploadedFileAsText(file)
      } catch (e) {
         fileContentDiv.innerHTML = e.message
      }
   }

 */



   console.log('TEST')
   // document.querySelector('input#folderPickerTest').addEventListener('change', handleUpload)

})
/*
const readUploadedFileAsText = (inputFile) => {
   const temporaryFileReader = new FileReader();

   return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
         temporaryFileReader.abort();
         reject(new DOMException("Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
         resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(inputFile);
   });
};
*/


