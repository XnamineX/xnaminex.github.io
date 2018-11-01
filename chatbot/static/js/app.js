(function () {
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyBpvSVoaitmp5_j_a7FiM7HvZR3WBo0ZPQ",
        authDomain: "new-tu-open-house.firebaseapp.com",
        databaseURL: "https://new-tu-open-house.firebaseio.com",
        projectId: "new-tu-open-house",
        storageBucket: "new-tu-open-house.appspot.com",
        messagingSenderId: "928873448229",
    }
    firebase.initializeApp(config)
    // Get uid and show the chat
    getRealTimeUid()

}())
let time = 10
let momentShow
let dateTimeNow
// Receive uid from image processing team
function getRealTimeUid(){
  const dbRefObject = firebase.database().ref().child('selectImg')
  // Create timestamp when open this page
  console.log(Date.now())
  console.log(Date.now()+2)
  DateTimeNow = Date.now()+2
  // Sync object changes
  dbRefObject.on('value', snap => {
      let data = snap.val()
      clearTimeout(momentShow)
      momentShow = setTimeout(chat(data.uid),1)
  })
}

// Get realtime data from firebase and filter
function chat(uid){

    // const preObject = document.getElementById('object')

    // Create references
    const dbRefObject = firebase.database().ref().child('chats').child(uid)

    // Sync object changes
    dbRefObject.on('value', snap => {
        let data = snap.val()
        // preObject.innerHTML = JSON.stringify(data,null,3)

        let chatMessage = filterChat(data)[0]
        let chatTime = filterChat(data)[1]
        let chatFrom = filterChat(data)[2]
        let chatType = filterChat(data)[3]

        // Show the Chatbox
        showChatBox(chatMessage,chatTime,chatFrom,chatType)

        // preObject.innerHTML = JSON.stringify(filterChat(data)[2],null,3)

        // Set always to the bottom of page
        window.scrollTo(0,document.body.scrollHeight)
    })

}


function filterChat(data){

    // Create container to contain data after filter
    let newData = {}

    // Filter the data for get data after present
    Object.keys(data).forEach(function (key) {
        let tempTime = data[key].timestamp

        if (tempTime > DateTimeNow) {
            newData[key] = data[key]

            // Filter the bad word

        }
    })

    // Filter to only message and time & format the time
    let chatMessage = []
    let chatTime = []
    let chatFrom = []
    let chatType = []
    Object.keys(newData).forEach(function(key){
        chatMessage = []
        chatTime = []
        chatFrom = []
        chatType = []
        chatMessage.push(newData[key].message)
        chatTime.push(timeConverter(newData[key].timestamp))
        chatFrom.push(newData[key].from)
        chatType.push(newData[key].type)
    })

    // Return the outcome
    return [chatMessage,chatTime,chatFrom,chatType,newData]
}

let index = 0

// Show the Chatbox function
function showChatBox(chatMessage,chatTime,chatFrom,chatType){
    chatMessage.forEach(function(element,i){
        if(chatType!="chat"){
            createUserChatBox("ผู้ใช้ได้ทำการส่งไฟล์",chatTime[i])
            index++;
        }
        else{
            if(index==0){
                if(chatFrom=="user"){
                    createUserChatBox(chatMessage[i],chatTime[i])
                    index++;
                }
                else{
                }
            }
            else{
                if(chatFrom=="user"){
                    createUserChatBox(chatMessage[i],chatTime[i])
                    index++;
                } else {
                    createBotChatBox(chatMessage[i],chatTime[i])
                    index++;
                }
            }
        }
    })
}

// Create time format from timestamp
function timeConverter(timestamp) {
    let min = ''
    if(new Date(timestamp).getMinutes()<10){
        min = String("0"+new Date(timestamp).getMinutes())
    } else {
        min = String(new Date(timestamp).getMinutes())
    }
    let timeFormat = new Date(timestamp).getHours()+":"+min
    return timeFormat;
}

