
import { LitElement, html, css } from "lit"
import { customElement } from "lit/decorators.js"


@customElement('about-page')
class AboutPage extends LitElement {

    arr: number[] = []

    static styles = css`
        :host {
            display: block;
            background: grey;
        }
    `

    constructor() {
        super()
        for (let i = 0; i < 100; i++)
            this.arr.push(1)
    }

    render() {
        return html`
            <h2>About</h2>
            <click-debounce></click-debounce>
            ${this.arr.map(n => 
                html`<p>fasdfkhlsakjfhlkasjdfhlkasjfdhlkajsfhlkjsdf${n}</p>`)}
        `
    }
}
export default AboutPage