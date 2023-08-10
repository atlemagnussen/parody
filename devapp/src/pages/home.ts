
import { LitElement, html } from "lit"
import { customElement } from "lit/decorators.js"
import { provideFASTDesignSystem, fastTab, fastTabPanel, fastTabs } from "@microsoft/fast-components"

provideFASTDesignSystem()
    .register(fastTab(),fastTabPanel(),fastTabs())

@customElement('home-view')
class HomePage extends LitElement {

    tabChange(e: any) {
        // console.log(e)
        let tab = e.detail as HTMLElement
        if (tab.id == "fast") {
            setTimeout(() => {
                const nameTag = this.shadowRoot?.querySelector("name-tag") as HTMLElement
                nameTag.removeAttribute("hidden")
                nameTag.addEventListener("test-event", (e) => {
                    console.log("test-event", e)
                })
            }, 500)
        }
        
    }

    render() {
        return html`
            <fast-tabs activeid="entrees" @change=${this.tabChange}>
                <fast-tab id="lit">
                    Lit
                </fast-tab>
                <fast-tab id="hybrids">
                    Hybrids
                </fast-tab>
                <fast-tab id="fast">
                    Fast
                </fast-tab>

                <fast-tab-panel id="litPan">
                    <my-element>
                        <h1>Vite + Lit</h1>
                    </my-element>
                </fast-tab-panel>
                <fast-tab-panel id="hybridsPanel">
                    <simple-counter count="42" text="HybridJS"></simple-counter>
                </fast-tab-panel>
                <fast-tab-panel id="fastPanel">
                    <name-tag hidden></name-tag>
                </fast-tab-panel>
            </fast-tabs>
            
            <br>
        `
    }
}
export default HomePage