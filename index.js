window.electronAPI.onUpdateAvailable((_event, info) => {
    document.getElementById('updater').style.display = 'block';
    document.getElementById('updater-text').style.color = '#BCDEFC';
    document.getElementById('updater-info').style.color = '#90979D';

    document.getElementById('updater-text').innerHTML = 'Update available';
    document.getElementById('updater-info').innerHTML = `${info.version} released at ${info.releaseDate}`;
})
window.electronAPI.onUpdateNotAvailable((_event) => {
    document.getElementById('updater').style.display = 'none';
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

const separator = "ㅤ•ㅤ"
var randomEnabled = false
var qrCodeGenerated = false
var bag = []
var itemsOnBag = 0;
var mainPath;
var currentPath;
var path = []
var currentPathName = "Página Principal"
var hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

function addItemToBag(item, itemID){
    if(!bag.includes(item)){
        bag.push(item)
        itemsOnBag++;
        $("#bag-badge-text").text(itemsOnBag);
        var itemHtml = `
            <div id="${itemsOnBag}" productID=${itemID} class="bagItem">
                <img src="${item.imagem}">
                <div class="productInfo">
                    <p class="productBrand">${item.marca}</p>
                    <h1 class="productName">${item.descricao}</h1>
                    <p class="productPricePerQuantity">${item.precoPorQuantidade + " (" + item.quantidade + ")"}</p>
                    <div class="productPrice">
                        <p>${item.preco}</p>
                    </div>
                </div>
                <i class="fa-solid fa-trash trash"></i>
            </div>
        `;
        $("#bag-contents .items").append(itemHtml)
        $("#bag-contents .subtitle").text(bag.length + " items")
    }
    var itemPreco = item.preco.split("€")[0].replace(",", ".");
    var itemPrecoFloat = parseFloat(itemPreco);
    var totalPreco = parseFloat($("#bag-contents .total").text().split("€")[0].replace(",", "."));
    var totalPrecoFloat = totalPreco + itemPrecoFloat;
    $("#bag-contents .total").text(totalPrecoFloat.toFixed(2).replace(".", ","))

    $("#bag-contents .items .bagItem .trash").unbind();
    $("#bag-contents .items .bagItem .trash").click(function(){
        var item = bag[$(this).parent().attr("id")-1];
        var itemID = $(this).parent().attr("productID");
        $(".productCard#" + itemID).find("#addToBag").removeClass("onbag");
        $(".productCard#" + itemID).find("#addToBag").hide()
        removeItemFromBag(item)
    });
    if(itemsOnBag <= 0){
        $("#bag-badge").hide();
    } else $("#bag-badge").show();
}

function removeItemFromBag(item){
    if(bag.indexOf(item) > -1){
        $("#bag-contents .items").children().eq(bag.indexOf(item)).remove();

        // subtract from .total
        var itemPreco = item.preco.split("€")[0].replace(",", ".");
        var itemPrecoFloat = parseFloat(itemPreco);
        var totalPreco = parseFloat($("#bag-contents .total").text().split("€")[0].replace(",", "."));
        var totalPrecoFloat = totalPreco - itemPrecoFloat;
        $("#bag-contents .total").text(totalPrecoFloat.toFixed(2).replace(".", ","))

        bag.splice(bag.indexOf(item), 1);
        itemsOnBag--;
        $("#bag-badge-text").text(itemsOnBag);
        $("#bag-contents .subtitle").text(bag.length + " items")
        for(var i = 0; i < bag.length; i++){
            $("#bag-contents .items").children().eq(i).attr("id", i+1);
        }
    }
    if(itemsOnBag <= 0){
        $("#bag-badge").hide();
    } else $("#bag-badge").show();
}

function onCardClick() {
    var id = $(this).attr('id');
    currentPathName += separator + currentPath[id].name;
    $(".back p").text(currentPathName);
    $("#grid-container").empty();
    path.push(currentPath[id]["items"])
    currentPath = path.at(-1)
    if(currentPath == mainPath){
        $("#back").hide();
        $("#home").show();
    } else {
        $("#back").show();
        $("#home").hide();
    }
    cardsFromObject(currentPath)
}

function cardsFromObject(currentPath){
    if(currentPath == undefined) {
        currentPath = mainPath;
    }
    for(var i = 0; i < currentPath.length; i++){
        if(currentPath[i].name != undefined){
            var itemHtml = `
                <div class="card" id="${i}">
                    <div class="content">
                        <img class="icon" src="${currentPath[i].image_url != null ? currentPath[i].image_url : "https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg"}">
                        <h1>${currentPath[i].name}</h1>
                        <p>Descrição</p>
                    </div>
                    <div class="background">
                        <div class="darkner"></div>
                        <img class="background" src="${currentPath[i].image_url != null ? currentPath[i].image_url : "https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg"}">
                    </div>
                </div>
            `;
            $("#grid-container").append(itemHtml);
            $("#grid-container").css('grid-template-columns', "1fr 1fr 1fr 1fr");
            $("#grid-container").css('grid-template-rows', "");
            $("#random").hide();
            randomEnabled = false;
        }else{  
            var itemHtml = `
                <div id="${i}" class="productCard">
                    <img src="${currentPath[i].imagem}">
                    <div class="productInfo">
                        <p class="productBrand">${currentPath[i].marca}</p>
                        <h1 class="productName">${currentPath[i].descricao}</h1>
                        <p class="productPricePerQuantity">${currentPath[i].precoPorQuantidade + "(" + currentPath[i].quantidade + ")"}</p>
                        <div class="productPrice">
                            <p>${currentPath[i].preco}</p>
                        </div>
                    </div>
                    <i id="addToBag" class="fa-solid fa-bag-shopping"></i>
                    <div class="link" href="${currentPath[i].link}">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </div>
                </div>
            `;
            $("#grid-container").append(itemHtml);
            $("#grid-container").css('grid-template-columns', "1fr 1fr 1fr");
            $("#grid-container").css('grid-template-rows', `repeat(${currentPath.length / 3}, 1fr)`);
            $("#random").show();
            randomEnabled = true;

            if(bag.includes(currentPath[i])){
                $(`#${i}`).find("#addToBag").addClass("onbag");
                $(`#${i}`).find("#addToBag").show()
            }
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
        window.electronAPI.openExternal($(this).attr("href"));
    });
    $(".productCard").mouseenter(function(){
        $(this).find(".link").show()
        $(this).find("#addToBag").show()
    }).mouseleave(function(){
        $(this).find(".link").hide()
        if($(this).find("#addToBag").hasClass("onbag")){
            $(this).find("#addToBag").show()
        } else {
            $(this).find("#addToBag").hide()
        }
    });
    $(".productCard #addToBag").click(function() {
        var itemId = $(this).parent().attr("id")
        $(this).toggleClass("onbag");
        var item = currentPath[itemId]
        if($(this).hasClass("onbag")){
            $(this).find("#addToBag").show()
            addItemToBag(item, itemId);
        } else {
            removeItemFromBag(item);
        }
    })
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

    $.ajax({
        url: "http://161.230.150.166:5000/api/v1/resources/items",
        type: "GET",
        timeout: 5000,
        success: function(data) {
            document.getElementById('updater').style.display = 'none';
            mainPath = data.items;
            path.push(data.items);
            currentPath = path.at(-1);
            for(var i = 0; i < currentPath.length; i++){
                var itemHtml = `
                    <div class="card" id="${i}">
                        <div class="content">
                            <img class="icon" src="${currentPath[i].image_url != null ? currentPath[i].image_url : "https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg"}">
                            <h1>${currentPath[i].name}</h1>
                            <p>Descrição</p>
                        </div>
                        <div class="background">
                            <div class="darkner"></div>
                            <img class="background" src="${currentPath[i].image_url != null ? currentPath[i].image_url : "https://www.drbarakat.com.br/wp-content/uploads/2022/05/fast-food.jpg"}">
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

    //new QRCode(document.getElementById("qrcode"), "http://jindo.dev.naver.com/collie");

    new QRCode(document.getElementById("qrCode"), {
        text: "http://161.230.150.166:5000/api/v1/resources/bag/" + hash,
    });

    $("#closeBtn").click(function() {
        window.electronAPI.closeApp();
    })
    $("#back").click(function() {
        path.pop()
        currentPath = path.at(-1);
        currentPathName = currentPathName.split(separator).slice(0, -1).join(separator);
        $(".back p").text(currentPathName);
        $("#grid-container").empty();
        if(currentPath == mainPath){
            $("#back").hide();
            $("#home").show();
        } else {
            $("#back").show();
            $("#home").hide();
        }
        cardsFromObject(currentPath)
    })
    $("#random").click(function() {
        var nrItems = currentPath.length;
        var randomNumber = Math.floor(Math.random() * nrItems);
        var itemNode = $("#grid-container").children()[randomNumber];
        itemNode.scrollIntoView({
            behavior: "smooth",
            block: "center"
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
    $("#bag").click(function() {
        console.log(bag)
        if($("#bag-contents").attr("class") == "hidden"){
            $("#bag-contents").show()
            $("#bag-contents").removeClass("hidden")
            $(this).addClass("active")
            $("#random").hide()
            $('body, html').css({
                backgroundColor: "#181818",
                overflowX: 'hidden',
                overflowY: 'hidden' 
            });
        } else {
            $("#bag-contents").hide()
            $("#bag-contents").addClass("hidden")
            $(this).removeClass("active")
            if(randomEnabled == true){
                $("#random").show()
            } else $("#random").hide()
            $('body, html').css({
                backgroundColor: "#181818",
                overflowX: 'hidden',
                overflowY: 'auto' 
            });
        }
    })
    $("#qrCodeBtn").click(function(){
        var object = {
            id: hash,
            total: "2.50",
            itemCount: bag.length,
            items: bag
        }
        $.ajax({
            url: "http://161.230.150.166:5000/api/v1/resources/bag",
            type: "POST",
            data: JSON.stringify(object),
            contentType: "application/json",
            timeout: 5000,
            success: function(data) {
                console.log(data)
                var qrCode = new QRCode(document.getElementById("qrCode"), {
                    text: "http://161.230.150.166:5000/api/v1/resources/bag/" + hash,
                });
                qrCodeGenerated = true;
                $("#qrCode").fadeIn();
            }
        });
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