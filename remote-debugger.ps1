Set-ExecutionPolicy RemoteSigned -scope CurrentUser

Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')

#en cmd: remotedebug_ios_webkit_adapter --port=9000
#en chrome abrir esta url en una pestaña: chrome://inspect/#devices
#si no aparece el dispositivo, registrar en Configure: localhost:9000