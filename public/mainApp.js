function updateTime() {
    const time = document.getElementById("currentTime");
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    time.textContent = timeString;
}

updateTime();
const delay = (60 - new Date().getSeconds()) * 1000;
setTimeout(function(){
    updateTime();
    setInterval(updateTime, 60000);
}, delay);

let lastClicked = null;
let lastOpened = null;
let muted = false;
let zLevel = 0;

document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('.speaker').addEventListener('click', function(element){
        muted = !muted;
        if(muted){
            document.querySelector('.speaker').classList.add('muted');
        } else {
            document.querySelector('.speaker').classList.remove('muted');
        }
    });

    const appGrid = document.querySelector('.appGrid');

    appGrid.addEventListener('click', function(element){
        const app = element.target.closest('.app');
        if(app){
            element.stopPropagation();
            if(!lastClicked){
                app.classList.add('selected');
                lastClicked = app;
                if(element.detail > 1){
                    return;
                }
            }
            else if(lastClicked !== app){
                lastClicked.classList.remove('selected');
                app.classList.add('selected');
                lastClicked = app;
                if(element.detail > 1){
                    return;
                }
            }
        }
        else if(lastClicked){
            lastClicked.classList.remove('selected');
            lastClicked = null;
        }
    });

    appGrid.addEventListener('dblclick', function(element){
        const app = element.target.closest('.app');
        if(app){
            element.stopPropagation();
            if(!app.classList.contains('opened')){
                const win = document.createElement('span');
                win.id = app.id + "Window";
                win.className = "window";

                const maxX = Math.max(0, window.innerWidth - 800);
                const maxY = Math.max(0, window.innerHeight - 500);
                const randomX = Math.floor(Math.random() * maxX);
                const randomY = Math.floor(Math.random() * maxY);

                win.style.width = '800px';
                win.style.height = '500px';
                win.style.left = randomX + 'px';
                win.style.top = randomY + 'px';

                win.innerHTML = '<header id=windowHeader><icon>' + document.getElementById(app.id + "Img").outerHTML + '</icon><p>' + app.id + '</p><close></close></header>' + '<content></content>';

                if(app.id === "Socials"){
                    const content = win.querySelector('content');
                    content.innerHTML = '<button class="socialBtn" id="github"></button><p id="githubDesc">Click the button to go to my GitHub or find me by my username RichieTran!</p><button class="socialBtn" id="linkedin"></button><p id="linkedInDesc">Click the button to go to my Linked In or find me by my username richiettran!</p><button class="socialBtn" id="email"></button><p id="emailDesc">Click the button to email me or find me by my email richietran2024@gmail.com!</p>';
                    document.body.addEventListener('click', function(element){
                        const button = element.target.closest('.socialBtn');
                        if(button && button.id == "github"){
                            window.open("https://github.com/RichieTran")
                        }
                        else if(button && button.id == "linkedin"){
                            window.open("https://www.linkedin.com/in/richiettran/")
                        }
                        else if(button && button.id == "email"){
                            window.open("mailto:richietran2024@gmail.com")
                        }
                    })
                }

                if(app.id === "Resume"){
                    const content = win.querySelector('content');
                    content.innerHTML = '<div class="resumeContainer"><button class="resumeBtn" id="downloadBtn">Download</button><button class="resumeBtn" id="newTabBtn">New Tab</button><iframe src="images/Resume.pdf#toolbar=0" height="440" width="775" title="resume"></iframe></div>';

                    const downloadBtn = content.querySelector('#downloadBtn');
                    const newTabBtn = content.querySelector('#newTabBtn');

                    downloadBtn.addEventListener('click', function(e){
                        e.stopPropagation();
                        const link = document.createElement('a');
                        link.href = 'images/Resume.pdf';
                        link.download = 'Resume.pdf';
                        link.click();
                    });

                    newTabBtn.addEventListener('click', function(e){
                        e.stopPropagation();
                        window.open('images/Resume.pdf', '_blank');
                    });
                }

                document.body.appendChild(win);
                app.classList.add('opened');
                win.style.zIndex = zLevel;
                zLevel += 1;

                if (lastOpened){
                    lastOpened.classList.add('background');
                }
                lastOpened = win;

                dragElement(win);

                const closeBtn = win.querySelector('close');
                closeBtn.addEventListener('click', function(e){
                    e.stopPropagation();
                    win.remove();
                    app.classList.remove('opened');
                    if(lastOpened === win){
                        lastOpened = null;
                    }
                });
            }
            else if(document.getElementById(app.id + "Window").classList.contains('background')){
                const win = document.getElementById(app.id + "Window");
                lastOpened.classList.add('background');
                win.classList.remove('background');
                win.style.zIndex = zLevel;
                zLevel += 1;
                lastOpened = win;
            }
        }
    });

    document.body.addEventListener('click', function(element){
        const clickedWindow = element.target.closest('.window');
        if(clickedWindow && clickedWindow !== lastOpened){
            if(lastOpened){
                lastOpened.classList.add('background');
            }
            clickedWindow.classList.remove('background');
            lastOpened = clickedWindow;
            clickedWindow.style.zIndex = zLevel;
            zLevel += 1;
        }
    });

    document.body.addEventListener('mousedown', function(element){
        const window = element.target.closest('.window');
        if(window && window.classList.contains('background')){
            lastOpened.classList.add('background');
            window.classList.remove('background');
            lastOpened = window;
            window.style.zIndex = zLevel;
            zLevel += 1;
        }
    });

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var header = elmnt.querySelector('header');

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag);
        }

        function elementDrag(e) {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
        }

        if (header) {
            header.addEventListener('mousedown', dragMouseDown);
        } else {
            elmnt.addEventListener('mousedown', dragMouseDown);
        }
    }
});
