document.addEventListener("DOMContentLoaded", function (e) {

   /*
   // Détection de la langue
   if (/^fr\b/.test(navigator.language)) {

   } else {

   }
    */


   const folderPicker = document.getElementById("folderPicker")
   folderPicker.addEventListener("change", function (event) {

      const warningInfo = document.querySelector('.warning_info')
      let allFiles = initFileList(this.files)
      let listFiles = allFiles.chatLog
      let languesFiles = allFiles.languesLog

      warningInfo.style.display = 'none'

      if (listFiles.length > 0) {
         // Récupère les langues
         openFiles(languesFiles, 'langues', '')

         setupFileListing(listFiles)
         sortFiles(document.getElementById('fileSort').checked)


      } else {
         warningInfo.style.display = 'flex'
      }
   })

   setStaticsEvents(document.getElementById('listing'))
   resizeResult()

})


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

   return {chatLog: logFilesDef, languesLog: traducFilesDef}

}
// ---------------------------------------------------------
//    CHARGEMENT DE LA LISTE DES FICHIERS DANS UL#LISTING
// ---------------------------------------------------------
const setupFileListing = (fileListe, search, occurences) => {

   const listingFilesUl = document.getElementById('listing')
   let allFilesLi = []
   let index = 0

   listingFilesUl.innerHTML = ''

   for (let thisFile of fileListe) {

      let fileName = thisFile.name.slice(0, -4)
      let fileIndexInfo = (index + 1).toString()

      while (fileIndexInfo.length <= (fileListe.length).toString().length) {
         fileIndexInfo = `0${fileIndexInfo}`
      }

      let classSelected = index === 0 ? 'selected' : ''

      let founded = search ? `<span class="founded">${occurences[index]}</span>` : ''

      let thisNewLi = `<li class="${classSelected}" data-index="${index}" data-file="${fileListe.indexOf(thisFile)}"><span>${fileIndexInfo}</span><span>${fileName}</span>${founded}</li>`

      allFilesLi.push(thisNewLi)
      index++
   }

   listingFilesUl.innerHTML = allFilesLi.join('')

   setDynamicsEvents(listingFilesUl, fileListe)

}
// ---------------------------------------------------------
//    LISTENERS STATIQUES
// ---------------------------------------------------------
const setStaticsEvents = (listingFilesUl) => {


   // QUITTE LE MODE RECHERCHE
   document.querySelector('.back_to_liste').addEventListener("click", function (e) {
      setupFileListing(initFileList(document.getElementById("folderPicker").files))
      this.classList.remove('show')
      document.querySelector('.table_container').classList.remove('resize')

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

   // listingFilesUl.querySelector('li.selected').click()


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
         alert('ERREUR')
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
      popupFullName.style.left = `${thisLine.getBoundingClientRect().left - (thisLine.offsetWidth / 2) - 10}px`
   }
   const mouseOut = (e) => {
      popupFullName.classList.remove('show')
   }

   cellPjFullName.forEach(fullName => fullName.onmouseenter = mouseIn)
   cellPjFullName.forEach(fullName => fullName.onmouseleave = mouseOut)

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
const openFiles = (listeFiles, mode, searchOptions) => {

   const body = document.body

   let fileindex = 1
   let languesLines = []
   let searchResult = []
   let newFileListe = []
   let allPos = []

   body.classList.add('wait')

   for (let thisFile of listeFiles) {

      // "Promise" sinon l'execution des fonctions démarrent avant la fin de la lecture de "FileReader"
      let filePromise = new Promise(resolve => {
         let fileReader = new FileReader()
         fileReader.readAsText(thisFile)
         fileReader.onloadend = () => resolve(fileReader.result)
      })

      // fileResult.push(filePromise)

      Promise.all([filePromise]).then(fileContents => {

         let matchLineSearch, thisLogFormatted, result

         matchLineSearch = /([\[][0-9]{2}:[0-9]{2}] .*?: \[.*?\] [^\[]+)/g
         thisLogFormatted = fileContents.join('').match(new RegExp(matchLineSearch))

         switch (mode) {
            case 'langues' : {

               // matchLineSearch = /^([\[][0-9]{2}:[0-9]{2}])\s<color=.*?>\s(.*?\s)(\(.*?\)\s)(.*?)<\/color>$/gm
               matchLineSearch = /^([\[][0-9]{2}:[0-9]{2}])\s<color=.*?>\s?(.*?\s):?(\(.*?\)\s)?(.*?)<\/color>$/gm
               thisLogFormatted = fileContents.join('').match(new RegExp(matchLineSearch))

               for (let index in thisLogFormatted) {
                  let line = thisLogFormatted[index]
                  let newLine
                  newLine = line.replace(/<color=.*?>\s?/g, '').replace(/<\/color>/g, '')
                  // thisLogFormatted[index] = newLine
                  // thisLogFormatted[index] = /([\[][0-9]{2}:[0-9]{2}])\s(.*?)\s(\(.*?\))\s(.*?)$/g.exec(newLine)
                  thisLogFormatted[index] = /^([\[][0-9]{2}:[0-9]{2}])\s(.*?)(\(.*\)|:)\s(.*?)$$/g.exec(newLine)
               }

               if (thisLogFormatted !== null) {
                  languesLines.push({file: thisFile.name, lines: thisLogFormatted})
               }
               if (fileindex === listeFiles.length) {
                  document.getElementById('languesListeRef').value = JSON.stringify(languesLines)
                  body.classList.remove('wait')
               }

            }
               break
            case 'search' : {

               result = searchInFile(thisLogFormatted, searchOptions)

               if (result.datas.length > 0) {
                  searchResult.push({fileName: thisFile.name, datas: result.datas, allPos: result.numPos})
                  newFileListe.push(thisFile)
               }

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
                     document.querySelector('#listing li.selected').click()

                  } else {
                     const searchFail = document.querySelector('#searchFiles .search_fail')
                     searchFail.innerHTML = `<span>La recherche du mot <strong>${searchOptions.termTosearch}</strong> n'a donnée aucun résultat</span>`
                     searchFail.classList.add('show')
                     body.classList.remove('wait')
                  }
               }
            }
               break
            case 'process' : {

               processLog(
                   thisLogFormatted,
                   thisFile.name,
                   //searchOptions.termTosearch,
                   document.querySelector('.table_container').classList.contains('resize')
               )

               tableResultListeners()
               body.classList.remove('wait')
            }
               break

         }

         fileindex++

      })
   }

}
// ---------------------------------------------------------
//    RECHERCHE DU TERME
// ---------------------------------------------------------
const searchInFile = (thisLog, searchOptions) => {

   let stringToFind = searchOptions.termTosearch
   let index = 0
   let allPos = 0
   let pos
   let founded
   let newMessage
   let arrayResult = {datas: [], numPos: ''}

   for (let thisLine of thisLog) {
      // récupère le début de la ligne : heure / compte / pj / msg type / message
      const search = /^[\[][0-9]{2}:[0-9]{2}] \[.*?\].*?: (\[.*?\]) ([^\[]+)/g
      let whileMatch = search.exec(thisLine)
      let regEx

      //allPos = 0
      founded = false
      pos = []
      newMessage = []

      if (whileMatch !== null) {

         let messageType = whileMatch[1].slice(1, -1).toLowerCase().trim()
         let message = whileMatch[2].replaceAll(/(\r\n|\n|\r)/gm, "<br>") // récup le message + supprime les sauts de ligne et retours chariot

         if ((messageType === 'tell' && !searchOptions.msgExcludeMp) ||
             (messageType === 'shout' && !searchOptions.msgExcludeShout) ||
             (messageType === 'party' && !searchOptions.msgExcludeParty) ||
             (messageType === 'talk' || messageType === 'whisper' || messageType === 'dialog')) {

            let maj = searchOptions.checkCasse ? '' : 'i' // sensible à la casse ? oui : non / i : insensitive

            if (searchOptions.wholeWord) {
               // mot entier
               regEx = new RegExp("(?<=^|[^a-zA-ZÀ-ÖØ-öø-ÿ])(" + stringToFind + ")(?=[^a-zA-ZÀ-ÖØ-öø-ÿ]|$)", "g" + maj)
               // -> double anti-slash \\ pour une expression en string
            } else {
               // bout de mot
               regEx = new RegExp(stringToFind, "g" + maj)
            }

            let matchWord
            while ((matchWord = regEx.exec(message)) !== null) {
               if (matchWord.index === regEx.lastIndex) {
                  regEx.lastIndex++
               }
               founded = true
               allPos++
            }

            if (founded) {
               newMessage.push(message.replace(regEx, "<span class='highlight'>$&</span>"))
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

// const processLog = (thisLog, filename, word, resultByLine) => {
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


   let languageInThisLog = JSON.parse(document.getElementById('languesListeRef').value)
   let getFileLangue = languageInThisLog.find(item => item.file === filename.replace('Chatlog', 'Combatlog'))

   if (resultByLine) {
      refResult = JSON.parse(document.getElementById('arrayRefSearch').value)
      getRef = refResult.find(item => item.fileName === filename)
   }

   let prevHeure = ''

   for (let thisLine of thisLog) {

      // regex : [00:00] [pseudo] (optionnel) Nom du PJ : [Type de message] -> jusqu'à la fin de l'entrée
      let search = /^([\[][0-9]{2}:[0-9]{2}])( \[.*?\])?(.*?: )(\[.*?\]) ([^\[]+)/g
      let match = search.exec(thisLine)
      let message = ''

      if (match !== null) {

         let heure = match[1]
         let pseudo = match[2] === undefined ? '(pnj ou dm)' : match[2]
         let pjName = match[3].trim().slice(0, -1)
         let msgType = match[4]
         let msg = match[5].replaceAll(/(\r\n|\n|\r)/gm, "<br>")

         // supprime les crochets + les espaces et passe tout en minuscule -> le type de message est utilisé en CSS.class
         let msgClass = msgType.slice(1, -1).replaceAll(' ', '').toLowerCase()

         // Masque / Affiche les colonnes pseudos
         const hideColPseudo = document.getElementById('colPseudo').checked
         let hideLinePseudo = hideColPseudo ? 'hide' : ''

         // Masque / Affiche les colonnes type de message
         const hideColDialogType = document.getElementById('colDialogType').checked
         let hideLineMsgType = hideColDialogType ? 'hide' : ''

         // Applique une couleur à chaque pj/pnj (si "undefined" -> message serveur -> gris par défaut)
         // let lineColor = `hsl(${listColors.colors[listColors.names.indexOf(pjName)]}, 80%, 35%)`
         let indexPjName = listColors.names.indexOf(pjName)
         let lineColor = listColors.colors[indexPjName] === undefined ? '#778999' : listColors.colors[indexPjName]

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

         // Met en surbrilance le mot recherché dans la colonne message, si rien, la ligne n'est pas modifiée
         message = msg
         let searchedLine = false
         if (resultByLine && getRef !== undefined) {

            addRefLine = getRef.datas.find(item => item.numLigne === indexLine)

            if (addRefLine !== undefined && addRefLine.numLigne === indexLine) {
               searchedLine = true
               message = addRefLine.newMessage
            }

         }

         // Ajoute les traductions
         let withTraduc = false
         let getLangueLine
         formattedTraducByLine = ''

         if (getFileLangue !== undefined) {
            getLangueLine = getFileLangue.lines.filter(line => line[1] === heure)
            withTraduc = getLangueLine.length > 0
         }

         prevHeure = heure

         if (prevHeure === heure) {

            if (withTraduc) {

               let thisItemLangue = getLangueLine[0]

               if (thisItemLangue[2].trim() === fullName) {

                  formattedTraducByLine = `<span class="traduc"><i>${thisItemLangue[3]}</i> ${thisItemLangue[4]}</span>`
                  message = message + formattedTraducByLine

                  if (getFileLangue !== undefined)
                     getFileLangue.lines.shift()

               }
            }

         }

         // Ligne du tableau à ajouter
         let formattedLine = `<tr>
                                 <td class="index" data-index="${indexLine + 1}">${indexLine + 1}</td>
                                 <td class="heure">${heure}</td>
                                 <td class="pseudo ${hideLinePseudo}" style="color: ${lineColor}">${pseudo}</td>
                                 <td class="pjName ${btn}" style="color: ${lineColor}" data-fullName = "${fullName}">${pjName}</td>
                                 <td class="${msgClass} msgType ${hideLineMsgType}" title="${msgClass}"><span>${msgType}</span></td>
                                 <td class="${msgClass} message" style="color: ${lineColor}">${message}</td>                                 
                              </tr>`

         formattedContent.push(formattedLine)

         if (searchedLine) {
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
      popupSearchFiles.querySelector('#goSearch').textContent = "Poursuivre la recherche"
      popupSearchFiles.querySelector('#goNewSearch').classList.remove('disabled')
   }

   // if (getFileLangue !== null) {
   //    document.querySelector('.traducByLine_container .traducByLine tbody').innerHTML = formattedTraduc.join('')
   // }

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
