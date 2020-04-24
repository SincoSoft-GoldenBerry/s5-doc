window['app'].define('components/s5.autocomplete', [], () => {

    const modal = s5.get('modal');

    let idDeMiInput = 'idDeMiInput';

    const config = {
        value: 'value',
        text: 'text',
        viewalldata: false,
        data: {
            props: {},
            search: ''
        },
        extended: {
            north: {
                title: '',
                subtitle: ''
            },
            details: [],
            border: ''
        },
        dataSource: undefined,
        icon: '',
        placeholder: undefined,
        orderby: undefined,
        selectFirst: true,
        event: 'keyup',
        service: {
            method: 'GET',
            url: ''
        },
        onselected: function () { },
        onresponse: undefined
    };

    const container = s5.createElem('div', { 'class': 'autocompletes-container' });

    container.innerHTML = `
        <section>
            <table>
                <tr>
                    <td>Valor:</td>
                    <td><input type="text" data-prop="value" /></td>
                </tr>
                <tr>
                    <td>Texto:</td>
                    <td><input type="text" data-prop="text" /></td>
                </tr>
                <tr>
                    <td colspan="2"><a id="a-veradicionales" data-class="adicionales">Propiedades adicionales</a></td>
                </tr>
                <tr class="hidde adicionales">
                    <td>Propiedades adicionales:</td>
                    <td>
                        <input type="text" data-prop="data.props" />
                        <button type="button" id="btn-props" class="success"><i class="fa fa-add"></i></button>
                    </td>
                </tr>
                <tr class="hidde adicionales">
                    <td>Buscar por la propiedad:</td>
                    <td><input type="text" data-prop="data.search" /></td>
                </tr>
                <tr>
                    <td colspan="2"><a id="a-verdetalles" data-class="detalles">Agregar detalles</a></td>
                </tr>
                <tr class="hidde detalles">
                    <td>Título del ítem:</td>
                    <td>
                        <input type="text" data-prop="extended.north.title" />
                    </td>
                </tr>
                <tr class="hidde detalles">
                    <td>Subtítulo del ítem:</td>
                    <td>
                        <input type="text" data-prop="extended.north.subtitle" />
                    </td>
                </tr>
                <tr class="hidde detalles">
                    <td>Detalles adicionales:</td>
                    <td>
                        <input type="text" data-prop="extended.details" />
                        <button type="button" id="btn-details" class="success"><i class="fa fa-add"></i></button>
                    </td>
                </tr>
                <tr class="hidde detalles">
                    <td>Color borde izquierdo:</td>
                    <td>
                        <input type="color" data-prop="extended.border" />
                    </td>
                </tr>
                <tr>
                    <td>Datos fijos o consulta a WS:</td>
                    <td>
                        <input id="rd-ds" type="radio" name="rd-wsds" value="ds" checked="checked" />
                        <label for="rd-ds">Datos fijos</label>
                        <input id="rd-ws" type="radio" name="rd-wsds" value="ws" />
                        <label for="rd-ws">Servicio web</label>
                    </td>
                </tr>
                <tr class="ds">
                    <td colspan="2">
                        <textarea data-prop="dataSource" placeholder="Pegue aquí su JSON"></textarea>
                    </td>
                </tr>
                <tr class="hidde ws">
                    <td>Método:</td>
                    <td><input type="text" data-prop="service.method" value="GET" /></td>
                </tr>
                <tr class="hidde ws">
                    <td>Uri:</td>
                    <td><input type="text" data-prop="service.url" /></td>
                </tr>
                <tr>
                    <td>Icono:</td>
                    <td>
                        <select data-prop="icon">
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Texto informativo:</td>
                    <td>
                        <input type="text" data-prop="placeholder" />
                    </td>
                </tr>
                <tr>
                    <td>Ordenar por:</td>
                    <td>
                        <input type="text" data-prop="orderby" />
                    </td>
                </tr>
                <tr>
                    <td>Seleccionar el primero:</td>
                    <td>
                        <input type="checkbox" checked="checked" data-prop="selectFirst" />
                    </td>
                </tr>
                <tr>
                    <td>Evento para consultar:</td>
                    <td>
                        <input type="text" data-prop="event" value="keyup" />
                    </td>
                </tr>
                <tr>
                    <td>Onselected:</td>
                    <td>
                        <input type="text" data-prop="onselected" value="(data) => {}" />
                    </td>
                </tr>
                <tr>
                    <td>Onresponse:</td>
                    <td>
                        <input type="text" data-prop="onresponse" />
                    </td>
                </tr>
            </table>
        </section>
        <section>
            <pre id="pre-code"></pre>
        </section>
    `;
    
    const input = s5.createElem('input', { 'type': 'text', 'id': idDeMiInput });

    container.insert(input);

    const agregarEventos = () => {
        const inputsText = s5.get('[type=text][data-prop]');
        inputsText.addEvent('change', e => {
            const input = e.target;
            const { prop } = input.dataset;
            config[prop] = input.value;
        });
    };

    const configurar = () => {
        agregarEventos();
        //new s5.utilities.autocomplete(idDeMiInput, config);
    };

    return {
        get: () => container,
        onInserted: configurar
    };
});