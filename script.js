
// Fret Not JS

class Fretboard extends HTMLElement {
    constructor() {
        super();

        this.frets = this.getAttribute('frets') || 22;
        this.strings = this.getAttribute('strings') || 6;
        this.height = 0; // Will be updated later

        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                :host {
                    /*all: initial;
                    contain: content;*/
                    display: block;
                    --fretboard-height: var(--fnjs-fretboard-height, 115px);
                    --string-color: var(--fnjs-string-color, #aaa);
                    --string-width: var(--fnjs-string-width, 2px);
                }

                :host([hidden]) {
                    display: none;
                }

                .wrapper {
                    padding: 25px;
                }

                .fretboard {
                    position: relative;
                    height: var(--fretboard-height);
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

                .fret-label {
                    position: absolute;
                    top: 100%;
                    margin-top: 5px;
                    font-family: var(--fnjs-font, sans-serif);
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
            <div class="wrapper">
                <div class="fretboard">
                    <div class="nut"></div>
                    <slot></slot>
                </div>
                <div class="spacer"></div>
            </div>
        `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        //console.log('Fretboard height', getComputedStyle(this).getPropertyValue('--fretboard-height'));

        let fretboard = this.shadowRoot.querySelector('.fretboard');
        this.height = fretboard.getBoundingClientRect().height;

        // TODO: last fret has missing pixels
        let fretSpacing = 100 / this.frets;
        for (let i = 1; i <= this.frets; ++i) {
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

            let fretLabel = document.createElement('div');
            fretLabel.className = `fret-label`;
            fretLabel.style.right = (100 - (fretSpacing * i)) + '%';
            fretLabel.textContent = i;
            fretboard.appendChild(fretLabel);
        }

        
        for (let i = 0; i < this.strings; ++i) {
            let string = document.createElement('div');
            string.className = `string`;
            string.style.top = (100 / (this.strings - 1) * i) + '%';
            fretboard.appendChild(string);
        }
    }
}

customElements.define('fnjs-fretboard', Fretboard);


class Note extends HTMLElement {
    constructor() {
        super();

        this.fret = this.getAttribute('fret') || 1;
        this.string = this.getAttribute('string') || 1;
        this.color = this.getAttribute('color') || 'var(--fnjs-note-color, #fff)';
        this.bgColor = this.getAttribute('bg') || 'var(--fnjs-note-bg-color, #111)';
        this.borderColor = this.getAttribute('border') || this.bgColor;
        this.size = this.getAttribute('size') || this.parentElement.height / this.parentElement.strings;

        let top = (100 / (this.parentElement.strings - 1) * (this.string - 1));

        let fretSpacing = 100 / this.parentElement.frets;
        let left = this.fret == 0? fretSpacing * -0.25 : fretSpacing * (this.fret - 0.5); 

        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                :host {
                    /*all: initial;
                    contain: content;*/
                    display: block;
                    --note-color: ${this.color};
                    --bg-color: ${this.bgColor};
                    --font: var(--fnjs-font, sans-serif);
                    --size: ${this.size}px;
                    font-size: calc(var(--size) * 0.7);
                }

                :host([hidden]) {
                    display: none;
                }

                .note {
                    position: absolute;
                    top: ${top}%;
                    left: ${left}%;
                    width: var(--size);
                    height: var(--size);
                    margin-top: calc(-0.5 * var(--size) - 1px); /* 1px from border */
                    margin-left: calc(-0.5 * var(--size) - 1px); /* 1px from border */
                    font-family: var(--font);
                    color: var(--note-color);
                    background-color: var(--bg-color);
                    text-align: center;
                    line-height: var(--size);
                    border: 1px solid ${this.borderColor};
                    border-radius: 50%;
                    z-index: 1;
                    -webkit-print-color-adjust: exact;
                                  color-adjust: exact !important;
                }
            </style>
            <div class="note">
                <slot><slot>
            </div>
        `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('fnjs-note', Note);