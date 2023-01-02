
import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"


@customElement('about-page')
class AboutPage extends LitElement {

    arr = []

    /**
     *
     */
    constructor() {
        super()
        for (let i = 0; i < 100; i++)
            this.arr.push(1)
    }

    render() {
        return html`
            <h2>About</h2>
            ${this.arr.map(n => 
                html`<p>fasdfkhlsakjfhlkasjdfhlkasjfdhlkajsfhlkjsdf</p>`)}
        `
    }
}
export default AboutPage