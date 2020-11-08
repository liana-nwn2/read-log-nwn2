document.addEventListener("DOMContentLoaded", function () {


   document.getElementById("folderPicker").addEventListener("change", function (event) {
      fillListing(this.files, document.getElementById("listing"))
   })

   document.querySelector('.collapse').addEventListener("click", function (e) {

      const container = document.querySelector('.container')

      if (!this.classList.contains('close')) {
         this.classList.add('close')
         container.classList.add('close')
         this.innerHTML = '&rsaquo;'
      } else {
         this.classList.remove('close')
         container.classList.remove('close')
         this.innerHTML = '&lsaquo;'

      }

   })


})


const fillListing = (filePickerFiles, listingUl) => {

   let index = 0
   listingUl.innerHTML = ''

   for (let i = 0; i < filePickerFiles.length; i++) {

      let logFile = filePickerFiles[i]
      let filePath = logFile.webkitRelativePath
      let isFolder = filePath.match(/[/]/g).length !== 1
      let itemLi

      if (!isFolder && logFile.name.match('Chatlog')) {

         logFile = logFile.name.slice(0, -4)
         itemLi = document.createElement("li");

         itemLi.innerText = logFile
         itemLi.dataset.fileIndex = i
         itemLi.dataset.index = index

         index++

         listingUl.appendChild(itemLi);
         itemFileEvent(itemLi, listingUl, document.querySelector('#fileContent tbody'), filePickerFiles)
      }

   }

   navigFiles(listingUl)

   setOptions()

   let fileSelected

   if (document.getElementById('fileSort').checked) {

      listingUl.classList.add('reverse')

      fileSelected = listingUl.querySelector('li:last-child')
      fileSelected.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})
      document.querySelector('.file_prev').classList.remove('disabled')
      document.querySelector('.file_next').classList.add('disabled')

   } else {

      listingUl.classList.remove('reverse')

      fileSelected = listingUl.querySelector('li:first-child')
      fileSelected.scrollIntoView({behavior: "smooth", block: "end", inline: "end"})
      document.querySelector('.file_next').classList.remove('disabled')
      document.querySelector('.file_prev').classList.add('disabled')

   }

   fileSelected.click()


}

const itemFileEvent = (itemLi, listingUl, fileContent, filePickerFiles) => {

   const fileNameCurrent = document.querySelector('.file_name')
   const fileNum = document.querySelector('.file_num')

   itemLi.addEventListener("click", function (e) {

      const body = document.querySelector('body')
      body.classList.add('wait')

      let prevSelected = listingUl.querySelector('.selected')
      if (prevSelected) {
         prevSelected.classList.remove('selected')

      }
      itemLi.classList.add('selected')

      fileContent.innerHTML = ""

      const reader = new FileReader();

      reader.onload = function (e) {
         let theLog = e.target.result
         afficherLog(theLog.split('\r\n'), fileContent)
      }

      reader.readAsText(filePickerFiles[itemLi.dataset.fileIndex])

      fileNameCurrent.textContent = itemLi.textContent
      fileNum.innerHTML = `<span>${+itemLi.dataset.index + 1}</span>/<span>${listingUl.querySelectorAll('li').length}</span>`


      const filePrev = document.querySelector('.file_prev')
      const fileNext = document.querySelector('.file_next')

      if (+itemLi.dataset.index + 1 === 1) {

         filePrev.classList.add('disabled')
         fileNext.classList.remove('disabled')

      } else if (+itemLi.dataset.index + 1 === listingUl.querySelectorAll('li').length) {

         filePrev.classList.remove('disabled')
         fileNext.classList.add('disabled')
      } else {

         filePrev.classList.remove('disabled')
         fileNext.classList.remove('disabled')
      }


   })

}