// Create chat box element of user
function createUserChatBox(message,time){
    removeChat()
    messagesentSFX()
    setTimeout(function(){
        play_sound(message);
    },500)
    // Create chatbox element to contain message and time
    let chatBox = document.createElement('div')
    chatBox.className = 'chatBox'
    chatBox.setAttribute('style','display: flex;overflow: hidden;')
    
    // Create user blank box
    let uBoxLeft = document.createElement('div')
    uBoxLeft.className = 'uBoxLeft'
    let uBoxRight = document.createElement('div')
    uBoxRight.className = 'uBoxRight'

    // Create chat and time box
    let allBox = document.createElement('div')
    allBox.className = 'uAllBox'
    
    // Create message box element
    let messageBox = document.createElement('div')
    messageBox.className = 'userMessageBox'
    messageBox.innerHTML = message

    // Create time box element
    let allTimeBox = document.createElement('div')
    allTimeBox.className = 'allTimeBox'
    let timeBox = document.createElement('div')
    timeBox.className = 'uTimeBox'
    timeBox.innerHTML = time
    let bbTimeBox = document.createElement('div')
    bbTimeBox.className = 'blTimeBox'
    let buTimeBox = document.createElement('div')
    buTimeBox.className = 'blTimeBox'
    allTimeBox.appendChild(buTimeBox)
    allTimeBox.appendChild(timeBox)
    allTimeBox.appendChild(bbTimeBox)
    // Append message and time into allBox
    allBox.appendChild(allTimeBox)
    allBox.appendChild(messageBox)

    // Append to chatBox and append chatBox to body
    chatBox.appendChild(uBoxLeft)
    chatBox.appendChild(allBox)
    chatBox.appendChild(uBoxRight)
    document.getElementsByTagName('main')[0].appendChild(chatBox)
}

// Create chat box element of bot
function createBotChatBox(message,time){
    removeChat()
    setTimeout(function(){
        messagegetSFX()
    },500)
    setTimeout(function(){
        play_sound(message);
    },500)
    

    // Create chatbox element to contain message and time
    let chatBox = document.createElement('div')
    chatBox.className = 'chatBox'
    chatBox.setAttribute('style','display:flex;overflow:hidden')

    // Create user blank box
    let bBoxLeft = document.createElement('div')
    bBoxLeft.className = 'bBoxLeft'
    let bBoxRight = document.createElement('div')
    bBoxRight.className = 'bBoxRight'

    // Create chat and time box
    let allBox = document.createElement('div')
    allBox.className = 'bAllBox'

    // Create message box element
    let messageBox = document.createElement('div')
    messageBox.className = 'botMessageBox'
    messageBox.innerHTML = message

    // Create time box element
    let allTimeBox = document.createElement('div')
    allTimeBox.className = 'allTimeBox'
    let timeBox = document.createElement('div')
    timeBox.className = 'bTimeBox'
    timeBox.innerHTML = time
    let bbTimeBox = document.createElement('div')
    bbTimeBox.className = 'blTimeBox'
    let buTimeBox = document.createElement('div')
    buTimeBox.className = 'blTimeBox'
    allTimeBox.appendChild(buTimeBox)
    allTimeBox.appendChild(timeBox)
    allTimeBox.appendChild(bbTimeBox)

    // Append message and time into allBox
    allBox.appendChild(allTimeBox)
    allBox.appendChild(messageBox)

    // Append to chatBox and append chatBox to body
    chatBox.appendChild(bBoxLeft)
    chatBox.appendChild(allBox)
    chatBox.appendChild(bBoxRight)
    setTimeout(function(){
        document.getElementsByTagName('main')[0].appendChild(chatBox)
    },500)
}
var audioobj = null;
var last_word = '';
function play_sound(source, bypass = false)
{
    if(audioobj != null || !bypass){
        if(!audioobj.paused){
            last_word = source;
            return;
        }
    }
    audioobj = new Audio('https://www.bing.com/tspeak?&format=audio%2Fmp3&language=th&IG=43023E3DEB49437D8BADDD610BEB66AB&IID=translator.5034.2&r='+Math.random()+'&text=' + encodeURIComponent(source).replace(/'/g,"%27").replace(/"/g,"%22"));
    audioobj.play();
    
}

function check_play(){
    if(last_word == '' || !audioobj.paused){
        return;
    }
    play_sound(last_word);
    last_word = '';
}
function removeChat(){
    if(document.getElementsByClassName('chatBox').length>=5){
        setTimeout(function(){
            document.getElementsByClassName('chatBox')[0].remove()
        }, (40000/(document.getElementsByClassName('chatBox').length)));
        
    }
}

function messagegetSFX(){
    let audio = new Audio('./static/sfx/textgetSFX.mp3');
    audio.volume = 0.5;
    audio.play();
}

function messagesentSFX(){
    let audio = new Audio('./static/sfx/textsentSFX.mp3');
    audio.volume = 0.5;
    audio.play();
}

setInterval(check_play, 1);