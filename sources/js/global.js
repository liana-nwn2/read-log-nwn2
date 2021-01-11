const domLoaded = function () {

   // Détection de la langue

   let navigatorLangFR = /^fr\b/.test(navigator.language)
   const domToTranslate = document.querySelectorAll("[data-fr]")

   domToTranslate.forEach(thisDom => {
      if (navigatorLangFR) {
         thisDom.textContent = thisDom.dataset.fr
      } else {
         thisDom.textContent = thisDom.dataset.en
      }
   })

   document.getElementById('arrayRefSearch').value = ''
   document.getElementById('languesListeRef').value = ''

   const folderPicker = document.getElementById("folderPicker")
   folderPicker.addEventListener("change", function (event) {

      const warningInfo = document.querySelector('.warning_info')
      let allFiles = initFileList(this.files)
      let chatLog = allFiles.chatLog
      let combatLog = allFiles.combatLog

      warningInfo.style.display = 'none'

      if (chatLog.length > 0 && combatLog.length > 0) {

         openFiles(allFiles, 'langues', '')

      } else if (chatLog.length > 0 && combatLog.length === 0) {

         openFiles(chatLog, 'process', '')

      } else {
         warningInfo.style.display = 'flex'
      }
   })

   setStaticsEvents(document.getElementById('listing'))
   resizeResult()

}


