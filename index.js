window.electronAPI.onUpdateAvailable((_event, info) => {
    document.getElementById('updater').style.display = 'block';
    document.getElementById('updater-text').style.color = '#BCDEFC';
    document.getElementById('updater-info').style.color = '#90979D';

    document.getElementById('updater-text').innerHTML = 'Update available';
    document.getElementById('updater-info').innerHTML = `${info.version} released at ${info.releaseDate}`;
})
window.electronAPI.onUpdateNotAvailable((_event) => {
    document.getElementById('updater').style.display = 'none';
    console.log("FIXE");
    $("#updater").fadeOut();
    $('#intro-video').show();
    $('#intro-video').get(0).play();
    $('#background').fadeOut();
})
window.electronAPI.onDownloadProgress((_event, progress) => {
    document.getElementById('updater-text').innerHTML = 'Downloading update';
    document.getElementById('updater-info').innerHTML = `${Math.floor(progress.percent)}%`;
})
window.electronAPI.onUpdateDownloaded((_event) => {
    document.getElementById('updater-text').innerHTML = 'Update downloaded';
    document.getElementById('updater-info').innerHTML = "Restarting...";
})
window.electronAPI.onError((_event, error) => {
    console.error(error);
    document.getElementById('updater').style.display = 'block';
    document.getElementById('updater-text').style.color = '#f1535a';
    document.getElementById('updater-info').style.color = '#946f71';

    document.getElementById('updater-text').innerHTML = 'An error has occurred';
    document.getElementById('updater-info').innerHTML = 'Your app could not be updated';

    setTimeout(() => {
        $("#updater").fadeOut();
        $('#intro-video').show();
        $('#intro-video').get(0).play();
        $('#background').fadeOut();
    }, 2500);

})



var currentPath = {};
var previousPath = {};

function callbackFunc(){
    console.log("foydsf")
    var id = $(this).attr("id");
    console.log(Object.keys(currentPath[id]));
    previousPath = currentPath;
    currentPath = currentPath[id];
    console.log(currentPath)
    $("#grid-container").empty();
    cardsFromObject(Object.keys(currentPath));
}

function cardsFromObject(keys) {
    for(var item of keys){
        $("#grid-container").append(`
            <div class="card" id="${item}"
            data-tilt data-tilt-glare data-tilt-max-glare="0.1" data-tilt-max="10" data-tilt-speed="1000">
                <div class="content">
                    <img class="icon" src="https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg">
                    <h1>${item.charAt(0).toUpperCase() + item.slice(1)}</h1>
                    <p>Descrição</p>
                </div>
                <div class="background">
                    <div class="darkner"></div>
                    <img class="background" src="https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg">
                </div>
            </div>
        `);
    }
    $(".card").mouseenter(function(){
        $(this).find(".background").css("opacity", "1.0");
    }).mouseleave(function(){
        $(this).find(".background").css("opacity", "0.0");
    })
    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 10,
        speed: 100,
        glare: false
    });
    $(".card").click(callbackFunc)
}

$(document).ready(function() {
    var appVersion = window.electronAPI.getVersion();
    var isDev = window.electronAPI.isDev();
    if(!isDev){
        $("#updater").fadeOut();
        $('#intro-video').show();
        $('#intro-video').get(0).play();
        $('#background').fadeOut();
    } else {
        $('#intro-video').hide();
        $('#content').show();
        $('#background').hide();
    }
    
    document.getElementById("appVersion").innerHTML = appVersion;

    $('#intro-video').on('ended', function() {
        $('#intro-video').hide();
        $('#content').fadeIn();
        $('#background').fadeOut();
    })
    $("#closeBtn").click(function() {
        window.electronAPI.closeApp();
    })

    function update() {
        window.electronAPI.checkForUpdates();
    }

    var items = window.electronAPI.getItems();
    currentPath = items
    var keys = Object.keys(currentPath);
    cardsFromObject(keys);
    $(".card").click(callbackFunc)
})