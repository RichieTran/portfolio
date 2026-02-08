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
let startMenuOpen = false;

document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('.speaker').addEventListener('click', function(element){
        muted = !muted;
        if(muted){
            document.querySelector('.speaker').classList.add('muted');
        } else {
            document.querySelector('.speaker').classList.remove('muted');
        }
    });

    const startButton = document.querySelector('.start');

    startButton.addEventListener('click', function(element){
        element.stopPropagation();
        if(!startMenuOpen){
            const startMenu = document.createElement('div');
            startMenu.id = 'startMenu';
            startMenu.className = 'startMenu';

            startMenu.style.position = 'absolute';
            startMenu.style.bottom = '45px';
            startMenu.style.left = '3px';

            startMenu.innerHTML = `
                <div class="startMenuSidebar">
                    <p>Windows<span>95</span></p>
                </div>
                <div class="startMenuContent">
                    <button class="menuItem button" id="menuResume">
                        <img src="images/Resume.png" alt="">Resume
                    </button>
                    <button class="menuItem button hasSubmenu" id="menuProjects">
                        <img src="images/Projects.png" alt="">Projects
                        <span class="menuArrow">▶</span>
                    </button>
                    <button class="menuItem button" id="menuGithub">
                        <img src="images/GitHubLogo.png" alt="">Github
                    </button>
                    <button class="menuItem button" id="menuSettings">
                        <img src="images/Settings.png" alt="">Settings
                    </button>
                    <div class="menuDivider"></div>
                    <button class="menuItem button" id="menuShutDown">
                        <img src="images/ShutDown.png" alt="">Shut Down...
                    </button>
                </div>
            `;

            document.body.appendChild(startMenu);

            // Projects submenu hover handler
            const projectsBtn = startMenu.querySelector('#menuProjects');
            let projectsSubmenu = null;

            function closeProjectsSubmenu(){
                if(projectsSubmenu){
                    projectsSubmenu.remove();
                    projectsSubmenu = null;
                }
            }

            function closeStartMenu(){
                closeProjectsSubmenu();
                startMenu.remove();
                startButton.classList.remove('pressed');
                startMenuOpen = false;
            }

            startMenu.querySelector('#menuResume').addEventListener('click', function(e){
                e.stopPropagation();
                const app = document.getElementById('Resume');
                if(app && !app.classList.contains('opened')){
                    app.dispatchEvent(new MouseEvent('dblclick', {bubbles: true}));
                }
                closeStartMenu();
            });

            startMenu.querySelector('#menuGithub').addEventListener('click', function(e){
                e.stopPropagation();
                window.open('https://github.com/RichieTran/portfolio', '_blank');
                closeStartMenu();
            });

            // Submenu for projects start menu button
            projectsBtn.addEventListener('mouseenter', function(){
                if(!projectsSubmenu){
                    projectsSubmenu = document.createElement('div');
                    projectsSubmenu.className = 'submenu';
                    projectsSubmenu.innerHTML = `
                        <div class="submenuContent">
                            <button class="menuItem button" id="menuMoodMovie">
                                <img src="images/MoodMovie/moodMovie.png" alt="">MoodMovie
                            </button>
                            <button class="menuItem button" id="menuCrossyRoad">
                                <img src="images/CrossyRoad.png" alt="">Crossy Road
                            </button>
                            <button class="menuItem button" id="menuLogoGen">
                                <img src="images/logoGenerator/logoGen.png" alt="">AI Logo Generator
                            </button>
                            <button class="menuItem button" id="menuMyEyes">
                                <img src="images/MyEyes/MyEyes.png" alt="">MyEyes
                            </button>
                        </div>
                    `;

                    const rect = projectsBtn.getBoundingClientRect();
                    projectsSubmenu.style.position = 'absolute';
                    projectsSubmenu.style.left = (rect.right) + 'px';
                    projectsSubmenu.style.bottom = (window.innerHeight - rect.bottom) + 'px';

                    document.body.appendChild(projectsSubmenu);

                    projectsSubmenu.querySelector('#menuMoodMovie').addEventListener('click', function(e){
                        e.stopPropagation();
                        closeStartMenu();
                        openMoodMovieWindow();
                        bringWindowToFront('MoodMovieWindow', 'MoodMovieTaskbarItem');
                    });

                    projectsSubmenu.querySelector('#menuCrossyRoad').addEventListener('click', function(e){
                        e.stopPropagation();
                        closeStartMenu();
                        openCrossyRoadWindow();
                        bringWindowToFront('CrossyRoadWindow', 'CrossyRoadTaskbarItem');
                    });

                    projectsSubmenu.querySelector('#menuLogoGen').addEventListener('click', function(e){
                        e.stopPropagation();
                        closeStartMenu();
                        openLogoGenWindow();
                        bringWindowToFront('LogoGenWindow', 'LogoGenTaskbarItem');
                    });

                    projectsSubmenu.querySelector('#menuMyEyes').addEventListener('click', function(e){
                        e.stopPropagation();
                        closeStartMenu();
                        openMyEyesWindow();
                        bringWindowToFront('MyEyesWindow', 'MyEyesTaskbarItem');
                    });
                }
            });

            projectsBtn.addEventListener('mouseleave', function(){
                setTimeout(function(){
                    if(projectsSubmenu && !projectsSubmenu.matches(':hover')){
                        closeProjectsSubmenu();
                    }
                }, 100);
            });

            // Shut Down button click handler
            startMenu.querySelector('#menuShutDown').addEventListener('click', function(e){
                e.stopPropagation();
                closeStartMenu();

                if(!document.getElementById('ShutDownWindow')){
                    // Create modal overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'modalOverlay';
                    document.body.appendChild(overlay);

                    const win = document.createElement('span');
                    win.id = 'ShutDownWindow';
                    win.className = 'window shutdownWindow';

                    win.style.width = '350px';
                    win.style.height = 'auto';
                    win.style.left = '50%';
                    win.style.top = '50%';
                    win.style.transform = 'translate(-50%, -50%)';

                    win.innerHTML = `
                        <header>
                            <p>Shut Down Windows</p>
                            <close></close>
                        </header>
                        <content>
                            <div class="shutdownContent">
                                <img src="images/ShutDown.png" alt="" class="shutdownIcon">
                                <p>Are you sure you want to shut down?</p>
                            </div>
                            <div class="shutdownButtons">
                                <button class="shutdownBtn button" id="shutdownYes">Yes</button>
                                <button class="shutdownBtn button" id="shutdownNo">No</button>
                                <button class="shutdownBtn button" id="shutdownHelp">Help</button>
                            </div>
                        </content>
                    `;

                    document.body.appendChild(win);

                    function closeShutdownWindow(){
                        win.remove();
                        overlay.remove();
                    }

                    win.querySelector('close').addEventListener('click', closeShutdownWindow);

                    win.querySelector('#shutdownNo').addEventListener('click', closeShutdownWindow);

                    win.querySelector('#shutdownYes').addEventListener('click', function(){
                        closeShutdownWindow();
                        const blackScreen = document.createElement('div');
                        blackScreen.className = 'blackScreen';
                        document.body.appendChild(blackScreen);
                    });

                    // Help does nothing
                    win.querySelector('#shutdownHelp').addEventListener('click', function(){});
                }
            });

            // Settings button click handler
            startMenu.querySelector('#menuSettings').addEventListener('click', function(e){
                e.stopPropagation();
                if(!document.getElementById('SettingsWindow')){
                    const win = document.createElement('span');
                    win.id = 'SettingsWindow';
                    win.className = 'window settingsWindow';

                    win.style.width = '400px';
                    win.style.height = '550px';
                    win.style.left = '200px';
                    win.style.top = '100px';

                    win.innerHTML = `
                        <header id="windowHeader">
                            <icon><img src="images/Settings.png" alt=""></icon>
                            <p>Settings</p>
                            <close class="button"></close>
                        </header>
                        <content>
                            <div class="settingsTabs">
                                <button class="settingsTab active" data-tab="wallpaper">Wallpaper</button>
                                <button class="settingsTab" data-tab="bgicon">Background Icon</button>
                            </div>
                            <div class="settingsPanel" id="wallpaperPanel">
                                <div class="settingsPreview">
                                    <div class="previewMonitor">
                                        <div class="previewScreen" id="wallpaperPreview">
                                            <img class="previewIcon" src="images/Background.png" alt="">
                                        </div>
                                    </div>
                                </div>
                                <fieldset class="settingsFieldset">
                                    <legend>Wallpaper</legend>
                                    <p>Select a color</p>
                                    <div class="settingsList" id="wallpaperList">
                                        <div class="settingsOption selected" data-value="#01ADAD">Default (Teal)</div>
                                        <div class="settingsOption" data-value="#367dc9">Blue</div>
                                        <div class="settingsOption" data-value="#ba3434">Red</div>
                                        <div class="settingsOption" data-value="#32a852">Green</div>
                                    </div>
                                </fieldset>
                            </div>
                            <div class="settingsPanel hidden" id="bgiconPanel">
                                <div class="settingsPreview">
                                    <div class="previewMonitor">
                                        <div class="previewScreen" id="iconPreview">
                                            <img class="previewIcon" src="images/Background.png" alt="">
                                        </div>
                                    </div>
                                </div>
                                <fieldset class="settingsFieldset">
                                    <legend>Background Icon</legend>
                                    <p>Select an icon</p>
                                    <div class="settingsList" id="iconList">
                                        <div class="settingsOption selected" data-value="images/Background.png">Default</div>
                                        <div class="settingsOption" data-value="none">Text Only</div>
                                        <div class="settingsOption" data-value="logoonly">Logo Only</div>
                                        <div class="settingsOption" data-value="removeall">None</div>
                                    </div>
                                </fieldset>
                            </div>
                            <div class="settingsButtons">
                                <button class="settingsBtn button" id="settingsOK">OK</button>
                                <button class="settingsBtn button" id="settingsCancel">Cancel</button>
                                <button class="settingsBtn button" id="settingsApply">Apply</button>
                            </div>
                        </content>
                    `;

                    document.body.appendChild(win);
                    win.style.zIndex = zLevel;
                    zLevel += 1;

                    if(lastOpened){
                        lastOpened.classList.add('background');
                        const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                        if(lastTaskbarItem){
                            lastTaskbarItem.classList.remove('active');
                        }
                    }
                    lastOpened = win;

                    const taskbarItems = document.getElementById('taskbarItems');
                    const taskbarItem = document.createElement('button');
                    taskbarItem.className = 'taskbarItem active';
                    taskbarItem.id = 'SettingsTaskbarItem';
                    taskbarItem.innerHTML = '<img src="images/Settings.png" alt=""><span>Settings</span>';

                    taskbarItem.addEventListener('click', function(e){
                        e.stopPropagation();
                        if(win.classList.contains('background')){
                            if(lastOpened){
                                lastOpened.classList.add('background');
                                const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                                if(lastTaskbarItem){
                                    lastTaskbarItem.classList.remove('active');
                                }
                            }
                            win.classList.remove('background');
                            taskbarItem.classList.add('active');
                            lastOpened = win;
                            win.style.zIndex = zLevel;
                            zLevel += 1;
                        }
                    });

                    taskbarItems.appendChild(taskbarItem);

                    // Tab switching
                    win.querySelectorAll('.settingsTab').forEach(function(tab){
                        tab.addEventListener('click', function(e){
                            e.stopPropagation();
                            win.querySelectorAll('.settingsTab').forEach(t => t.classList.remove('active'));
                            tab.classList.add('active');
                            win.querySelectorAll('.settingsPanel').forEach(p => p.classList.add('hidden'));
                            document.getElementById(tab.dataset.tab === 'wallpaper' ? 'wallpaperPanel' : 'bgiconPanel').classList.remove('hidden');
                        });
                    });

                    // Initialize icon list selection based on current state
                    const backgroundImg = document.querySelector('.backgroundImg');
                    const backgroundIcon = document.getElementById('background');
                    const backgroundText = backgroundImg.querySelector('p');
                    const iconOptions = win.querySelectorAll('#iconList .settingsOption');
                    const previewIcon = win.querySelector('#iconPreview .previewIcon');

                    // Remove default selection
                    iconOptions.forEach(o => o.classList.remove('selected'));

                    // Determine current state and select appropriate option
                    if(backgroundImg.style.display === 'none'){
                        // None selected
                        win.querySelector('#iconList .settingsOption[data-value="removeall"]').classList.add('selected');
                        previewIcon.style.display = 'none';
                    } else if(backgroundIcon.style.display === 'none'){
                        // Text Only
                        win.querySelector('#iconList .settingsOption[data-value="none"]').classList.add('selected');
                        previewIcon.style.display = 'none';
                    } else if(backgroundText.style.display === 'none'){
                        // Logo Only
                        win.querySelector('#iconList .settingsOption[data-value="logoonly"]').classList.add('selected');
                        previewIcon.style.display = 'block';
                    } else {
                        // Default (both)
                        win.querySelector('#iconList .settingsOption[data-value="images/Background.png"]').classList.add('selected');
                        previewIcon.style.display = 'block';
                    }

                    // Wallpaper option selection
                    win.querySelectorAll('#wallpaperList .settingsOption').forEach(function(option){
                        option.addEventListener('click', function(e){
                            e.stopPropagation();
                            const list = option.closest('.settingsList');
                            list.querySelectorAll('.settingsOption').forEach(o => o.classList.remove('selected'));
                            option.classList.add('selected');
                            // Update preview color
                            const preview = win.querySelector('#wallpaperPreview');
                            preview.style.backgroundColor = option.dataset.value;
                        });
                    });

                    // Icon option selection
                    win.querySelectorAll('#iconList .settingsOption').forEach(function(option){
                        option.addEventListener('click', function(e){
                            e.stopPropagation();
                            const list = option.closest('.settingsList');
                            list.querySelectorAll('.settingsOption').forEach(o => o.classList.remove('selected'));
                            option.classList.add('selected');
                            // Update preview icon
                            const previewIcon = win.querySelector('#iconPreview .previewIcon');
                            if(option.dataset.value === 'removeall' || option.dataset.value === 'none'){
                                previewIcon.style.display = 'none';
                            } else if(option.dataset.value === 'logoonly'){
                                previewIcon.style.display = 'block';
                                previewIcon.src = 'images/Background.png';
                            } else {
                                previewIcon.style.display = 'block';
                                previewIcon.src = option.dataset.value;
                            }
                        });
                    });

                    // Apply button
                    win.querySelector('#settingsApply').addEventListener('click', function(e){
                        e.stopPropagation();
                        // Apply wallpaper color
                        const selectedColor = win.querySelector('#wallpaperList .settingsOption.selected');
                        if(selectedColor){
                            document.querySelector('.appGrid').style.backgroundColor = selectedColor.dataset.value;
                            document.querySelector('.blank').style.backgroundColor = selectedColor.dataset.value;
                        }
                        // Apply background icon
                        const selectedIcon = win.querySelector('#iconList .settingsOption.selected');
                        const backgroundImg = document.querySelector('.backgroundImg');
                        const backgroundIcon = document.getElementById('background');
                        const backgroundText = backgroundImg.querySelector('p');
                        if(selectedIcon){
                            if(selectedIcon.dataset.value === 'removeall'){
                                backgroundImg.style.display = 'none';
                            } else if(selectedIcon.dataset.value === 'none'){
                                backgroundImg.style.display = 'flex';
                                backgroundIcon.style.display = 'none';
                                backgroundText.style.display = 'block';
                            } else if(selectedIcon.dataset.value === 'logoonly'){
                                backgroundImg.style.display = 'flex';
                                backgroundIcon.style.display = 'block';
                                backgroundText.style.display = 'none';
                            } else {
                                backgroundImg.style.display = 'flex';
                                backgroundIcon.style.display = 'block';
                                backgroundText.style.display = 'block';
                                backgroundIcon.src = selectedIcon.dataset.value;
                            }
                        }
                    });

                    // OK button (apply and close)
                    win.querySelector('#settingsOK').addEventListener('click', function(e){
                        e.stopPropagation();
                        win.querySelector('#settingsApply').click();
                        closeBtn.click();
                    });

                    // Cancel button (close without applying)
                    win.querySelector('#settingsCancel').addEventListener('click', function(e){
                        e.stopPropagation();
                        closeBtn.click();
                    });

                    dragElement(win);

                    const closeBtn = win.querySelector('close');
                    closeBtn.addEventListener('click', function(e){
                        e.stopPropagation();
                        win.remove();
                        taskbarItem.remove();
                        if(lastOpened === win){
                            lastOpened = null;
                        }
                    });
                }

                closeStartMenu();
            });

            startButton.classList.add('pressed');
            startMenuOpen = true;
        } else {
            const menu = document.getElementById('startMenu');
            if(menu){
                menu.remove();
            }
            document.querySelectorAll('.submenu').forEach(sub => sub.remove());
            startButton.classList.remove('pressed');
            startMenuOpen = false;
        }
    });

    document.body.addEventListener('click', function(element){
        const clickedStart = element.target.closest('.start');
        const clickedStartMenu = element.target.closest('#startMenu');
        const clickedSubmenu = element.target.closest('.submenu');

        if(!clickedStart && !clickedStartMenu && !clickedSubmenu && startMenuOpen){
            const menu = document.getElementById('startMenu');
            if(menu){
                menu.remove();
            }
            document.querySelectorAll('.submenu').forEach(sub => sub.remove());
            startButton.classList.remove('pressed');
            startMenuOpen = false;
        }
    });

    function bringWindowToFront(winId, taskbarId){
        const win = document.getElementById(winId);
        if(!win || !win.classList.contains('background')) return;
        const lt = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
        if(lt) lt.classList.remove('active');
        lastOpened.classList.add('background');
        win.classList.remove('background');
        win.style.zIndex = zLevel;
        zLevel += 1;
        lastOpened = win;
        const taskbarItem = document.getElementById(taskbarId);
        if(taskbarItem) taskbarItem.classList.add('active');
    }

    function openCrossyRoadWindow(){
        if(document.getElementById('CrossyRoadWindow')) return;

        const win = document.createElement('span');
        win.id = 'CrossyRoadWindow';
        win.className = 'window';

        const maxX = Math.max(0, window.innerWidth - 750);
        const maxY = Math.max(0, window.innerHeight - 525);
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        win.style.width = '750px';
        win.style.height = '525px';
        win.style.left = randomX + 'px';
        win.style.top = randomY + 'px';

        win.innerHTML = `
            <header id="windowHeader">
                <icon><img class="appImg" src="images/CrossyRoad.png" alt="Crossy Road"></icon>
                <p>Crossy Road</p>
                <close></close>
            </header>
            <content>
                <div class="crossyRoadContainer">
                    <img class="crossyRoadImg" src="images/CrossyRoad1.png" alt="Crossy Road">
                    <div class="crossyRoadBottom">
                        <p class="crossyRoadDesc">A Crossy Road clone built with JavaScript and HTML5 Canvas. Navigate your chicken across busy roads and rivers! This was built in a hard-stop one hour challenge to see how well I could implement AI into my workflow. Although there are some features I still want to add, I'm proud of how much I could accomplish in just one hour!</p>
                        <a class="crossyRoadGithub button" href="https://github.com/RichieTran/113-HW2-CrossyRoad/" target="_blank">
                            <img src="images/GitHubLogo.png" alt="GitHub"> GH Repo
                        </a>
                    </div>
                </div>
            </content>
        `;

        document.body.appendChild(win);
        win.style.zIndex = zLevel;
        zLevel += 1;

        if(lastOpened){
            lastOpened.classList.add('background');
            const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
            if(lastTaskbarItem){
                lastTaskbarItem.classList.remove('active');
            }
        }
        lastOpened = win;

        const taskbarItems = document.getElementById('taskbarItems');
        const taskbarItem = document.createElement('button');
        taskbarItem.className = 'taskbarItem active';
        taskbarItem.id = 'CrossyRoadTaskbarItem';
        taskbarItem.innerHTML = '<img class="appImg" src="images/CrossyRoad.png" alt=""><span>Crossy Road</span>';

        taskbarItem.addEventListener('click', function(e){
            e.stopPropagation();
            if(win.classList.contains('background')){
                if(lastOpened){
                    lastOpened.classList.add('background');
                    const lt = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                    if(lt) lt.classList.remove('active');
                }
                win.classList.remove('background');
                taskbarItem.classList.add('active');
                lastOpened = win;
                win.style.zIndex = zLevel;
                zLevel += 1;
            }
        });

        taskbarItems.appendChild(taskbarItem);
        dragElement(win);

        const closeBtn = win.querySelector('close');
        closeBtn.addEventListener('click', function(e){
            e.stopPropagation();
            win.remove();
            taskbarItem.remove();
            if(lastOpened === win){
                lastOpened = null;
            }
        });
    }

    function openLogoGenWindow(){
        if(document.getElementById('LogoGenWindow')) return;

        const win = document.createElement('span');
        win.id = 'LogoGenWindow';
        win.className = 'window';

        const maxX = Math.max(0, window.innerWidth - 750);
        const maxY = Math.max(0, window.innerHeight - 525);
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        win.style.width = '750px';
        win.style.height = '525px';
        win.style.left = randomX + 'px';
        win.style.top = randomY + 'px';

        win.innerHTML = `
            <header id="windowHeader">
                <icon><img class="appImg" src="images/logoGenerator/logoGen.png" alt="AI Logo Generator"></icon>
                <p>AI Logo Generator</p>
                <close></close>
            </header>
            <content>
                <div class="projectContainer">
                    <p class="projectDesc">I wanted to build a tool that leveraged a LLM in order to learn how to use AI APIs. To get started with using Claude API, I eventually decided to build a logo generator that uses Claude's Sonnet model to parse a transcript from a conversation or meeting where a user describes what kind of company they are trying to build/start. Then I used Claude's Opus model to generate a few logos with a description and reasoning behind it. Spoiler warning, if you ever want to generate logos, Claude's models are probably not the best LLMs to use! Some pictures below along with my repository for you to check out!</p>
                    <img class="projectImg" src="images/logoGenerator/logoGen1.png" alt="AI Logo Generator Screenshot 1">
                    <p class="projectDesc">This is the landing page for my site. I was going for a clean and minimalist design. Here you could either type in your company's description or upload a transcript. Once you uploaded, it would call Claude Sonnet to parse and analyze your data.</p>
                    <img class="projectImg" src="images/logoGenerator/logoGen2.png" alt="AI Logo Generator Screenshot 2">
                    <p class="projectDesc">Once the data was parsed by Sonnet, it was displayed here in a popup. You could alter, delete, or add new data in any of the sections (the picture doesn't show all the datapoints that were analyzed). Then once you felt good about the data that we get, you can generate a few logos.</p>
                    <img class="projectImg" src="images/logoGenerator/logoGen3.png" alt="AI Logo Generator Screenshot 3">
                    <div class="projectBottom">
                        <p class="projectDesc">Once the logos were generated, there would be another popup that displayed around 5 to 7 logos of varying types (wordmark, pictorial, abstract, etc.) with a description and reasoning. As you can see above, some of the logos were rudimentary at best. There are definitely a few changes I can make, but for a quick day project to learn some new skills, I would say the output is better than I imagined.\n\nUpdate: I switched the image generation model to Opus 4.6, and the logo generation and descriptions were much better. Although I still don't think it is usable for an actual businesses, it is a step toward the final goal!</p>
                        <a class="projectGithub button" href="https://github.com/RichieTran/logoGenerator" target="_blank">
                            <img src="images/GitHubLogo.png" alt="GitHub"> GH Repo
                        </a>
                    </div>
                </div>
            </content>
        `;

        document.body.appendChild(win);
        win.style.zIndex = zLevel;
        zLevel += 1;

        if(lastOpened){
            lastOpened.classList.add('background');
            const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
            if(lastTaskbarItem){
                lastTaskbarItem.classList.remove('active');
            }
        }
        lastOpened = win;

        const taskbarItems = document.getElementById('taskbarItems');
        const taskbarItem = document.createElement('button');
        taskbarItem.className = 'taskbarItem active';
        taskbarItem.id = 'LogoGenTaskbarItem';
        taskbarItem.innerHTML = '<img class="appImg" src="images/logoGenerator/logoGen.png" alt=""><span>AI Logo Generator</span>';

        taskbarItem.addEventListener('click', function(e){
            e.stopPropagation();
            if(win.classList.contains('background')){
                if(lastOpened){
                    lastOpened.classList.add('background');
                    const lt = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                    if(lt) lt.classList.remove('active');
                }
                win.classList.remove('background');
                taskbarItem.classList.add('active');
                lastOpened = win;
                win.style.zIndex = zLevel;
                zLevel += 1;
            }
        });

        taskbarItems.appendChild(taskbarItem);
        dragElement(win);

        const closeBtn = win.querySelector('close');
        closeBtn.addEventListener('click', function(e){
            e.stopPropagation();
            win.remove();
            taskbarItem.remove();
            if(lastOpened === win){
                lastOpened = null;
            }
        });
    }

    function openMyEyesWindow(){
        if(document.getElementById('MyEyesWindow')) return;

        const win = document.createElement('span');
        win.id = 'MyEyesWindow';
        win.className = 'window';

        const maxX = Math.max(0, window.innerWidth - 750);
        const maxY = Math.max(0, window.innerHeight - 525);
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        win.style.width = '750px';
        win.style.height = '525px';
        win.style.left = randomX + 'px';
        win.style.top = randomY + 'px';

        win.innerHTML = `
            <header id="windowHeader">
                <icon><img class="appImg" src="images/MyEyes/MyEyes.png" alt="MyEyes"></icon>
                <p>MyEyes</p>
                <close></close>
            </header>
            <content>
                <div class="projectContainer">
                    <p class="projectDesc">A "virtual walking stick" iOS app that assists visually impaired users with navigating everyday life. I created this for Tartan Hacks with a few of my friends, and we used Swift, Python/Flask, and YoloV8 via CoreML.</p>
                    <img class="projectImg" src="images/MyEyes/MyEyes1.png" alt="MyEyes Screenshot 1">
                    <p class="projectDesc">We created a custom urgency-weighted loss function, which assigned higher danger values to different objects (closer and more dangerous). This helped us choose which obstacles the app alert the user of.</p>
                    <img class="projectImg" src="images/MyEyes/MyEyes3.jpeg" alt="MyEyes Screenshot 3">
                    <img class="projectImg" src="images/MyEyes/MyEyes2.jpeg" alt="MyEyes Screenshot 2">
                    <p class="projectDesc">MyEyes used AVSpeechSynthesizer to tell users the obstacles that were selected from our weighted loss function. Though in everyday life, there are sometimes hazards that are unpredictable, but dangerous nonetheless; for example, a person turning a corner or a car stopping on a crosswalk, we wanted our app to be able to alert users of these obstacles too! So we used the Lidar sensor on iPhones to play an alarm noise once there was an object within a few feet of the sensor, allowing for our users' safety in unpredictable circumstances.</p>
                    <img class="projectImg" src="images/MyEyes/MyEyes4.jpg" alt="MyEyes Screenshot 4">
                    <div class="projectBottom">
                        <p class="projectDesc">MyEyes was so fun to create, learning new tools and building something that can actually help others reinforced my passion for creating accessible tech.</p>
                        <a class="projectGithub button" href="https://github.com/alberttluo/myEyes" target="_blank">
                            <img src="images/GitHubLogo.png" alt="GitHub"> GH Repo
                        </a>
                    </div>
                </div>
            </content>
        `;

        document.body.appendChild(win);
        win.style.zIndex = zLevel;
        zLevel += 1;

        if(lastOpened){
            lastOpened.classList.add('background');
            const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
            if(lastTaskbarItem){
                lastTaskbarItem.classList.remove('active');
            }
        }
        lastOpened = win;

        const taskbarItems = document.getElementById('taskbarItems');
        const taskbarItem = document.createElement('button');
        taskbarItem.className = 'taskbarItem active';
        taskbarItem.id = 'MyEyesTaskbarItem';
        taskbarItem.innerHTML = '<img class="appImg" src="images/MyEyes/MyEyes.png" alt=""><span>MyEyes</span>';

        taskbarItem.addEventListener('click', function(e){
            e.stopPropagation();
            if(win.classList.contains('background')){
                if(lastOpened){
                    lastOpened.classList.add('background');
                    const lt = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                    if(lt) lt.classList.remove('active');
                }
                win.classList.remove('background');
                taskbarItem.classList.add('active');
                lastOpened = win;
                win.style.zIndex = zLevel;
                zLevel += 1;
            }
        });

        taskbarItems.appendChild(taskbarItem);
        dragElement(win);

        const closeBtn = win.querySelector('close');
        closeBtn.addEventListener('click', function(e){
            e.stopPropagation();
            win.remove();
            taskbarItem.remove();
            if(lastOpened === win){
                lastOpened = null;
            }
        });
    }

    function openMoodMovieWindow(){
        if(document.getElementById('MoodMovieWindow')) return;

        const win = document.createElement('span');
        win.id = 'MoodMovieWindow';
        win.className = 'window';

        const maxX = Math.max(0, window.innerWidth - 750);
        const maxY = Math.max(0, window.innerHeight - 525);
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        win.style.width = '750px';
        win.style.height = '525px';
        win.style.left = randomX + 'px';
        win.style.top = randomY + 'px';

        win.innerHTML = `
            <header id="windowHeader">
                <icon><img class="appImg" src="images/MoodMovie/moodMovie.png" alt="MoodMovie"></icon>
                <p>MoodMovie</p>
                <close></close>
            </header>
            <content>
                <div class="projectContainer">
                    <p class="projectDesc">I wanted to explore using APIs more and I like watching movies, so that led me to create a small website for myself to find movies to watch. MoodMovies is a mood-based movie recommendation system, a Python web application that recommends movies based on your mood, preferences, and similar movies using TMDB and OMDb APIs. Features include movie recommendations based on mood, recommendations based on preferences (genre, year, etc.), similar movie recommendations, and detailed movie information from both TMDB and OMDb. (Note TMDB is user ran, so many of the movies under the feelings sections are very unknown fan-made or indie movies with little-to no ratings.</p>
                    <img class="projectImg" src="images/MoodMovie/moodMovie1.png" alt="MoodMovie Screenshot">
                    <div class="projectBottom">
                        <p class="projectDesc">Check out the live site: <a href="https://mood-movies-ebon.vercel.app/" target="_blank">here</a>!</p>
                        <a class="projectGithub button" href="https://github.com/RichieTran/MoodMovies" target="_blank">
                            <img src="images/GitHubLogo.png" alt="GitHub"> GH Repo
                        </a>
                    </div>
                </div>
            </content>
        `;

        document.body.appendChild(win);
        win.style.zIndex = zLevel;
        zLevel += 1;

        if(lastOpened){
            lastOpened.classList.add('background');
            const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
            if(lastTaskbarItem){
                lastTaskbarItem.classList.remove('active');
            }
        }
        lastOpened = win;

        const taskbarItems = document.getElementById('taskbarItems');
        const taskbarItem = document.createElement('button');
        taskbarItem.className = 'taskbarItem active';
        taskbarItem.id = 'MoodMovieTaskbarItem';
        taskbarItem.innerHTML = '<img class="appImg" src="images/MoodMovie/moodMovie.png" alt=""><span>MoodMovie</span>';

        taskbarItem.addEventListener('click', function(e){
            e.stopPropagation();
            if(win.classList.contains('background')){
                if(lastOpened){
                    lastOpened.classList.add('background');
                    const lt = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                    if(lt) lt.classList.remove('active');
                }
                win.classList.remove('background');
                taskbarItem.classList.add('active');
                lastOpened = win;
                win.style.zIndex = zLevel;
                zLevel += 1;
            }
        });

        taskbarItems.appendChild(taskbarItem);
        dragElement(win);

        const closeBtn = win.querySelector('close');
        closeBtn.addEventListener('click', function(e){
            e.stopPropagation();
            win.remove();
            taskbarItem.remove();
            if(lastOpened === win){
                lastOpened = null;
            }
        });
    }

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
        const clickedStart = element.target.closest('.start');
        const clickedStartMenu = element.target.closest('#startMenu');

        if(!clickedStart && !clickedStartMenu && startMenuOpen){
            const menu = document.getElementById('startMenu');
            if(menu){
                menu.remove();
            }
            startButton.classList.remove('pressed');
            startMenuOpen = false;
        }
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

                win.innerHTML = `
                    <header id="windowHeader">
                        <icon>${document.getElementById(app.id + "Img").outerHTML}</icon>
                        <p>${app.id}</p>
                        <close></close>
                    </header>
                    <content></content>
                `;

                if(app.id === "About Me"){
                    win.style.width = '400px';
                    win.style.height = '550px'
                    const content = win.querySelector('content');
                    content.innerHTML = `
                        <img id="Richie" src="images/Richie.jpg" alt="Richie">
                        <p id="RichieDescription">
                            Hi, I'm Richie! I'm currently an undergrad at Carnegie Mellon University
                            studying computer science with a concentration in machine learning. I'm
                            passionate about building technology that makes a real difference, especially
                            tools that improve accessibility and serve communities.
                            <br><br>
                            I like working on everything from frontend and mobile to backend and systems. Feel free to reach out!
                        </p>
                    `;
                }

                if(app.id === "Projects"){
                    win.classList.add('explorerWindow');
                    const content = win.querySelector('content');
                    content.innerHTML = `
                        <div class="explorerMenuBar">
                            <span class="explorerMenuItem"><u>F</u>ile</span>
                            <span class="explorerMenuItem"><u>E</u>dit</span>
                            <span class="explorerMenuItem"><u>V</u>iew</span>
                            <span class="explorerMenuItem"><u>H</u>elp</span>
                        </div>
                        <div class="explorerContent">
                            <span class="explorerItem" id="MyEyesItem">
                                <img src="images/MyEyes/MyEyes.png" alt="MyEyes">
                                <p>MyEyes</p>
                            </span>
                            <span class="explorerItem" id="LogoGenItem">
                                <img src="images/logoGenerator/logoGen.png" alt="AI Logo Generator">
                                <p>AI Logo Generator</p>
                            </span>
                            <span class="explorerItem" id="MoodMovieItem">
                                <img src="images/MoodMovie/moodMovie.png" alt="MoodMovie">
                                <p>MoodMovie</p>
                            </span>
                            <span class="explorerItem" id="CrossyRoadItem">
                                <img src="images/CrossyRoad.png" alt="Crossy Road">
                                <p>Crossy Road</p>
                            </span>
                        </div>
                        <div class="explorerStatusBar">
                            <span class="statusLeft">4 object(s)</span>
                            <span class="statusRight"></span>
                        </div>
                    `;

                    let explorerLastClicked = null;
                    content.querySelector('.explorerContent').addEventListener('click', function(e){
                        const item = e.target.closest('.explorerItem');
                        if(item){
                            e.stopPropagation();
                            if(explorerLastClicked){
                                explorerLastClicked.classList.remove('selected');
                            }
                            item.classList.add('selected');
                            explorerLastClicked = item;
                        } else if(explorerLastClicked){
                            explorerLastClicked.classList.remove('selected');
                            explorerLastClicked = null;
                        }
                    });

                    content.querySelector('.explorerContent').addEventListener('dblclick', function(e){
                        const item = e.target.closest('.explorerItem');
                        if(item && item.id === 'CrossyRoadItem'){
                            e.stopPropagation();
                            openCrossyRoadWindow();
                            bringWindowToFront('CrossyRoadWindow', 'CrossyRoadTaskbarItem');
                        }
                        if(item && item.id === 'LogoGenItem'){
                            e.stopPropagation();
                            openLogoGenWindow();
                            bringWindowToFront('LogoGenWindow', 'LogoGenTaskbarItem');
                        }
                        if(item && item.id === 'MyEyesItem'){
                            e.stopPropagation();
                            openMyEyesWindow();
                            bringWindowToFront('MyEyesWindow', 'MyEyesTaskbarItem');
                        }
                        if(item && item.id === 'MoodMovieItem'){
                            e.stopPropagation();
                            openMoodMovieWindow();
                            bringWindowToFront('MoodMovieWindow', 'MoodMovieTaskbarItem');
                        }
                    });
                }

                if(app.id === "Socials"){
                    const content = win.querySelector('content');
                    content.innerHTML = `
                        <button class="socialBtn button" id="github"></button>
                        <p id="githubDesc">Click the button to go to my GitHub or find me by my username RichieTran!</p>
                        <button class="socialBtn button" id="linkedin"></button>
                        <p id="linkedInDesc">Click the button to go to my Linked In or find me by my username richiettran!</p>
                        <button class="socialBtn button" id="email"></button>
                        <p id="emailDesc">Click the button to email me or find me by my email richietran2024@gmail.com!</p>
                    `;
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
                    content.innerHTML = `
                        <div class="resumeContainer">
                            <button class="resumeBtn button" id="downloadBtn">Download</button>
                            <button class="resumeBtn button" id="newTabBtn">New Tab</button>
                            <iframe src="images/Resume.pdf#toolbar=0" height="440" width="775" title="resume"></iframe>
                        </div>
                    `;

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

                if(app.id === "Email Me!"){
                    const content = win.querySelector('content');

                    function setupEmailForm(){
                        content.innerHTML = `
                            <form id="emailForm" action="https://formsubmit.co/473818481a1ac32069eefe408f4df23e" method="POST">
                                <input type="text" name="_honey" style="display: none;">
                                <input type="hidden" name="_captcha" value="false">
                                <div class="formRow">
                                    <div class="formGroup">
                                        <label for="senderName">Name:</label>
                                        <input type="text" id="senderName" name="name" placeholder="John Doe" required>
                                    </div>
                                    <div class="formGroup">
                                        <label for="senderEmail">Email:</label>
                                        <input type="email" id="senderEmail" name="email" placeholder="johndoe123@gmail.com" required>
                                    </div>
                                </div>
                                <div class="formGroup">
                                    <label for="message">Message:</label>
                                    <textarea id="message" name="message" placeholder="Your message here!" rows="21" required></textarea>
                                </div>
                                <button type="submit" class="sendBtn button">Send</button>
                                <p class="formStatus"></p>
                            </form>
                        `;

                        const form = content.querySelector('#emailForm');
                        const statusMsg = content.querySelector('.formStatus');

                        form.addEventListener('submit', function(e){
                            e.preventDefault();
                            e.stopPropagation();

                            const formData = new FormData(form);

                            fetch(form.action, {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    'Accept': 'application/json'
                                }
                            })
                            .then(response => {
                                if(response.ok){
                                    content.innerHTML = `
                                        <div class="successContainer">
                                            <p style="color:green;">Successfully sent message! I will get back to you as soon as possible!</p>
                                            <button class="resetBtn button">Send Another</button>
                                        </div>
                                    `;

                                    const resetBtn = content.querySelector('.resetBtn');
                                    resetBtn.addEventListener('click', function(e){
                                        e.stopPropagation();
                                        setupEmailForm();
                                    });
                                } else {
                                    content.innerHTML = `
                                        <div class="successContainer">
                                            <p style="color:red;">Error sending message. Please try again.</p>
                                            <button class="resetBtn button">Send Another</button>
                                        </div>
                                    `;

                                    const resetBtn = content.querySelector('.resetBtn');
                                    resetBtn.addEventListener('click', function(e){
                                        e.stopPropagation();
                                        setupEmailForm();
                                    });
                                }
                            })
                            .catch(() => {
                                content.innerHTML = `
                                    <div class="successContainer">
                                        <p style="color:red;">Error sending message. Please try again.</p>
                                        <button class="resetBtn button">Send Another</button>
                                    </div>
                                `;

                                const resetBtn = content.querySelector('.resetBtn');
                                resetBtn.addEventListener('click', function(e){
                                    e.stopPropagation();
                                    setupEmailForm();
                                });
                            });
                        });
                    }

                    setupEmailForm();
                }


                document.body.appendChild(win);
                app.classList.add('opened');
                win.style.zIndex = zLevel;
                zLevel += 1;

                if (lastOpened){
                    lastOpened.classList.add('background');
                    const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                    if(lastTaskbarItem){
                        lastTaskbarItem.classList.remove('active');
                    }
                }
                lastOpened = win;

                // Create taskbar item
                const taskbarItems = document.getElementById('taskbarItems');
                const taskbarItem = document.createElement('button');
                taskbarItem.className = 'taskbarItem active';
                taskbarItem.id = app.id + 'TaskbarItem';
                taskbarItem.innerHTML = document.getElementById(app.id + "Img").outerHTML + '<span>' + app.id + '</span>';

                taskbarItem.addEventListener('click', function(e){
                    e.stopPropagation();
                    if(win.classList.contains('background')){
                        if(lastOpened){
                            lastOpened.classList.add('background');
                            const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                            if(lastTaskbarItem){
                                lastTaskbarItem.classList.remove('active');
                            }
                        }
                        win.classList.remove('background');
                        taskbarItem.classList.add('active');
                        lastOpened = win;
                        win.style.zIndex = zLevel;
                        zLevel += 1;
                    }
                });

                taskbarItems.appendChild(taskbarItem);

                dragElement(win);

                const closeBtn = win.querySelector('close');
                closeBtn.addEventListener('click', function(e){
                    e.stopPropagation();
                    win.remove();
                    app.classList.remove('opened');
                    taskbarItem.remove();
                    if(lastOpened === win){
                        lastOpened = null;
                    }
                });
            }
            else if(document.getElementById(app.id + "Window").classList.contains('background')){
                bringWindowToFront(app.id + "Window", app.id + 'TaskbarItem');
            }
        }
    });

    document.body.addEventListener('click', function(element){
        const clickedWindow = element.target.closest('.window');
        if(clickedWindow && clickedWindow !== lastOpened){
            if(lastOpened){
                lastOpened.classList.add('background');
                const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                if(lastTaskbarItem){
                    lastTaskbarItem.classList.remove('active');
                }
            }
            clickedWindow.classList.remove('background');
            lastOpened = clickedWindow;
            clickedWindow.style.zIndex = zLevel;
            zLevel += 1;
            const taskbarItem = document.getElementById(clickedWindow.id.replace('Window', 'TaskbarItem'));
            if(taskbarItem){
                taskbarItem.classList.add('active');
            }
        }
    });

    document.body.addEventListener('mousedown', function(element){
        const window = element.target.closest('.window');
        if(window && window.classList.contains('background')){
            const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
            if(lastTaskbarItem){
                lastTaskbarItem.classList.remove('active');
            }
            lastOpened.classList.add('background');
            window.classList.remove('background');
            lastOpened = window;
            window.style.zIndex = zLevel;
            zLevel += 1;
            const taskbarItem = document.getElementById(window.id.replace('Window', 'TaskbarItem'));
            if(taskbarItem){
                taskbarItem.classList.add('active');
            }
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