// ---------------------------------------------------------
//    INITIALISATION DE LA LISTE DES FICHIERS
// ---------------------------------------------------------
const initFileList = (listFiles) => {

   let logFilesDef = []
   let traducFilesDef = []

   for (let thisFile of listFiles) {

      let isFolder = thisFile.webkitRelativePath.match(/[/]/g).length !== 1
      let isChatLog = thisFile.name.match('Chatlog')
      let isCombatLog = thisFile.name.match('Combatlog')

      if (!isFolder) {
         if (isChatLog)
            logFilesDef.push(thisFile)
         if (isCombatLog) {
            traducFilesDef.push(thisFile)
         }
      }

   }

   return {chatLog: logFilesDef, combatLog: traducFilesDef}

}
// ---------------------------------------------------------
//    CHARGEMENT DE LA LISTE DES FICHIERS DANS UL#LISTING
// ---------------------------------------------------------
const setupFileListing = (fileListe, search, occurences) => {

   const listingFilesUl = document.getElementById('listing')
   const regexName = /(.*?)(?=\(|_(Chatlog.*?)$)/g
   let allFilesLi = []
   let index = 0

   let oldSelection = listingFilesUl.querySelector('.selected')
   if (oldSelection !== null)
      oldSelection = oldSelection.querySelector('span:nth-child(2)').textContent
   else
      oldSelection = ''

   listingFilesUl.innerHTML = ''

   for (let thisFile of fileListe) {

      let fileName = thisFile.name.slice(0, -4)
      let fileIndexInfo = (index + 1).toString()

      while (fileIndexInfo.length <= (fileListe.length).toString().length) {
         fileIndexInfo = `0${fileIndexInfo}`
      }

      let classSelected = ''

      if (oldSelection === fileName || (oldSelection === '' && index === 0)) {
         classSelected = 'selected'
      }

      let founded = search ? `<span class="founded">${occurences[index]}</span>` : ''

      let thisNewLi = `<li class="${classSelected}" data-index="${index}" ><span>${fileIndexInfo}</span><span>${fileName}</span>${founded}</li>`

      allFilesLi.push(thisNewLi)
      index++
   }

   listingFilesUl.innerHTML = allFilesLi.join('')

   let gotToLiSelected = listingFilesUl.querySelector('.selected')
   if (!gotToLiSelected) {
      gotToLiSelected = listingFilesUl.querySelector('li:first-child')
      gotToLiSelected.classList.add('selected')
   }
   gotToLiSelected.scrollIntoView({behavior: "smooth", block: 'start', inline: 'start'})

   setDynamicsEvents(listingFilesUl, fileListe)

}
// ---------------------------------------------------------
//    LISTENERS STATIQUES
// ---------------------------------------------------------
const setStaticsEvents = (listingFilesUl) => {

   // AFFICHE LES INFOS DU LOG
   const statsInfo = document.getElementById('statsInfo')

   statsInfo.querySelector('.icon').addEventListener("click", function (e) {

      if (statsInfo.offsetWidth === 0) {

         statsInfo.style.width = '260px'//blocDetails.offsetWidth + 16 +14
         statsInfo.style.minWidth = '260px'//blocDetails.offsetWidth + 16 +14
         this.classList.replace('close', 'open')

      } else {
         statsInfo.style.width = '0'
         statsInfo.style.minWidth = '0'
         this.classList.replace('open', 'close')
      }


   })

   // QUITTE LE MODE RECHERCHE
   document.querySelector('.back_to_liste').addEventListener("click", function (e) {

      if (this.classList.contains('show')) {

         setupFileListing(initFileList(document.getElementById("folderPicker").files).chatLog, false)
         this.classList.remove('show')
         document.querySelector('.table_container').classList.remove('resize')

         const popupSearchFiles = document.getElementById('searchFiles')
         popupSearchFiles.classList.replace('show', 'close')
         popupSearchFiles.querySelector('#goSearch').textContent = "Lancer la recherche"
         popupSearchFiles.querySelector('#goNewSearch').classList.add('disabled')

      } else {
         return false
      }

   })


   // MASQUE LA LISTE DES FICHIERS
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

   // NAVIGATION PREV / NEXT
   const navigBtns = document.querySelectorAll('.file_prev, .file_next')
   for (let navigBtn of navigBtns) {

      navigBtn.addEventListener("click", function (e) {

         let selectedLi = listingFilesUl.querySelector('.selected')
         let allLi = listingFilesUl.querySelectorAll('li')
         let indexToNavig = selectedLi.dataset.index

         if (this.classList.contains('file_prev') && indexToNavig > 0) {
            navigBtns[1].classList.remove('disabled')
            indexToNavig--
         } else if (this.classList.contains('file_next') && indexToNavig < allLi.length - 1) {
            navigBtns[0].classList.remove('disabled')
            indexToNavig++
         }

         if (+indexToNavig === 0 || +indexToNavig === allLi.length - 1)
            this.classList.add('disabled')

         if (+indexToNavig !== +selectedLi.dataset.index)
            listingFilesUl.querySelector('li[data-index="' + indexToNavig + '"]').click()

      })
   }

   // --- RECHERCHER EVENTS -------------------------------------------------
   const inputTermToSearch = document.getElementById('termToSearch')

   inputTermToSearch.addEventListener("keyup", function (e) {

      let termToSearch = this.value
      let verifSpaces = termToSearch.match(/^\s+/g) // verif la présence d'espaces en début de ligne

      if (termToSearch.length > 2 && !verifSpaces) {
         this.classList.remove('invalid')
         if (e.key === 'Enter') {
            document.getElementById('goSearch').click()
         }
      } else if (verifSpaces) {
         this.classList.add('invalid')
         this.value = ''
      }


   })

   let checkByDate = document.getElementById('checkByDate')

   let dateDeb, dateFin

   verifCheckByDate(checkByDate.checked)

   checkByDate.addEventListener("click", function (e) {
      verifCheckByDate(checkByDate.checked)
   })

   const dateChoosen = document.querySelectorAll('#searchFiles input[type=date]')

   for (let inputDate of dateChoosen) {
      inputDate.addEventListener("change", function (e) {
         if (dateChoosen[0].value !== '' && dateChoosen[1].value !== '' && dateChoosen[0].value > dateChoosen[1].value) {
            dateChoosen[0].value = ''
         } else {
            dateDeb = dateChoosen[0].value
            dateFin = dateChoosen[1].value
         }
      })
   }


   // AFFICHE / MASQUE LE POPUP DE RECHERCHE
   const openSearch = document.querySelector('.menu_options .open_search span')
   const popupSearch = document.getElementById('searchFiles')

   openSearch.addEventListener("click", function (e) {

      if (popupSearch.classList.contains('close') || popupSearch.classList.length === 0) {
         popupSearch.classList.remove('close')
         popupSearch.classList.add('show')
         popupSearch.querySelector('#goSearch').focus()

      } else {
         popupSearch.classList.add('close')
         popupSearch.classList.remove('show')
      }
   })

   popupSearch.querySelector('.close_btn').addEventListener("click", function (e) {
      openSearch.click()
   })

   document.querySelector('.table_container').addEventListener("click", function (e) {
      e.stopImmediatePropagation()

      let elem = e.target
      elem = elem.closest('#searchFiles')

      if ((elem === null || elem.id !== 'searchFiles') && popupSearch.classList.contains('show')) {
         openSearch.click()
      }
   })

   popupSearch.querySelector('.search_fail').addEventListener("click", function () {
      this.classList.remove('show')
   })

}
// ---------------------------------------------------------
//    LISTENERS DYNAMIQUES
// ---------------------------------------------------------
const setDynamicsEvents = (listingFilesUl, fileListe) => {

   // MASQUE LES COLONNES PSEUDO ET TYPE DEMESSAGE
   const options = document.querySelectorAll('.input_group input[type="checkbox"]')
   const fileContent = document.querySelector('#fileContent tbody')

   for (let thisOption of options) {

      let columnsTargeted

      thisOption.addEventListener("click", function (e) {

         if (thisOption.id === 'fileSort') {
            sortFiles(thisOption.checked)
         }

         if (thisOption.id === 'colPseudo') {
            columnsTargeted = fileContent.querySelectorAll('.pseudo')
         }
         if (thisOption.id === 'colDialogType') {
            columnsTargeted = fileContent.querySelectorAll('.msgType')
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

   // CLICK SUR UN FICHIER (LI) DE LA LISTE
   const clickedLiListe = (e) => {

      const thisLi = e.target
      const liSelected = listingFilesUl.querySelector('li.selected')

      if (liSelected) {
         liSelected.classList.remove('selected')
      }

      thisLi.classList.add('selected')
      updateNavig(thisLi, listeLi.length, document.querySelectorAll('.file_prev, .file_next, .file_name, .file_num'))
      openFiles([fileListe[thisLi.dataset.index]], 'process')

   }

   const listeLi = listingFilesUl.querySelectorAll('li')
   listeLi.forEach(thisLi => thisLi.onclick = clickedLiListe)

   // LISTE DES FICHIERS CHARGÉS -> on rend actif les boutons de navigation et de recherche
   document.querySelector('.menu_options .open_search').classList.remove('disabled')
   document.querySelector('.menu_options li.navig').classList.remove('disabled')


   //CLICK BOUTON RECHERCHER
   const clickedBtnSearch = (e) => {

      e.preventDefault()

      const inputTermToSearch = document.getElementById('termToSearch')
      let newFileListe

      let termToSearch = inputTermToSearch.value.trim()

      if (termToSearch.length > 2) {

         inputTermToSearch.value = termToSearch

         let searchOptions = {
            'termTosearch': termToSearch,
            'msgExcludeParty': document.getElementById('checkMsgExcludeParty').checked,
            'msgExcludeShout': document.getElementById('checkMsgExcludeShout').checked,
            'msgExcludeMp': document.getElementById('checkMsgExcludeMp').checked,
            'wholeWord': document.getElementById('checkWholeWord').checked,
            'checkCasse': document.getElementById('checkCaseSensitive').checked
         }

         let checkByDate = document.getElementById('checkByDate').checked

         if (e.target.id === 'goNewSearch') {
            newFileListe = document.getElementById("folderPicker").files
         }

         if (checkByDate) {
            newFileListe = updateListeFilesByDate(fileListe)
            openFiles(newFileListe, 'search', searchOptions)
         } else {
            openFiles(fileListe, 'search', searchOptions)
         }

         document.querySelector('.back_to_liste').classList.add('show')

      } else {
         inputTermToSearch.classList.add('invalid')
         if (/^fr\b/.test(navigator.language)) {
            alert('Le champ de recherche ne doit pas être vide')
         } else {
            alert('The search field must not be empty')
         }
      }
   }

   const searchBtns = document.querySelectorAll('#searchFiles .searchContainer button')
   searchBtns.forEach(thisBtn => thisBtn.onclick = clickedBtnSearch)

}
//
//    MàJ DES BOUTONS DE NAVIGATION
//
const updateNavig = (itemLi, filesTotal, navigBtns) => {

   const fileName = navigBtns[0]
   const filePrev = navigBtns[1]
   const fileNext = navigBtns[2]
   const fileNum = navigBtns[3]

   fileName.textContent = itemLi.querySelector("span:nth-child(2)").textContent
   fileNum.innerHTML = `<span>${+itemLi.dataset.index + 1}</span>/<span>${filesTotal}</span>`

   if (+itemLi.dataset.index + 1 === 1) {

      filePrev.classList.add('disabled')
      fileNext.classList.remove('disabled')

   } else if (+itemLi.dataset.index + 1 === filesTotal) {

      filePrev.classList.remove('disabled')
      fileNext.classList.add('disabled')

   } else {

      filePrev.classList.remove('disabled')
      fileNext.classList.remove('disabled')

   }

}

//
//    CHANGE L'ORDRE D'AFFICHAGE DE LA LISTE DES FICHIERS
//
const sortFiles = (toSort) => {

   const fileListing = document.getElementById('listing')
   const filePrev = document.querySelector('.file_prev')
   const fileNext = document.querySelector('.file_next')

   let fileSelected = fileListing.querySelector('li.selected')
   let scrollPos = 'center'

   if (fileSelected) {

      if (toSort) {

         fileListing.classList.add('reverse')

         if (!fileSelected) {
            fileSelected = fileListing.querySelector('li:last-child')
            scrollPos = 'start'
         }

         filePrev.classList.remove('disabled')
         fileNext.classList.add('disabled')

      } else {

         fileListing.classList.remove('reverse')

         if (!fileSelected) {
            fileSelected = fileListing.querySelector('li:first-child')
            scrollPos = 'end'
         }

         filePrev.classList.add('disabled')
         fileNext.classList.remove('disabled')

      }

      fileSelected.scrollIntoView({behavior: "smooth", block: scrollPos, inline: scrollPos})

      fileSelected.click()
   }
}

//
//    VÉRIFIE LES COCHES DE DATES
//
const verifCheckByDate = (checked) => {

   const chooseDate = document.querySelector('.chooseDate')

   if (checked) {
      chooseDate.classList.remove('disabled')
   } else {
      chooseDate.classList.add('disabled')
   }
}


const updateListeFilesByDate = (fileListe) => {

   let dateDeb = document.getElementById('dateDeb').value
   let dateFin = document.getElementById('dateFin').value

   let index = 0

   while (index < fileListe.length) {

      let thisFileName = fileListe[index].name.slice(0, -4)
      let thisFileDate = thisFileName.slice(thisFileName.length - 10).toString()
      let matchDate = thisFileDate.match(/([0-9]{4})\D([0-9]{2})\D([0-9]{2})$/g).toString() //.getTime()

      if ((matchDate < dateDeb) || (matchDate > dateFin)) {
         fileListe.splice(index, 1)
         index--
      }

      index++

   }
   return fileListe
}
// ---------------------------------------------------------
//    LISTENERS TABLEAUX DE RÉSULTATS
// ---------------------------------------------------------
const tableResultListeners = () => {

   const clickedLine = (e) => {
      const fileContent = document.getElementById('fileContent')
      let thisLine = e.target

      if (thisLine.className !== 'index') {
         thisLine = thisLine.closest('tr').querySelector('td.index')
      }
      let getLineValue = thisLine.dataset.index
      let jumpToLine = fileContent.querySelector('td[data-index="' + getLineValue + '"]')

      document.querySelectorAll('table td.focus').forEach(focus => focus.classList.remove('focus'))

      thisLine.classList.add('focus')
      jumpToLine.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      jumpToLine.classList.add('focus')

   }

   const resultByLineTable = document.querySelectorAll('#resultByLine tr')

   resultByLineTable.forEach(lineResult => lineResult.onclick = clickedLine)


   // AJOUTE UN ROLLOVER SUR LES CELLUlES PjName POUR LES NOMS LONGS
   const cellPjFullName = document.querySelectorAll('.pjName.btn')
   const popupFullName = document.getElementById('popupFullName')

   const mouseIn = (e) => {
      const thisLine = e.target
      popupFullName.classList.add('show')
      popupFullName.innerText = thisLine.dataset.fullname
      popupFullName.style.color = thisLine.style.color
      popupFullName.style.top = thisLine.getBoundingClientRect().top + 'px'
      popupFullName.style.left = `${thisLine.getBoundingClientRect().left - document.querySelector('.col_left').offsetWidth + thisLine.offsetWidth}px`
   }
   const mouseOut = (e) => {
      popupFullName.classList.remove('show')
   }

   cellPjFullName.forEach(fullName => fullName.onmouseenter = mouseIn)
   cellPjFullName.forEach(fullName => fullName.onmouseleave = mouseOut)


   // Click sur la liste des participants
   const statsInfoDetails = document.querySelectorAll('#statsInfo span.plus, #statsInfo span.moins')

   statsInfoDetails.forEach(thisBtn => {

      let loop = 0

      if (thisBtn.classList.contains('plus')) {
         let allLinesPj = document.querySelectorAll('#fileContent tr[data-numpj="' + thisBtn.closest('li').dataset.numpj + '"]')
         thisBtn.previousElementSibling.textContent = allLinesPj.length.toString()
         thisBtn.previousElementSibling.dataset.maxSpeech = allLinesPj.length.toString()
      }

      thisBtn.onclick = function (e) {

         const thisBtn = e.target
         const thisPjNum = thisBtn.closest('li').dataset.numpj

         let allLinesPj = document.querySelectorAll('#fileContent tr[data-numpj="' + thisPjNum + '"]')
         document.querySelectorAll('#fileContent td.index').forEach(line => line.classList.remove('focus'))

         statsInfoDetails.forEach(btn => btn.classList.remove('end'))
         let btnPlus = thisBtn.closest('li').querySelector('.plus')
         let btnMoins = thisBtn.closest('li').querySelector('.moins')
         let maxSpeech = thisBtn.closest('li').querySelector('.num-speech')

         if (thisBtn.classList.contains('plus')) {

            loop = thisBtn.dataset.currentIndex
            loop++

            if (loop === allLinesPj.length) {
               thisBtn.classList.add('end')
               loop = 0
            }

            thisBtn.dataset.currentIndex = loop
            btnMoins.classList.remove('end')


         } else if (thisBtn.classList.contains('moins')) {

            loop = btnPlus.dataset.currentIndex
            loop--

            if (loop < 0) {
               thisBtn.classList.add('end')
               loop = allLinesPj.length - 1
            }

            btnPlus.dataset.currentIndex = loop
            btnPlus.classList.remove('end')

         }

         maxSpeech.textContent = `${loop + 1}/${maxSpeech.dataset.maxSpeech}`

         if (allLinesPj[loop]) {
            allLinesPj[loop].scrollIntoView({behavior: "smooth", block: 'start', inline: 'start'})
            allLinesPj[loop].querySelector('td.index').classList.add('focus')
         }

      }
   })

   const statsInfoDetailsLi = document.querySelectorAll('#statsInfo li > span:first-child')
   statsInfoDetailsLi.forEach(lineLi => lineLi.onclick = function () {
      lineLi.closest('li').querySelector('.plus').click()
   })


}

// ---------------------------------------------------------
//    REDIMENSIONNE VERTICALEMENT LES TABLEAUX DE RÉSULATS #RESULTBYLINE, #FILECONTENT
// ---------------------------------------------------------

const resizeResult = () => {

   const searchResult = document.querySelector('.search_result')
   const fileContent = document.querySelector('.file_content')

   const resize = (e) => {

      let containerHeight = document.querySelector('.table_container').offsetHeight

      let posPrct = ((e.y - 60) / containerHeight) * 100 // 60 -> table_container.top : 60px

      searchResult.style.height = `calc(${posPrct}% - 7px)` //posPrct + "%"
      fileContent.style.height = `calc(100% - ${posPrct}%)`//(100 - posPrct) + "%"
      handle.style.top = `calc(${posPrct}% - 7px)`

   }

   const handle = document.querySelector('.handle')

   handle.addEventListener("mousedown", function (e) {
      document.addEventListener("mousemove", resize, false)
   }, false)

   document.addEventListener("mouseup", function () {
      document.removeEventListener("mousemove", resize, false)
   }, false)

}

// ---------------------------------------------------------
//    OUVERTURE D'UN LOG
// ---------------------------------------------------------
const openFiles = (allFiles, mode, searchOptions) => {

   const body = document.body

   let listeFiles = allFiles

   let fileindex = 1
   let languesLines = []
   let searchResult = []
   let newFileListe = []
   let allPos = []

   if (mode === 'langues') {
      listeFiles = allFiles.combatLog
   }

   body.classList.add('wait')
   const startTime = performance.now()
   let durationSearch = 0
   let durationLang = 0
   let durationProcess = 0

   // console.warn(listeFiles.length)

   for (let thisFile of listeFiles) {

      // "Promise" sinon l'execution des fonctions démarrent avant la fin de la lecture de "FileReader"
      let filePromise = new Promise(resolve => {
         let fileReader = new FileReader()
         fileReader.onload = () => resolve(fileReader.result)
         //onloadend ?
         // fileReader.readAsText(thisFile, 'CP1251')
         fileReader.onprogress = function(data) {
            if (data.lengthComputable) {
               let progress =  (data.loaded / data.total) * 100
               document.querySelector('#blocWait .progress').style.width = `${progress}%`
               //console.warn(progress);
            }
         }
         fileReader.readAsText(thisFile, 'ISO-8859-1')
      })

      Promise.all([filePromise]).then(fileContents => {
      // Promise.resolve([filePromise]).then(fileContents => {

         let matchLineSearch, thisLogFormatted, result

         matchLineSearch = /([\[][0-9]{2}:[0-9]{2}] .*?: \[.*?\] [^\[]+)$/gm
         thisLogFormatted = fileContents.join('').match(new RegExp(matchLineSearch))

         switch (mode) {
            case 'langues' : {

               matchLineSearch = /^([\[][0-9]{2}:[0-9]{2}])\s<color=lightgrey>\s?(.*?\s):?(\(.*?\)\s)?(.*?)<\/c.*?>$/gm
               thisLogFormatted = fileContents.join('').match(new RegExp(matchLineSearch))

               for (let index in thisLogFormatted) {
                  let line = thisLogFormatted[index]
                  let newLine
                  newLine = line.replace(/<color=.*?>\s?/g, '').replace(/<\/c.*?>/g, '')
                  thisLogFormatted[index] = /^([\[][0-9]{2}:[0-9]{2}])\s(.*?)(\(.*\)|:)\s(.*?)$/gm.exec(newLine)
               }

               if (thisLogFormatted !== null) {
                  languesLines.push({file: thisFile.name, lines: thisLogFormatted})
               }
               if (fileindex === listeFiles.length) {
                  document.getElementById('languesListeRef').value = JSON.stringify(languesLines)
                  body.classList.remove('wait')

                  setupFileListing(allFiles.chatLog, false)
                  sortFiles(document.getElementById('fileSort').checked)
                  document.querySelector('#statsInfo .icon').classList.add('close')

               }

              // durationLang = performance.now() - startTime;
              // console.log(`durée Lang : ${durationLang}ms`);

            }
               break
            case 'search' : {

               result = searchInFile(thisFile.name, thisLogFormatted, searchOptions)

               if (result.datas.length > 0) {
                  searchResult.push({fileName: thisFile.name, datas: result.datas, allPos: result.numPos})
                  newFileListe.push(thisFile)
               }

               // let fileTotal = listeFiles.length
               // fileTotal = fileTotal === 0 ? 1 : fileTotal -1
               // if (fileindex === fileTotal) {
               if (fileindex === listeFiles.length) {

                  if (searchResult.length > 0) {

                     searchResult.sort((a, b) => {
                        return a.fileName.localeCompare(b.fileName)
                     })

                     newFileListe.sort((a, b) => {
                        return a.name.localeCompare(b.name)
                     })

                     searchResult.forEach(item => {
                        allPos.push(item.allPos)
                     })

                     setupFileListing(newFileListe, true, allPos)

                     document.getElementById('arrayRefSearch').value = JSON.stringify(searchResult)
                     document.querySelector('.table_container').classList.add('resize')
                     let liToSelect = document.querySelector('#listing li.selected')
                     if (!liToSelect) {
                        liToSelect = document.querySelector('#listing li:first-child')
                     }
                     liToSelect.click()

                  } else {

                     const searchFail = document.querySelector('#searchFiles .search_fail')
                     let searchFailedMsg

                     if (/^fr\b/.test(navigator.language)) {
                        searchFailedMsg = searchFail.dataset.fr
                     } else {
                        searchFailedMsg = searchFail.dataset.en
                     }

                     searchFailedMsg = searchFailedMsg.replace(/(\[\s%%%\s\])/g, `<strong>[ ${searchOptions.termTosearch} ]</strong>`)

                     searchFail.innerHTML = `<span>${searchFailedMsg}</span>`
                     searchFail.classList.add('show')
                     body.classList.remove('wait')
                  }

                 // durationSearch = performance.now() - startTime;
                 // console.log(`durée SEARCH : ${durationSearch}ms`);

               }
            }
               break
            case 'process' : {

               processLog(
                   thisLogFormatted,
                   thisFile.name,
                   document.querySelector('.table_container').classList.contains('resize')
               )

               tableResultListeners()
               body.classList.remove('wait')

              // durationProcess = performance.now() - startTime;
             //  console.log(`durée PROCESS : ${durationProcess}ms`);
             //  console.log(`durée TOTALE : ${durationProcess + durationSearch}ms`);
            }
               break

         }
         fileindex++
      })
   }
   // duration = performance.now() - startTime;
   // console.log(`durée TOTALE : ${duration}ms`);
}
// ---------------------------------------------------------
//    RECHERCHE DU TERME
// ---------------------------------------------------------
const searchInFile = (thisFileName, thisLog, searchOptions) => {

   //console.log(thisFileName)

   let stringToFind = searchOptions.termTosearch
   let index = 0
   let allPos = 0
   let pos, founded, newMessage, regEx, message, messageType
   let arrayResult = {datas: [], numPos: ''}

   let languageInThisLog = JSON.parse(document.getElementById('languesListeRef').value)
   let resultSearchLang = languageInThisLog.find(item => item.file === thisFileName.replace('Chatlog', 'Combatlog'))

   let maj = searchOptions.checkCasse ? '' : 'i' // sensible à la casse ? oui : non / i : insensitive

   if (searchOptions.wholeWord) {
      // mot entier
      regEx = new RegExp("(?<=^|[^a-zA-ZÀ-ÖØ-öø-ÿ])(" + stringToFind + ")(?=[^a-zA-ZÀ-ÖØ-öø-ÿ]|$)", "g" + maj)
      // -> double anti-slash \\ pour une expression en string
   } else {
      // bout de mot
      regEx = new RegExp(stringToFind, "g" + maj)
   }

   // CombatLog
   if (resultSearchLang !== undefined) {

      let index = 0

      resultSearchLang.lines.forEach(line => {

         line[4] = line[4].replace(/(<span class="highlight">.*?<\/span>)/g, "$&")

         let matchWord
         while ((matchWord = regEx.exec(line[4])) !== null) {
            if (matchWord.index === regEx.lastIndex) {
               regEx.lastIndex++
            }
            founded = true
            allPos++
         }

         if (founded)
            line[4] = line[4].replace(regEx, '<span class="highlight">$&</span>')

         index++

      })

      languageInThisLog.splice(languageInThisLog.indexOf(resultSearchLang), 1, resultSearchLang)
      document.getElementById('languesListeRef').value = JSON.stringify(languageInThisLog)

   }


   for (let thisLine of thisLog) {

      //thisLine = thisLine.replaceAll(/<[^>]*>/g, "")

      // récupère le début de la ligne : heure / compte / pj / msg type / message
      // const search = /^[\[][0-9]{2}:[0-9]{2}] \[.*?\].*?: (\[.*?\]) ([^\[]+)$/gm
      const search = /^[\[][0-9]{2}:[0-9]{2}].\[.*?\].*?: (\[.*?\])(.*)$/gm
      let whileMatch = search.exec(thisLine)

      founded = false
      pos = []
      newMessage = []

      if (whileMatch !== null) {

         messageType = whileMatch[1].slice(1, -1).toLowerCase().trim()
         message = whileMatch[2].replaceAll(/(\r\n|\n|\r)/gm, "<br>") // récup le message + remplace les sauts de ligne et retours chariot par '<br>'

         // DMFI Modif Septirage
         if (messageType.length === 10 && messageType === "servertell" && index - 1 > 0 && message.match("<C=#EDBAB2>")) {

            // message = message.replaceAll(/<[^>]*>/g, "")
            message = message.replaceAll(/<(?!br\s*\/?)[^>]+>/g, "")

            let prevLine = thisLog[index - 1].replaceAll(/<[^>]*>/g, "")
            // let prevSearch = /^[\[][0-9]{2}:[0-9]{2}] \[.*?\].*?: (\[.*?\]) ([^\[]+)$/gm
            let prevSearch = /^[\[][0-9]{2}:[0-9]{2}] (.*?|\[.*?\].*?:) (\[.*?\])(.*)$/gm

            let prevLineMatch = prevSearch.exec(prevLine)

            messageType = prevLineMatch[2].slice(1, -1).toLowerCase().trim()

            // let matchLang = /(^\([^>]*\)\s:\s)(.*)$/gm.exec(message)
            let matchLang = /^\[.*?\]\s\((.*?)\)\s:\s(.*?)$/gm.exec(message.trim())
            if (matchLang !== null) {
               message = `<span class="traduc"><strong>${matchLang[1]}</strong> ${matchLang[2]}</span>`
            }

         } else {
            // message = message.replaceAll(/<[^>]*>/g, "")
            message = message.replaceAll(/<(?!br\s*\/?)[^>]+>/g, "")
         }


         if ((messageType === 'tell' && !searchOptions.msgExcludeMp) ||
             (messageType === 'shout' && !searchOptions.msgExcludeShout) ||
             (messageType === 'party' && !searchOptions.msgExcludeParty) ||
             (messageType === 'talk' || messageType === 'whisper' || messageType === 'dialog')) {

            // ChatLog
            let matchWord

            while ((matchWord = regEx.exec(message)) !== null) {
               if (matchWord.index === regEx.lastIndex) {
                  regEx.lastIndex++
               }
               founded = true
               allPos++
            }

            if (founded) {
               // newMessage.push(message.replace(regEx, `<span class="highlight">${stringToFind}</span>`))
               newMessage.push(message.replace(regEx, '<span class="highlight">$&</span>'))
            }

         }

      } else {
         //console.log('SEARCH ERREUR')
      }

      if (founded) {
         arrayResult.numPos = allPos
         arrayResult.datas.push({
            newMessage: newMessage,
            numLigne: index,
         })
      }

      index++

   }

   return arrayResult

}

// ---------------------------------------------------------
//    MISE EN FORME DU LOG
// ---------------------------------------------------------

const processLog = (thisLog, filename, resultByLine) => {

   const fileContentTable = document.querySelector('#fileContent tbody')
   const resultByLineTable = document.querySelector('#resultByLine tbody')

   // Recherche le nom du PJ dans le nom du fichier
   let filePjName = (/^(.*)([_]|[ (])(Chatlog)/g).exec(filename)
   filePjName = filePjName[1].trim().replaceAll('_', ' ')

   // Assigne une couleur pour chaque pj/pnj
   const listColors = lineColorByName(thisLog, filePjName)

   let formattedContent = []
   let formattedSearch = []
   let refResult, getRef, indexLine = 0
   let addRefLine
   let formattedTraducByLine// = ''
   let refLangue = document.getElementById('languesListeRef').value
   let languageInThisLog, getFileLangue

   if (refLangue.length > 0) {
      languageInThisLog = JSON.parse(refLangue)
      getFileLangue = languageInThisLog.find(item => item.file === filename.replace('Chatlog', 'Combatlog'))
   }

   if (resultByLine) {
      refResult = JSON.parse(document.getElementById('arrayRefSearch').value)
      getRef = refResult.find(item => item.fileName === filename)
   }

   for (let thisLine of thisLog) {

      // thisLine = thisLine.replaceAll(/<[^>]*>/g, "")
      thisLine = thisLine.replaceAll(/(\n\r|\r\n|\n|\r)/gm, "<br>")


      // regex : [00:00] [pseudo] (optionnel) Nom du PJ : [Type de message] -> jusqu'à la fin de l'entrée
      // const search = /^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\]) ([^\[]+)$/gm
      const search = /^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\]) (.*?)$/gm

      let match = search.exec(thisLine)
      let dmfiSeptiLangue = false
      let message = ''
      let msg = ''

      if (match !== null) {

         let heure = match[1]
         let pseudo = match[2] === undefined ? '(pnj ou dm)' : match[2].trim()
         let pjName = match[3].trim().slice(0, -1)
         let msgType = match[4]
         msg = match[5]//.replaceAll(/(\r\n|\n|\r)/gm, "<br>")

         // DMFI Modif Septirage
         // if (pseudo === '[Server]' && msgType === '[ServerTell]' && indexLine - 1 > 0) {
         if (pseudo === '[Server]' && msgType === '[ServerTell]' && indexLine - 1 > 0 && msg.match("<C=#EDBAB2>")) {

            // msg = msg.replaceAll(/<[^>]*>/g, "")
            // /<(?!br\s*\/?)[^>]+>/g, ''
            msg = msg.replaceAll(/<(?!br\s*\/?)[^>]+>/g, "")
            let prevLine = thisLog[indexLine - 1].replaceAll(/<[^>]*>/g, "")
            // let prevSearch = /^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\]) ([^\[]+)$/gm
            let prevSearch = /^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\])(.*)$/gm
            let prevLineMatch = prevSearch.exec(prevLine)

            pseudo = prevLineMatch[2] === undefined ? "(pnj ou dm)" : prevLineMatch[2].trim()
            pjName = prevLineMatch[3].trim().slice(0, -1)
            msgType = prevLineMatch[4]

            // let matchLang = /(^\([^>]*\)\s:\s)(.*)$/gm.exec(msg)
            let matchLang = /^\[.*?\]\s\((.*?)\)\s:\s(.*?)$/gm.exec(msg)
            if (matchLang !== null) {
               msg = `<span class="traduc"><strong>${matchLang[1]}</strong> ${matchLang[2]}</span>`
               dmfiSeptiLangue = true
            }

         } else {
            // msg = msg.replaceAll(/<[^>]*>/g, "")
            msg = msg.replaceAll(/<(?!br\s*\/?)[^>]+>/g, "")
         }


         // supprime les crochets + les espaces et passe tout en minuscule -> le type de message est utilisé en CSS.class
         let msgClass = msgType.slice(1, -1).replaceAll(' ', '').toLowerCase()

         // Masque / Affiche les colonnes pseudos
         const hideColPseudo = document.getElementById('colPseudo').checked
         let hideLinePseudo = hideColPseudo ? 'hide' : ''

         // Masque / Affiche les colonnes type de message
         const hideColDialogType = document.getElementById('colDialogType').checked
         let hideLineMsgType = hideColDialogType ? 'hide' : ''

         // Applique une couleur à chaque pj/pnj (si "undefined" -> message serveur -> gris par défaut)
         let indexPjName = listColors.names.indexOf(pjName)
         let lineColor = listColors.colors[indexPjName] === undefined ? '#b6c0ca' : listColors.colors[indexPjName]

         // Recherche les émotes *...* et les mets en italique
         let emotes = msg.split(/([*].*?[*])/g)

         let formatMsg = ''
         for (let emote of emotes) {
            if (emote.includes('*')) {
               formatMsg = formatMsg + `<span class="italic">${emote}</span>`
            } else if (emote !== '') {
               formatMsg = formatMsg + emote
            }
            msg = formatMsg
         }

         // Tronque les noms de pj trop longs
         let fullName, btn, maxChar = 23
         fullName = pjName

         if (pjName.length > maxChar) {
            pjName = pjName.slice(0, maxChar) + '...'
            btn = 'btn'
         }

         message = msg
         let searchedLine = false
         let searchedLineTraduc = false

         // Ajoute les langues
         let withTraduc = false
         let getLangueLine
         formattedTraducByLine = ''

         if (getFileLangue !== undefined) {
            getLangueLine = getFileLangue.lines.filter(line => line[1] === heure)
            withTraduc = getLangueLine.length > 0
         }

         if (withTraduc) {

            let thisItemLangue = getLangueLine[0]

            if (thisItemLangue[2].trim() === fullName && (msgType !== '[Tell]' && msgType !== '[Party]')) {

               formattedTraducByLine = `<span class="traduc"><strong>${thisItemLangue[3]}</strong> ${thisItemLangue[4]}</span>`

               let regHighLight = /(<span class="highlight">.*?<\/span>)/g
               if (regHighLight.test(thisItemLangue[4])) {
                  searchedLineTraduc = true
               }

               if (getFileLangue !== undefined) {
                  getFileLangue.lines.shift()

               }

            }

         }

         // Met en surbrilance le mot recherché dans la colonne message, si rien, la ligne n'est pas modifiée
         if (resultByLine && getRef !== undefined) {

            addRefLine = getRef.datas.find(item => item.numLigne === indexLine)

            if (addRefLine !== undefined && addRefLine.numLigne === indexLine) {
               searchedLine = true
               message = addRefLine.newMessage
            }

         }

         message = message + formattedTraducByLine

         let trClass = ''
         if (dmfiSeptiLangue) {
            // pseudo = ''
            // pjName = ''
            msgClass += ' no-svg'
            trClass = 'class = "traduc"'
         }

         // Ligne du tableau à ajouter
         let formattedLine = `<tr data-numPj = ${indexPjName} ${trClass}>
                                 <td class="index" data-index="${indexLine + 1}">${indexLine + 1}</td>
                                 <td class="heure">${heure}</td>
                                 <td class="pseudo ${hideLinePseudo}" style="color: ${lineColor}">${pseudo}</td>
                                 <td class="pjName ${btn}" style="color: ${lineColor}" data-fullName = "${fullName}">${pjName}</td>
                                 <td class="msgType ${msgClass} ${hideLineMsgType}" title="${msgClass}"><span>${msgType}</span></td>
                                 <td class="message ${msgClass}" style="color: ${lineColor}"><div>${message}</div></td>                                 
                              </tr>`

         formattedContent.push(formattedLine)

         // si un mot a été trouvé on ajoute la ligne au tableau des résultats
         if (searchedLine || searchedLineTraduc) {
            formattedSearch.push(formattedLine)
         }

      }

      indexLine++

   }

   // Si résultat de recherche -> on charge le tableau [resultByLineTable]
   if (resultByLine) {
      resultByLineTable.innerHTML = formattedSearch.join('')
      resultByLineTable.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})

      const popupSearchFiles = document.getElementById('searchFiles')
      popupSearchFiles.classList.replace('show', 'close')

      const btnGoSearch = popupSearchFiles.querySelector('#goSearch')
      if (/^fr\b/.test(navigator.language)) {
         btnGoSearch.textContent = btnGoSearch.dataset.frNext
      } else {
         btnGoSearch.textContent = btnGoSearch.dataset.enNext
      }
      popupSearchFiles.querySelector('#goNewSearch').classList.remove('disabled')

   }

   // Liste tous les participants du log
   const statsInfoDetails = document.querySelector('#statsInfo')
   let liLineName = []

   statsInfoDetails.querySelector('.pj_count > span > span').textContent = listColors.names.length.toString()

   for (let index in listColors.names) {
      liLineName.push(`<li data-numPj="${index}" style="color: ${listColors.colors[index]}">
                        <span>${listColors.names[index]}</span>
                        <div><span class="num-speech"></span>
                        <span class="plus" data-current-index="-1"></span>
                        <span class="moins"></span></div></li>`)
   }
   statsInfoDetails.querySelector('.details').innerHTML = `<ul>${liLineName.join('')}</ul>`


   // Charge le array "formattedContent" dans le tableau <table/>
   fileContentTable.innerHTML = formattedContent.join('')

   // Remonte en haut de la page.
   fileContentTable.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})

}

