// window.electronAPI.onUpdateAvailable((_event, info) => {
//     document.getElementById('updater').style.display = 'block';
//     document.getElementById('updater-text').style.color = '#BCDEFC';
//     document.getElementById('updater-info').style.color = '#90979D';

//     document.getElementById('updater-text').innerHTML = 'Update available';
//     document.getElementById('updater-info').innerHTML = `${info.version} released at ${info.releaseDate}`;
// })
// window.electronAPI.onDownloadProgress((_event, progress) => {
//     document.getElementById('updater-text').innerHTML = 'Downloading update';
//     document.getElementById('updater-info').innerHTML = `${Math.floor(progress.percent)}%`;
// })
// window.electronAPI.onUpdateDownloaded((_event) => {
//     document.getElementById('updater-text').innerHTML = 'Update downloaded';
//     document.getElementById('updater-info').innerHTML = "Restarting...";
// })
// window.electronAPI.onError((_event) => {
//     document.getElementById('updater').style.display = 'block';
//     document.getElementById('updater-text').style.color = '#f1535a';
//     document.getElementById('updater-info').style.color = '#946f71';

//     document.getElementById('updater-text').innerHTML = 'An error has occurred';
//     document.getElementById('updater-info').innerHTML = 'Your app could not be updated';
// })

var appVersion = window.electronAPI.getVersion();
document.getElementById("appVersion").innerHTML = appVersion;