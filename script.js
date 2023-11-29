function generateListItem(listElement) {
    const fragment = document.createDocumentFragment();
    const li = document.createElement("li");
    const h = document.createElement("h1");
    const a = document.createElement("a");
    a.href = listElement.link;
    h.innerText = listElement.name;
    a.appendChild(h);
    li.appendChild(a);
    fragment.appendChild(li);
    return fragment;
}

async function main() {
    const resp = await fetch("/projects.json");
    const listElements = await resp.json();

    const list = document.querySelector(".main-list");
    listElements.map(generateListItem)
        .forEach(listItem => list.appendChild(listItem));
}

document.addEventListener("DOMContentLoaded", main);