
// Fret Not JS
class Fretboard extends HTMLElement {
    constructor() {
        super();
        /** Protects from multiple connectedCallback invocations */
        this.initted = false;

        const template = document.createElement('template');

        /*template.innerHTML = `
            <style>
                :host {
                    all: initial;
                    display: block;
                    contain: content;
                }

                :host([hidden]) {
                    display: none;
                }
            </style>
        `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));*/
    }

    connectedCallback() {
        if (!this.initted) {
            let div = document.createElement('div');
            div.setAttribute('class', 'fretboard');
            let nut = document.createElement('div');
            nut.className = 'nut';
            div.appendChild(nut);

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
                        div.appendChild(inlay);
                        inlay = document.createElement('div');
                        inlay.className = 'inlay';
                        inlay.style.left = (fretSpacing * (i - 0.5)) + '%';
                        inlay.style.top = '70%';
                    }
                    div.appendChild(inlay);
                }
                let fret = document.createElement('div');
                fret.className = `fret`;
                fret.style.left = (fretSpacing * i) + '%';
                div.appendChild(fret);
            }

            let numStrings = this.getAttribute('strings') || 6;
            for (let i = 0; i < numStrings; ++i) {
                let string = document.createElement('div');
                string.className = `string`;
                string.style.top = (100 / (numStrings - 1) * i) + '%';
                div.appendChild(string);
            }

            this.appendChild(div);
            this.initted = true;
        }
    }
}

customElements.define('fnjs-fretboard', Fretboard);

// getComputedStyle(document.documentElement).getPropertyValue('--string-width');
