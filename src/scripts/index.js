window.images = [];
window.videos = [];
window.audios = [];

const uploadImg = () => {
    document.getElementById("imageUploader").click();
}

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const saveImg = async () => {
    const input = document.getElementById("imageUploader");
    const img = await toBase64(input.files[0]);
    input.type = "text";
    input.type = "file";
    window.images.push(img);
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Update failed");
    let db;
    request.onsuccess = (event) => db = event.target.result; 
    const transaction = db.transaction(["images"], "readwrite");
    transaction.objectStore("images").add(img);
    document.getElementById("imgContainer").innerHTML = "";
    showImg();
}

const getData = () => {
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Update failed");
    let db;
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log(event.target);
    }
    console.log(db);
    window.images = db.transaction(["images"], "readwrite").getAll();
    window.videos = db.transaction(["videos"], "readwrite").getAll();
    window.audios = db.transaction(["audios"], "readwrite").getAll();
    showImg();
};

const showImg = () => {
    window.images.forEach((element) => {
        const img = document.createElement("img");
        img.src = element;
        document.getElementById("imgContainer").appendChild(img);
    });
}

const toggleContainer = () => {
    const container = document.getElementById("imgContainer");
    if (container.style.display === "grid") {
        container.style.display = "none";
    } else {
        container.style.display = "grid";
    }
}

const loadDatabase = () => {
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Creation failed");
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("images", { autoIncrement : true });
        db.createObjectStore("videos", { autoIncrement : true });
        db.createObjectStore("audios", { autoIncrement : true });
    }
    getData();
}