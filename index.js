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
var currentPathName = "Página Principal"

function onCardClick() {
    var id = $(this).attr('id');
    previousPath = currentPath
    console.log(currentPath[id].name);
    currentPathName += ", " + currentPath[id].name;
    $(".back p").text(currentPathName);
    currentPath = currentPath[id]["items"]
    $("#grid-container").empty();
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
            $("#grid-container").css('grid-template-columns', "1fr 1fr 1fr 1fr");
            $("#grid-container").css('grid-template-rows', "");
            $("#random").hide();
        }else{  
            var itemHtml = `
                <div class="productCard">
                    <img src="${currentPath[i].imagem}">
                    <div class="productInfo">
                        <p class="productBrand">${currentPath[i].marca}</p>
                        <h1 class="productName">${currentPath[i].descricao}</h1>
                        <p class="productPricePerQuantity">${currentPath[i].precoPorQuantidade + "(" + currentPath[i].quantidade + ")"}</p>
                        <div class="productPrice">
                            <p>${currentPath[i].preco}</p>
                        </div>
                    </div>
                    <div class="link" href="${currentPath[i].link}">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </div>
                </div>
            `;
            $("#grid-container").append(itemHtml);
            $("#grid-container").css('grid-template-columns', "1fr 1fr 1fr");
            $("#grid-container").css('grid-template-rows', `repeat(${currentPath.length / 3}, 1fr)`);
            $("#random").show();
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
    $(".productCard .link").click(function(){
        console.log($(this).attr("href"));
        window.electronAPI.openExternal($(this).attr("href"));
    });
    $(".productCard").mouseenter(function(){
        $(this).find(".link").show()
    }).mouseleave(function(){
        $(this).find(".link").hide()
    });
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

    document.getElementById('updater').style.display = 'block';
    document.getElementById('updater-text').style.color = '#BCDEFC';
    document.getElementById('updater-info').style.color = '#90979D';
    
    document.getElementById('updater-text').innerHTML = 'Loading data...';
    document.getElementById('updater-info').innerHTML = 'Wait while we fetch the data';
    $.ajax({
        url: "http://161.230.150.166:5000/api/v1/resources/items",
        type: "GET",
        timeout: 5000,
        success: function(data) {
            document.getElementById('updater').style.display = 'none';
            currentPath = data.items;
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
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if(textStatus == "timeout") {
                document.getElementById('updater').style.display = 'block';
                document.getElementById('updater-text').style.color = '#f1535a';
                document.getElementById('updater-info').style.color = '#946f71';
            
                document.getElementById('updater-text').innerHTML = "Timeout";
                document.getElementById('updater-info').innerHTML = 'Couldn\'t connect to the server';
            }
            else if(jqXHR.status == 404){
                document.getElementById('updater').style.display = 'block';
                document.getElementById('updater-text').style.color = '#f1535a';
                document.getElementById('updater-info').style.color = '#946f71';
            
                document.getElementById('updater-text').innerHTML = 'Error 404';
                document.getElementById('updater-info').innerHTML = 'Couldn\'t find what you\'re looking for';
            }
        }
    });
    $("#back").click(function() {
        currentPath = previousPath
        currentPathName = currentPathName.split(", ").slice(0, -1).join(", ");
        $(".back p").text(currentPathName);
        $("#grid-container").empty();
        cardsFromObject(currentPath)
    })
    $("#random").click(function() {
        var nrItems = currentPath.length;
        var randomNumber = Math.floor(Math.random() * nrItems);
        var itemNode = $("#grid-container").children()[randomNumber];
        itemNode.scrollIntoView({
            behavior: "smooth", // or "auto" or "instant"
            block: "center" // or "end"
        });
        $(itemNode).css({
            "background-color": "rgb(146, 192, 98, 0.2)"
        })
        setTimeout(function() {
            $(itemNode).css({
                "background-color": "#1b1b1b"
            })
        }, 2000);
    })
    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if(scroll > 28){
            $("navbar").css({
                "box-shadow": "0px 3px 15px -1px #000000"
            })
        } else {
            $("navbar").css({
                "box-shadow": "none"
            })
        }
    });
})

// IDEA: Make list of dictionaries for each path