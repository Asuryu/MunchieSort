window.electronAPI.onUpdateAvailable((_event, info) => {
    document.getElementById('updater').style.display = 'block';
    document.getElementById('updater-text').style.color = '#BCDEFC';
    document.getElementById('updater-info').style.color = '#90979D';

    document.getElementById('updater-text').innerHTML = 'Update available';
    document.getElementById('updater-info').innerHTML = `${info.version} released at ${info.releaseDate}`;
})
window.electronAPI.onUpdateNotAvailable((_event) => {
    document.getElementById('updater').style.display = 'none';
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
window.electronAPI.onError((_event) => {
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

$(document).ready(function() {

    var appVersion = window.electronAPI.getVersion();
    document.getElementById("appVersion").innerHTML = appVersion;

    $('#intro-video').on('ended', function() {
        $('#intro-video').hide();
        $('#content').fadeIn();
        $('#background').fadeOut();
    })
})