const navigFiles = (listingUl) => {

   const navigBtns = document.querySelectorAll('.file_prev, .file_next')

   for (let navigBtn of navigBtns) {

      navigBtn.addEventListener("click", function (e) {

         let selectedLi = listingUl.querySelector('.selected')
         let allLi = listingUl.querySelectorAll('li')
         let indexToNavig = selectedLi.dataset.index


         if (this.classList.contains('file_prev') && indexToNavig > 0) {
            navigBtns[1].classList.remove('disabled')
            indexToNavig--
         } else if (this.classList.contains('file_next') && indexToNavig < allLi.length - 1) {
            navigBtns[0].classList.remove('disabled')
            indexToNavig++
         }

         if (+indexToNavig === 0 || +indexToNavig === allLi.length - 1) {
            this.classList.add('disabled')
         }

         if (indexToNavig !== selectedLi.dataset.index) {
            listingUl.querySelector('li[data-index="' + indexToNavig + '"]').click()
         }

      })
   }

}

const afficherLog = (log, destination) => {


   const body = document.querySelector('body')
   const popupFullName = document.getElementById('popupFullName')
   const t1 = performance.now()
   let numLigne = 1

   const lineColor = lineColorByName(log)

   for (let ligne of log) {

      let tableLigne = document.createElement("tr");

      // (heure)(pseudo)(PJ)(type)(msg)
      // let search = /^([\[][0-9][0-9]:[0-9][0-9]])( \[.*?\])(.*?: )(\[.*?\])(.*)/g
      let search = /^([\[][0-9][0-9]:[0-9][0-9]])( \[.*?\])?(.*?: )(\[.*?\])(.*)/g
      let match = search.exec(ligne);

      if (match !== null) {

         let heure = match[1].trim()
         let pseudo = match[2] !== undefined ? match[2].trim() : ""
         // x > 10 ? "greater than 10" : "less than 10";
         let locuteur = match[3].trim().slice(0, -1)
         let ton = match[4].trim()
         let msg = match[5].trim()

         const maxChar = 20
         let pjName = locuteur
         let dataFullName = ''
         let tdClassName = ''
         let spanClassName = ''
         let msgClassName = ''
         let color = ''

         if (locuteur.length > maxChar) {
            pjName = locuteur.slice(0, maxChar) + '...'
            dataFullName = locuteur
            tdClassName = 'btn'
         }

         let emotes = msg.split(/([*].*?[*])/g)
         let formatMsg = ''

         for (let emote of emotes) {
            if (emote.includes('*')) {
               formatMsg = formatMsg + `<span class="italic">${emote}</span>`
            } else if (emote !== '') {
               formatMsg = formatMsg + emote
            }
         }

         switch (ton) {
            case '[Talk]': {

            }
               break
            case '[Whisper]':
               msgClassName = 'bgColor'
               break
            case '[Shout]':
            case '[Party]':
               msgClassName = 'alignRight'
               break
             // case '[Tell]':
             //
             //    break
            case '[ServerTell]':
               msgClassName = 'alignRight serverTell'
               break
         }

         let lineColorNum = lineColor.names.indexOf(locuteur)

         if (lineColorNum !== -1) {
            color = lineColor.colors[lineColorNum]
         }

         if (pseudo === '' && pjName === '') {
            pjName = '(pnj)'
            // color = '#778999'
            color = '208'
            pseudo = '[pnj]'
         } else if (pseudo === '') {
            pseudo = '[pnj]'
         }

         msgClassName = ton.slice(1, -1).replaceAll(' ', '').toLowerCase()


         tableLigne.innerHTML = `<td class="numLigne"><span>${numLigne}</span></td>
                              <td class="heure"><span>${heure}</span></td>                             
                             <td class="pseudo" style="color: hsl(${color},52%,45%)"><span>${pseudo}</span></td>
                             <td class="pjName ${tdClassName}" style="color: hsl(${color},52%,45%)"><span>${pjName}</span></td>
                             <td class="ton ${ton.slice(1, -1).replaceAll(' ', '').toLowerCase()}"><span>${ton}</span></td>
<!--                             <td class="ton"><span>${ton}</span></td>-->
                             <td class="message ${msgClassName}" style="color: hsl(${color},52%,35%)" >
                             <span class="${spanClassName}">${formatMsg}</span></td>`

         destination.appendChild(tableLigne)

         let cellPjFullName = tableLigne.querySelector('.pjName.btn')


         if (cellPjFullName) {

            cellPjFullName.addEventListener("mouseenter", function () {
               popupFullName.classList.add('show')
               popupFullName.innerText = dataFullName
               popupFullName.style.color = cellPjFullName.style.color
               popupFullName.style.top = cellPjFullName.getBoundingClientRect().top + 'px'
               popupFullName.style.left = `${cellPjFullName.getBoundingClientRect().left + cellPjFullName.offsetWidth}px`

            })

            cellPjFullName.addEventListener("mouseleave", function () {
               popupFullName.classList.remove('show')
            })

         }

         if (document.getElementById('colPseudo').checked) {
            tableLigne.querySelector('.pseudo').classList.add('hide')
         }
         if (document.getElementById('colDialogType').checked) {
            tableLigne.querySelector('.ton').classList.add('hide')
         }
      }

      numLigne++
   }

   const t2 = performance.now()

   body.classList.remove('wait')
   // console.log(t2)
   // console.log("Call to doSomething took " + (t2 - t1) + " milliseconds.")

}

