export class StantardElement extends HTMLElement {
    static get standardCss() {
        return `
        * {
            box-sizing: border-box;
            color: var(--body-color);
            outline: none;
            -webkit-text-size-adjust: none;
            transition: 0.2s ease all;
        }

        .hide {
            display: none !important;
        }
        `;
    }

    static get standardStickyCss() {
        return `
        .sticky-title {
            position: fixed;
            background-color: var(--body-bgcolor);
            left: 30px;
            right: 30px;
            top: var(--header-height);
            z-index: 1;
        }

        .sticky-sibling {
            margin-top: calc(var(--header-height) * 1.75);
        }

        @media (max-width: 700px) {
            .sticky-title {
                left: 0;
                right: 0;
                padding: 20px !important;
                font-size: .8em;
            }
        }
        `;
    }

    static get standardCssBtn() {
        return `
        button {
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-image: none;
            border: 1px solid transparent;
            border-radius: 4px;
            background-repeat: repeat-x;
            text-shadow: 0 -1px 0 rgba(0, 0, 0, .2);
        }
        
        button:disabled,
        button:disabled:hover {
            background-image: none !important;
            background-color: grey !important;
            cursor: not-allowed;
            filter: none !important;
            box-shadow: none !important;
            border-color: grey !important;
        }
        
            button:hover,
            button:focus {
                background-color: #563d7c;
                border-color: #563d7c;
        
                color: #333;
                text-decoration: none;
                background-position: 0 -15px;
            }
        
            button:active {
                background-image: none;
            }
        
        button > i ~ span {
            margin-left: 10px;
        }
        
        button.success {
            background-image: var(--button-success-bgimage-webkit-linear-gradient);
            background-image: var(--button-success-bgimage-o-linear-gradient);
            background-image: var(--button-success-bgimage-webkit-gradient);
            background-image: var(--button-success-bgimage-linear-gradient);
            filter: var(--button-success-filter-a);
            filter: var(--button-success-filter-b);
            -webkit-box-shadow: var(--button-success-boxshadow);
            box-shadow: var(--button-success-boxshadow);
            color: var(--button-success-color);
            background-color: var(--button-success-bgcolor);
            border-color: var(--button-success-border-color);
        }
        
        button > * {
            color: var(--button-success-color);
        }
        
            button.success:hover,
            button.success:focus {
                background-color: var(--button-success-bgcolor-hover);
                border-color: var(--button-success-border-color-hover);
            }
        
            button.success:active {
                background-color: var(--button-success-bgcolor-hover);
                border-color: var(--button-success-border-color-active);
                -webkit-box-shadow: var(--button-success-boxshadow-active);
                box-shadow: var(--button-success-boxshadow-active);
            }
        `;
    }

    constructor() {
        super();
    }

    dispatchCustomEvent(wrapper) {
        const event = new Event('loadend', { bubbles: true });
        event.container = wrapper;
        this.dispatchEvent(event);
    }
}