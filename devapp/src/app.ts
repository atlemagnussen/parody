import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import "./my-element"
import "./test-hybrids"


@customElement('my-app')
class MyApp extends LitElement {

    render() {
        return html`
            <my-element>
                <h1>Vite + Lit</h1>
            </my-element>
            <br>
            <simple-counter></simple-counter>
        `
    }
}