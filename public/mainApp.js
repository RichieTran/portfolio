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

            // Used Claude to create an event listener for resume button on the start menu
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

            // Used Claude to create submenu for projects start menu button
            projectsBtn.addEventListener('mouseenter', function(){
                if(!projectsSubmenu){
                    projectsSubmenu = document.createElement('div');
                    projectsSubmenu.className = 'submenu';
                    projectsSubmenu.innerHTML = `<div class="submenuContent"></div>`;

                    const rect = projectsBtn.getBoundingClientRect();
                    projectsSubmenu.style.position = 'absolute';
                    projectsSubmenu.style.left = (rect.right) + 'px';
                    projectsSubmenu.style.bottom = (window.innerHeight - rect.bottom) + 'px';

                    document.body.appendChild(projectsSubmenu);
                }
            });

            projectsBtn.addEventListener('mouseleave', function(){
                setTimeout(function(){
                    if(projectsSubmenu && !projectsSubmenu.matches(':hover')){
                        closeProjectsSubmenu();
                    }
                }, 100);
            });

            // Shut Down button click handler, used Claude for basic HTML
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

            // Settings button click handler, styling made with Claude, first color and no logo template from Claude
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
                                        <div class="settingsOption" data-value="none">None (keep text)</div>
                                        <div class="settingsOption" data-value="removeall">Remove All</div>
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
                        <div class="explorerContent"></div>
                        <div class="explorerStatusBar">
                            <span class="statusLeft">0 object(s)</span>
                            <span class="statusRight"></span>
                        </div>
                    `;
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
                const win = document.getElementById(app.id + "Window");
                const lastTaskbarItem = document.getElementById(lastOpened.id.replace('Window', 'TaskbarItem'));
                if(lastTaskbarItem){
                    lastTaskbarItem.classList.remove('active');
                }
                lastOpened.classList.add('background');
                win.classList.remove('background');
                win.style.zIndex = zLevel;
                zLevel += 1;
                lastOpened = win;
                const taskbarItem = document.getElementById(app.id + 'TaskbarItem');
                if(taskbarItem){
                    taskbarItem.classList.add('active');
                }
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
