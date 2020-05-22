(async () => {

    try {
        const { status, data } = await s5.hr.get('https://data.jsdelivr.com/v1/package/npm/s5-js', { contentType: 'text' });
        if (status === 200) {
            let { versions } = JSON.parse(data);

            const db = await new s5Database().open();

            versions.forEach(v =>
                s5.hr.get(`https://data.jsdelivr.com/v1/package/npm/s5-js@${v}`, { contentType: 'text' })
                    .then(({ url, data }) =>
                        db.insert('s5-versions', {
                            version: url.replace(/^.*@/, ''),
                            files: JSON.parse(data).files.map(f => f.name)
                        }).catch(x => {})
                        //catch porque el insert muere al tratar de insertar existentes
                    )
                    .catch(e => console.log('Error al consultar los archivos de la versión:', e))
            );

        }
    }
    catch (e) {
        console.log('Error al consultar las versiones:', e);
    }

})();