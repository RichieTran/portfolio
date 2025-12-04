function updateTime() {
    const time = document.getElementById("currentTime");
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    time.textContent = timeString;
}
if(new Date().getSeconds() === 0){
    updateTime();
    setInterval(updateTime, 60000);
}
else{
    updateTime();
    const delay = (60 - new Date().getSeconds()) * 1000;
    setTimeout(function(){
        updateTime();
        setInterval(updateTime, 60000);
    }, delay);
}

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
            }
            else if(lastClicked != app){
                lastClicked.classList.remove('selected');
                app.classList.add('selected');
                lastClicked = app;
            }
            else{
                lastClicked.classList.add('opened');
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
