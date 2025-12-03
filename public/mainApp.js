function updateTime() {
    const time = document.getElementById("currentTime");
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    time.textContent = timeString;
}
updateTime();
setInterval(updateTime, 60000);

let lastClicked = null;
document.addEventListener('DOMContentLoaded', function(){
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
