import { Version } from './shared-components/s5-version.js';
import { Modal } from './shared-components/s5-modal.js';
import { CodeViewer } from './shared-components/s5-code.js';
import { Network } from './shared-components/s5-network.js';
import { App } from './app.js';
import { Index } from './views/index.js';
import { Components } from './views/components.js';
import { IconsComponent } from './views/components/s5.icons.js';
import { IconsViewer } from './shared-components/s5-icon-viewer.js';
import { Code } from './views/code.js';
import { Header } from './views/header.js';
import { Menu } from './views/header/menu.js';
import { MenuItem } from './views/header/menu-item.js';

const elems = [
    Version,
    Modal,
    CodeViewer,
    Network,
    App,
    Index,
    Components,
    IconsComponent,
    IconsViewer,
    Code,
    Header,
    Menu,
    MenuItem
];

export function register() {
    elems.forEach(element => customElements.define(element.tag, element, element.extended));
}