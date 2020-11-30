
// Fret Not JS

class Fretboard extends HTMLElement {
    constructor() {
        super();

        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                :host {
                    /*all: initial;
                    contain: content;*/
                    display: block;
                    --string-color: var(--fnjs-string-color, #aaa);
                    --string-width: var(--fnjs-string-width, 2px);
                    --other-color: red;
                }

                :host([hidden]) {
                    display: none;
                }

                .fretboard {
                    position: relative;
                    height: 100px;
                }
                
                .nut {
                    position: absolute;
                    top: calc(-1 * var(--string-width) / 2);
                    bottom: calc(-1 * var(--string-width) / 2);
                    left: 0;
                    width: calc(2 * var(--string-width));
                    background-color: var(--string-color);
                    -webkit-print-color-adjust: exact;
                                  color-adjust: exact !important;
                }
                
                .inlay {
                    position: absolute;
                    top: 50%;
                    margin-left: -5px;
                    margin-top: -5px;
                    border-radius: 50%;
                    width: 10px;
                    height: 10px;
                    background-color: var(--string-color);
                    -webkit-print-color-adjust: exact;
                                  color-adjust: exact !important;
                }
                
                .fret {
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin-left: calc(-1 * var(--string-width) / 2);
                    border-right: var(--string-width) solid var(--string-color);
                    height: 100%;
                }
                
                .string {
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin-top: calc(-1 * var(--string-width) / 2);
                    border-bottom: var(--string-width) solid var(--string-color);
                    width: 100%;
                }
            </style>
            <div class="fretboard">
                <div class="nut"></div>
                <slot></slot>
            </div>
        `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        let fretboard = this.shadowRoot.querySelector('.fretboard');

        // TODO: last fret has missing pixels
        let numFrets = this.getAttribute('frets') || 22;
        let fretSpacing = 100 / numFrets;
        for (let i = 1; i <= numFrets; ++i) {
            if ([0, 3, 5, 7, 9].includes(i % 12)) {
                let inlay = document.createElement('div');
                inlay.className = 'inlay';
                inlay.style.left = (fretSpacing * (i - 0.5)) + '%';
                if (i % 12 === 0) {
                    inlay.style.top = '30%';
                    fretboard.appendChild(inlay);
                    inlay = document.createElement('div');
                    inlay.className = 'inlay';
                    inlay.style.left = (fretSpacing * (i - 0.5)) + '%';
                    inlay.style.top = '70%';
                }
                fretboard.appendChild(inlay);
            }
            let fret = document.createElement('div');
            fret.className = `fret`;
            fret.style.left = (fretSpacing * i) + '%';
            fretboard.appendChild(fret);
        }

        let numStrings = this.getAttribute('strings') || 6;
        for (let i = 0; i < numStrings; ++i) {
            let string = document.createElement('div');
            string.className = `string`;
            string.style.top = (100 / (numStrings - 1) * i) + '%';
            fretboard.appendChild(string);
        }
    }
}

customElements.define('fnjs-fretboard', Fretboard);

// getComputedStyle(document.documentElement).getPropertyValue('--string-width');