const lineColorByName = (unLog) => {

   let tblPjName = {names: [], colors: []}

   for (let uneLigne of unLog) {

      let search = /^([\[][0-9][0-9]:[0-9][0-9]] )(\[.*?\])?(.*?: )/g
      let match = search.exec(uneLigne)
      let thePjName

      if (match !== null) {
         thePjName = match[3].trim().slice(0, -1)


         if (tblPjName.names.indexOf(thePjName) === -1 && thePjName !== '') {
            let num = tblPjName.names.length

            tblPjName.names.push(thePjName)
            // tblPjName.colors.push(`hsl(${num * 150},55%,40%)`)
            // tblPjName.colors.push(`hsl(${getRandomInt(320) * (num + 1)},52%,35%)`)
            tblPjName.colors.push(getRandomInt(180) * (num + 1))
         }
      }
   }
   return tblPjName
}

const getRandomInt = (max) => {
   return Math.floor(Math.random() * Math.floor(max));
}

const setOptions = () => {

   const fileListing = document.getElementById('listing')
   const options = document.querySelectorAll('.input_group input[type="checkbox"]')
   const fileContent = document.querySelector('#fileContent tbody')

   for (let thisOption of options) {

      let columnsTargeted

      thisOption.addEventListener("click", function (e) {

         if (thisOption.id === 'fileSort') {


            let fileSelected

            if (thisOption.checked) {
               fileListing.classList.add('reverse')
               fileSelected = fileListing.querySelector('li:last-child')
               fileSelected.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})

               document.querySelector('.file_prev').classList.remove('disabled')
               document.querySelector('.file_next').classList.add('disabled')

            } else {
               fileListing.classList.remove('reverse')
               fileSelected = fileListing.querySelector('li:first-child')
               fileSelected.scrollIntoView({behavior: "smooth", block: "end", inline: "end"})

               document.querySelector('.file_next').classList.remove('disabled')
               document.querySelector('.file_prev').classList.add('disabled')

            }

            fileSelected.click()

         }


         if (thisOption.id === 'colPseudo') {
            columnsTargeted = fileContent.querySelectorAll('.pseudo')
         }
         if (thisOption.id === 'colDialogType') {
            columnsTargeted = fileContent.querySelectorAll('.ton')
         }


         if (thisOption.id === 'colPseudo' || thisOption.id === 'colDialogType') {
            for (let thisCol of columnsTargeted) {
               if (thisOption.checked) {
                  thisCol.classList.add('hide')
               } else {
                  thisCol.classList.remove('hide')
               }
            }
         }
      })

   }

}
