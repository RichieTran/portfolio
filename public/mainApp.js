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