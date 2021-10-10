const api = new API("13");

class TableView {
    constructor() {
        this.tableElement = document.getElementById("post_table");
        this.tableElement.addEventListener("click", (e) => {
            this.handleClick(e);
        });
        this.tableElement.appendChild(this.renderCreateRow(["title", "body"]));
    }

    handleClick(e) {
        const method = e.target.getAttribute("method");
        const postId = e.target.getAttribute("post-id");

        switch (method) {
            case "delete": {
                api.deletePost(postId).then(() => {
                    document.getElementById(postId).remove();
                });
                break;
            }
            case "create": {
                const inputs = [];
                document.getElementById("create").childNodes.forEach((el) => {
                    if (!!el.id) {
                        inputs.push(el.children[0]);
                    }
                });
                const newPost = inputs.reduce((acc, el) => {
                    if (!el.value) {
                        this.showError(el.parentElement.children[1]);
                        return acc;
                    }
                    acc = {
                        ...acc,
                        [el.name]: el.value
                    };
                    el.value = "";
                    return acc;
                }, {});

                if (newPost.title && newPost.body) {
                    api.newPost(newPost).then((res) => {
                        this.createTableRow(res);
                    });
                }
                break;
            }
            default: {
                return;
            }
        }
    }

    createTableRow(data) {
        const row = document.createElement("tr");

        Object.keys(data).forEach((key) => {
            if (key === "user_id") {
                return;
            }
            const tableCell = document.createElement("td");

            if (key === "id") {
                row.setAttribute("id", data[key]);
            }

            tableCell.innerText = data[key];
            row.appendChild(tableCell);
        });

        row.appendChild(this.createActionCell(data.id));

        this.tableElement.appendChild(row);
    }

    createActionCell(postId) {
        const tableCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Изменить";
        editButton.setAttribute("method", "edit");
        editButton.setAttribute("post-id", postId);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.setAttribute("method", "delete");
        deleteButton.setAttribute("post-id", postId);

        tableCell.appendChild(editButton);
        tableCell.appendChild(deleteButton);

        return tableCell;
    }

    renderCreateRow(keys) {
        const row = document.createElement("tr");
        row.id = "create";

        const titleCell = document.createElement("td");
        titleCell.textContent = "СОЗДАТЬ";

        row.appendChild(titleCell);

        keys.forEach((key) => {
            const inputCell = document.createElement("td");
            inputCell.id = key;
            const input = document.createElement("input");
            input.addEventListener("focus", (e) => {
                this.cleanError(e.target.parentElement.childNodes[1]);
            });
            input.type = "text";
            input.name = key;
            inputCell.appendChild(input);
            this.renderErrorMessage(inputCell);

            row.appendChild(inputCell);
        });

        const actionCell = document.createElement("td");
        const createButton = document.createElement("button");
        createButton.textContent = "Создать";
        createButton.setAttribute("method", "create");
        actionCell.appendChild(createButton);
        row.appendChild(actionCell);

        return row;
    }

    renderErrorMessage(el) {
        const errorMessageElement = document.createElement("span");
        errorMessageElement.textContent = "Обязательное поле!";
        errorMessageElement.className = "error";
        el.appendChild(errorMessageElement);
    }

    showError(el) {
        el.classList.add("visible");
    }

    cleanError(el) {
        el.classList.remove("visible");
    }
}

const tableView = new TableView();

api.fetchUserPosts().then((res) => {
    res.forEach((post) => {
        tableView.createTableRow(post);
    });
});