// ---------------------------------------------------------
//    GENERATION DU TABLEAU DE COULEURS
// ---------------------------------------------------------

const generateColors = () => {

   return [
      "hsl(306,51%,52%)",
      "hsl(93, 100%, 30.2%)",
      "hsl(240, 67.5%, 59%)",
      "hsl(50,100%,20%)",
      // "hsl(40,100%,23%)",
      "hsl(183, 87.6%, 25.3%)",
      "hsl(258,97%,60%)",
      "hsl(116,84%,26%)",
      // "hsl(344,62%,43%)",
      "hsl(46,55%,30%)",
      "hsl(186, 90%, 33%)",
      "hsl(22, 92.4%, 46.3%)",
      "hsl(225, 94.4%, 37%)",
      // "hsl(162, 30.8%, 47.1%)",
      "hsl(9,87%,42%)",
      "#0095ff",
      // "hsl(188, 100%, 32%)",
      // "hsl(98, 86.9%, 42%)",
      "hsl(280, 90%, 43%)",
      "hsl(23, 88.3%, 45%)",
      "hsl(162,46%,28%)",
      "hsl(14, 100%, 62.5%)",
      // "hsl(14,85%,41%)",
   ]

}

const lineColorByName = (unLog, filename) => {

   const listeColors = generateColors()
   let num = 1
   let tblPjName = {names: [], colors: []}

   for (let uneLigne of unLog) {

      let search = /^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\])/g
      let match = search.exec(uneLigne)
      let thePjName

      if (match !== null) {
         thePjName = match[3].trim().slice(0, -1)

         if (tblPjName.names.indexOf(thePjName) === -1 && thePjName !== '') {
            // let num = tblPjName.names.length
            tblPjName.names.push(thePjName)
            if (thePjName === filename) {
               tblPjName.colors.push(listeColors[0])
            } else {
               tblPjName.colors.push(listeColors[num])
            }
            num++
            if (num > listeColors.length - 1) {
               num = 1
            }
            // tblPjName.colors.push(getRandomInt(360) * (num + 1) % 360)
         }
      }
   }

   // let delta = Math.trunc(360 / +tblPjName.names.length)

   // for (let i in tblPjName.names) {
   //
   //    // tblPjName.colors.push(i * 40)
   //    tblPjName.colors.push((Math.floor(Math.random() * Math.floor(360 / +tblPjName.names.length)) * i) % 360)
   //
   // }

   return tblPjName

}

// Attend que la page soit TOTALEMENT chargée
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
   domLoaded()
} else {
   document.addEventListener("DOMContentLoaded", domLoaded)
}

