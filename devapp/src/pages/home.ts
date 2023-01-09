
import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('home-view')
class HomePage extends LitElement {

    render() {
        return html`
            <my-element>
                <h1>Vite + Lit</h1>
            </my-element>
            <br>
            
            <simple-counter count="42" text="HybridJS"></simple-counter>

            <name-tag></name-tag>
        `
    }
}
export default HomePage