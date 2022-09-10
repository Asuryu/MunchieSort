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


var currentPath = {}
var previousPath = {}

function onCardClick() {
    var id = $(this).attr('id');
    previousPath = currentPath
    currentPath = currentPath[id]["items"]
    $("#grid-container").empty();
    console.log(currentPath);
    cardsFromObject(currentPath)
}

function cardsFromObject(currentPath){
    console.log(currentPath.length);
    for(var i = 0; i < currentPath.length; i++){
        if(currentPath[i].name != undefined){
            var itemHtml = `
                <div class="card" id="${i}">
                    <div class="content">
                        <img class="icon" src="https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg">
                        <h1>${currentPath[i].name}</h1>
                        <p>Descrição</p>
                    </div>
                    <div class="background">
                        <div class="darkner"></div>
                        <img class="background" src="https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg">
                    </div>
                </div>
            `;
            $("#grid-container").append(itemHtml);
        }else{  
            var itemHtml = `
                <div class="card" id="${i}">
                    <div class="content">
                        <img class="icon" src="${currentPath[i].imagem}">
                        <a href="${currentPath[i].link}"><h1>${currentPath[i].descricao}</h1></a>
                        <p>${currentPath[i].marca}</p>
                    </div>
                    <div class="background">
                        <div class="darkner"></div>
                        <img class="background" src="${currentPath[i].imagem}">
                    </div>
                </div>
            `;
            $("#grid-container").append(itemHtml);
        }
    }
    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 11,
        speed: 800,
        glare: false
    });
    $(".card").mouseenter(function(){
        $(this).find(".background").css("opacity", "1.0");
    }).mouseleave(function(){
        $(this).find(".background").css("opacity", "0.0");
    });
    $(".card").click(onCardClick);
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

    var data = window.electronAPI.getItems();
    currentPath = data.items;
    console.log(currentPath.length)
    for(var i = 0; i < currentPath.length; i++){
        var itemHtml = `
            <div class="card" id="${i}">
                <div class="content">
                    <img class="icon" src="https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg">
                    <h1>${currentPath[i].name}</h1>
                    <p>Descrição</p>
                </div>
                <div class="background">
                    <div class="darkner"></div>
                    <img class="background" src="https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg">
                </div>
            </div>
        `;
        $("#grid-container").append(itemHtml);
    }
    $(".card").mouseenter(function(){
        $(this).find(".background").css("opacity", "1.0");
    }).mouseleave(function(){
        $(this).find(".background").css("opacity", "0.0");
    });
    $(".card").click(onCardClick);
})