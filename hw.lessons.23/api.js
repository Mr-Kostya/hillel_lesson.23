class API {
    constructor(userID) {
        this.TOKEN =
            "d32e74ac29fe26a554911fc03812a1e46df4c667a4c891fe98ad93ff068104c6";
        this.HEADERS = {
            Accept: "application/json",
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${this.TOKEN}`
        };
        this.userID = userID;
        this.baseURL = "https://gorest.co.in/public/v1/posts";
    }

    fetchUserPosts() {
        return new Promise((resolve, reject) => {
            fetch(`${this.baseURL}/?user_id=${this.userID}`, {
                headers: this.HEADERS
            })
                .then((res) => {
                    res.json().then((res) => {
                        resolve(res.data);
                    });
                })
                .catch((e) => reject(e));
        });
    }

    newPost(postData) {
        return new Promise((resolve, reject) => {
            fetch(`${this.baseURL}/`, {
                method: "POST",
                headers: this.HEADERS,
                body: JSON.stringify({
                    ...postData,
                    user_id: this.userID
                })
            })
                .then((res) => {
                    res.json().then((object) => {
                        console.log(object);
                        resolve(object.data);
                    });
                })
                .catch((e) => reject(e));
        });
    }

    deletePost(postID) {
        return fetch(`${this.baseURL}/${postID}`, {
            method: "DELETE",
            headers: this.HEADERS
        });
    }
}
