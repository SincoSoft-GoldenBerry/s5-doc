window.waitForGlobal('s5.hr')
    .then(async () => {
        try {
            const { status, data } = await s5.hr.get('https://data.jsdelivr.com/v1/package/npm/s5-js', { contentType: 'text' });
            if (status === 200) {
                let { versions } = JSON.parse(data);
    
                const versionModel = new VersionModel();
                const existingVersions = await versionModel.getAllVersions();
    
                const versionesFaltantes = versions.filter(v => !existingVersions.some(e => e.version === v));
                let contador = versionesFaltantes.length;
                if (contador > 0) {
                    versionesFaltantes.forEach(v =>
                        s5.hr.get(`https://data.jsdelivr.com/v1/package/npm/s5-js@${v}`, { contentType: 'text' })
                            .then(({ url, data }) =>
                                versionModel.registerVersion(new VersionField(url.replace(/^.*@/, ''), JSON.parse(data).files.map(f => f.name)))
                                    .then(() => {
                                        contador--;
                                        if (contador === 0)
                                            window['versions-loaded'] = true;
                                    })
                            )
                            .catch(e => console.log('Error al consultar los archivos de la versión:', e))
                    );
                }
                else {
                    window['versions-loaded'] = true;
                }
            }
        }
        catch (e) {
            console.log('Error al consultar las versiones:', e);
        }
    
    });