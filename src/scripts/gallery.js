class Gallery {
    constructor() {
        this.db = null;
        this.images = [];
        this.videos = [];
        this.audios = [];
        this.loadDatabase();
    }
    loadDatabase() {
        const request = window.indexedDB.open("Gallery", 3);
        request.onerror = (event) => window.alert("Creation failed");
        request.onupgradeneeded = (event) => {
            const db = request.result;
            db.createObjectStore("images", { autoIncrement : true });
            db.createObjectStore("videos", { autoIncrement : true });
            db.createObjectStore("audios", { autoIncrement : true });
            this.db = db;
        }
        this.getData();
    }
    getData() {
        const request = window.indexedDB.open("Gallery", 3);
        request.onerror = (event) => window.alert("Update failed");
        request.onsuccess = (event) => {
            const db = request.result;
            console.log(request);
            this.images = db.transaction(["images"], "readwrite").objectStore("images").getAll().result;
            this.videos = db.transaction(["videos"], "readwrite").objectStore("videos").getAll().result;
            this.audios = db.transaction(["audios"], "readwrite").objectStore("audios").getAll().result;
        }
        this.showImg();
    }
    showImg() {
        this.images.forEach((element) => {
            const img = document.createElement("img");
            img.src = element;
            document.getElementById("imgContainer").appendChild(img);
        });
    }
    async saveImg() {
        const input = document.getElementById("imageUploader");
        const img = await this.toBase64(input.files[0]);
        input.type = "text";
        input.type = "file";
        this.images.push(img);
        const transaction = this.db.transaction(["images"], "readwrite");
        transaction.objectStore("images").add(img);
        document.getElementById("imgContainer").innerHTML = "";
        this.showImg();
    }
    toggleContainer() {
        const container = document.getElementById("imgContainer");
        if (container.style.display === "grid") {
            container.style.display = "none";
        } else {
            container.style.display = "grid";
        }
    }
    toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    uploadImg() {
        document.getElementById("imageUploader").click();
    }
}

const gallery = new Gallery();