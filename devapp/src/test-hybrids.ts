import { html, define } from "hybrids"
 
interface SimpleCounter {
    count: number;
    text: string
}

function increaseCount(host: SimpleCounter) {
    host.count += 1
}

// render means shadowDOM and content means not shadowDOM
export default define<SimpleCounter>({
    tag: "simple-counter",
    count: 0,
    text: "",
    content: (props) => html`
        <p>${props.text}</p>
        <button onclick="${increaseCount}">
            Count: ${props.count}
        </button>
    `.css`
        button {
            color: red;
        }
    `,
})