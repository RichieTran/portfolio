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
let muted = false;
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('.speaker').addEventListener('click', function(element){
        muted = !muted;
        if(muted){
            document.querySelector('.speaker').classList.add('muted');
        } else {
            document.querySelector('.speaker').classList.remove('muted');
        }
    });

    const apps = document.querySelectorAll('.app');
    const appGrid = document.querySelector('.appGrid');
    
    apps.forEach(function(app){
        app.addEventListener('click', function(element){
            element.stopPropagation();
            if(!lastClicked){
                app.classList.add('selected');
                lastClicked = app;
                if(element.originalEvent.detail > 1){
                    return;
                }
            }
            else if(lastClicked !== app){
                lastClicked.classList.remove('selected');
                app.classList.add('selected');
                lastClicked = app;
                if(element.originalEvent.detail > 1){
                    return;
                }
            }
        });
        
        app.addEventListener('dblclick', function(element){
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
                
                win.innerHTML = '<header>' + app.id + '<close></close>' + '</header>' + '<p>Window content</p>';
                
                document.body.appendChild(win);
                app.classList.add('opened');
            }
        });
    });

    appGrid.addEventListener('click', function(element){
        if(lastClicked){
            lastClicked.classList.remove('selected');
            lastClicked = null
        }
    });
});
