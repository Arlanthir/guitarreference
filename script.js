
// Fret Not JS WIP

class Fretboard extends HTMLElement {
    get defaultFrets() {
        return 22;
    }

    get defaultNut() {
        return true;
    }

    get defaultLegend() {
        return true;
    }

    get defaultHeight() {
        return 115;
    }

    get horizontalOrientation() {
        return true;
    }

    constructor() {
        super();

        this.frets = this.getAttribute('frets') || this.defaultFrets;
        this.strings = this.getAttribute('strings') || 6;
        this.nut = this.getAttribute('nut') === null? this.defaultNut : this.getAttribute('nut') === false;
        this.legend = this.getAttribute('legend') === null? this.defaultLegend : this.getAttribute('legend') === false;

        //this.size = 0;
         // Will be updated later
        this.width = 0;
        this.height = 0;

        const template = document.createElement('template');

        template.innerHTML = `
            <style>
                :host {
                    /*all: initial;
                    contain: content;*/
                    display: block;
                    --fretboard-height: var(--fnjs-fretboard-height, ${this.defaultHeight}px);
                    --string-color: var(--fnjs-string-color, #aaa);
                    --string-width: var(--fnjs-string-width, 2px);
                }

                :host([hidden]) {
                    display: none;
                }

                ${ this.horizontalOrientation ? `
                    .wrapper {
                        padding: 15px 5px 25px ${ this.nut ? '30px' : '5px' };
                    }
                ` : `
                    .wrapper {
                        padding: ${ this.nut ? '50px' : '5px' } 10px 5px 10px;
                    }
                `}

                .fretboard {
                    position: relative;
                    height: var(--fretboard-height);
                }
                
                .nut {
                    position: absolute;
                    ${ this.horizontalOrientation ? `
                        top: calc(-1 * var(--string-width) / 2);
                        bottom: calc(-1 * var(--string-width) / 2);
                        left: 0;
                        width: calc(${this.nut? 2 : 1} * var(--string-width));
                    ` : `
                        left: calc(-1 * var(--string-width) / 2);
                        right: calc(-1 * var(--string-width) / 2);
                        top: 0;
                        height: calc(${this.nut? 2 : 1} * var(--string-width));
                    `}
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
                    ${ this.horizontalOrientation ? `
                        margin-left: calc(-1 * var(--string-width) / 2);
                        border-right: var(--string-width) solid var(--string-color);
                        height: 100%;
                    ` : `
                        margin-top: calc(-1 * var(--string-width) / 2);
                        border-bottom: var(--string-width) solid var(--string-color);
                        width: 100%;
                    ` }
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
                    ${ this.horizontalOrientation ? `
                        margin-top: calc(-1 * var(--string-width) / 2);
                        border-bottom: var(--string-width) solid var(--string-color);
                        width: 100%;
                    ` : `
                        margin-left: calc(-1 * var(--string-width) / 2);
                        border-left: var(--string-width) solid var(--string-color);
                        height: 100%;
                    ` }
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
        this.width = fretboard.getBoundingClientRect().width;
        this.height = fretboard.getBoundingClientRect().height;

        // TODO: last fret has missing pixels
        let fretSpacing = 100 / this.frets;
        for (let i = 1; i <= this.frets; ++i) {
            let fret = document.createElement('div');
            fret.className = `fret`;
            if (this.horizontalOrientation) {
                fret.style.left = (fretSpacing * i) + '%';
            } else {
                fret.style.top = (fretSpacing * i) + '%';
            }
            fretboard.appendChild(fret);

            if (this.legend) {
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

                let fretLabel = document.createElement('div');
                fretLabel.className = `fret-label`;
                fretLabel.style.right = (100 - (fretSpacing * i)) + '%';
                fretLabel.textContent = i;
                fretboard.appendChild(fretLabel);
            }
        }

        
        for (let i = 0; i < this.strings; ++i) {
            let string = document.createElement('div');
            string.className = `string`;
            if (this.horizontalOrientation) {
                string.style.top = (100 / (this.strings - 1) * i) + '%';
            } else {
                string.style.left = (100 / (this.strings - 1) * i) + '%';
            }
            fretboard.appendChild(string);
        }
    }
}

customElements.define('fnjs-fretboard', Fretboard);



class Chord extends Fretboard {
    get defaultFrets() {
        return 3;
    }

    get defaultNut() {
        return false;
    }

    get defaultLegend() {
        return false;
    }

    get defaultHeight() {
        return 80;
    }

    get horizontalOrientation() {
        return false;
    }
}

customElements.define('fnjs-chord', Chord);


class Note extends HTMLElement {
    constructor() {
        super();

        let parent = this.parentElement || this.getRootNode().host;
        // TODO prevent Notes inside non Fretboards/Chords?
        for (; !parent.frets; parent = parent.parentElement);
        this.guitarParent = parent;

        this.fret = this.getAttribute('fret') || 1;
        this.string = this.getAttribute('string') || 1;
        this.color = this.getAttribute('color') || 'var(--fnjs-note-color, #fff)';
        this.bgColor = this.getAttribute('bg') || 'var(--fnjs-note-bg-color, #111)';
        this.borderColor = this.getAttribute('border') || this.bgColor;

        let fretSpacing = 100 / this.guitarParent.frets;

        let top = 0;
        let left = 0;

        if (this.guitarParent.horizontalOrientation) {
            this.size = this.getAttribute('size') || Math.min(1.1 * this.guitarParent.height / this.guitarParent.strings, 
                1.1 * this.guitarParent.width / this.guitarParent.frets);
            top = (100 / (this.guitarParent.strings - 1) * (this.string - 1)) + '%';
            left = this.fret == 0? (-this.size).toString() + 'px' : (fretSpacing * (this.fret - 0.5)).toString() + '%'; 
        } else {
            this.size = this.getAttribute('size') || Math.min(1.3 * this.guitarParent.height / this.guitarParent.frets,
                1.3 * this.guitarParent.width / this.guitarParent.strings);
            left = (100 / (this.guitarParent.strings - 1) * (this.guitarParent.strings - this.string)) + '%';
            top = this.fret == 0? (-this.size).toString() + 'px' : (fretSpacing * (this.fret - 0.5)).toString() + '%'; 
        }

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
                    top: ${top};
                    left: ${left};
                    width: var(--size);
                    height: var(--size);
                    margin-top: calc(-0.5 * var(--size));
                    margin-left: calc(-0.5 * var(--size));
                    font-family: var(--font);
                    color: var(--note-color);
                    background-color: var(--bg-color);
                    text-align: center;
                    line-height: var(--size);
                    border: 2px solid ${this.borderColor};
                    border-radius: 50%;
                    z-index: 1;
                    box-sizing: border-box;
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



class Bar extends HTMLElement {
    constructor() {
        super();

        this.fret = this.getAttribute('fret') || 1;
        this.stringA = this.getAttribute('stringA') || 6;
        this.stringB = this.getAttribute('stringB') || 1;
        this.stringMax = Math.max(this.stringA, this.stringB);
        this.stringMin = Math.min(this.stringA, this.stringB);
        this.color = this.getAttribute('color') || 'var(--fnjs-note-color, #fff)';
        this.bgColor = this.getAttribute('bg') || 'var(--fnjs-note-bg-color, #111)';
        this.borderColor = this.getAttribute('border') || this.bgColor;
        this.rootColor = this.getAttribute('rootColor') || this.bgColor;

        let fretSpacing = 100 / this.parentElement.frets;

        this.barWidth = (this.stringMax - this.stringMin + 2) / this.parentElement.strings * 100;

        let top = 0;
        let left = 0;

        if (this.parentElement.horizontalOrientation) {
            this.size = this.getAttribute('size') || Math.min(1.1 * this.parentElement.height / this.parentElement.strings, 
                1.1 * this.parentElement.width / this.parentElement.frets);
            top = (100 / (this.parentElement.strings - 1) * (this.stringMin - 1)) + '%';
            left = this.fret == 0? (-this.size).toString() + 'px' : (fretSpacing * (this.fret - 0.5)).toString() + '%'; 
        } else {
            this.size = this.getAttribute('size') || Math.min(1.3 * this.parentElement.height / this.parentElement.frets,
                1.3 * this.parentElement.width / this.parentElement.strings);
            left = (100 / (this.parentElement.strings - 1) * (this.parentElement.strings - this.stringMax)) + '%';
            top = this.fret == 0? (-this.size).toString() + 'px' : (fretSpacing * (this.fret - 0.5)).toString() + '%'; 
        }

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

                .bar {
                    position: absolute;
                    top: ${top};
                    left: ${left};
                    ${ this.parentElement.horizontalOrientation ? `
                        width: var(--size);
                        height: ${this.barWidth}%;
                    `:`
                        width: ${this.barWidth}%;
                        height: var(--size);
                    `}
                    margin-top: calc(-0.5 * var(--size));
                    margin-left: calc(-0.5 * var(--size));
                    background-color: var(--bg-color);
                    border: 2px solid ${this.borderColor};
                    border-radius: ${this.size/2}px;
                    z-index: 1;
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact;
                                  color-adjust: exact !important;
                }
            </style>
            <div class="bar"></div>
            <fnjs-note string="${this.stringMax}" fret="${this.fret}" bg="${this.rootColor}">
                <slot><slot>
            </fnjs-note>
        `;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('fnjs-bar', Bar);