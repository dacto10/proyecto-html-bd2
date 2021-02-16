window.images = [];
window.videos = [];
window.audios = [];
window.imagesURL = [];
window.videosURL = [];
window.audiosURL = [];

const upload = (type) => {
    document.getElementById(`${type}Uploader`).click();
}

const openModal = (type) => {
    document.getElementsByClassName("home__options")[0].style.display = "none";
    document.getElementById(`${type}Modal`).style.display = "block";
}

const closeModal = (type) => {
    document.getElementsByClassName("home__options")[0].style.display = "flex";
    document.getElementById(`${type}Modal`).style.display = "none";
}

const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const saveImg = async () => {
    const input = document.getElementById("imgUploader");
    const img = await toBase64(input.files[0]);
    input.type = "text";
    input.type = "file";
    window.images.push(img);
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Update failed");
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["images"], "readwrite");
        transaction.objectStore("images").add(img);
    }
    document.getElementById("imgContainer").innerHTML = "";
    showFiles("img", window.images);
}

const saveVideo = async () => {
    const input = document.getElementById("videoUploader");
    const video = await toBase64(input.files[0]);
    input.type = "text";
    input.type = "file";
    window.videos.push(video);
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Update failed");
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["videos"], "readwrite");
        transaction.objectStore("videos").add(video);
    }
    document.getElementById("videoContainer").innerHTML = "";
    showFiles("video", window.videos);
}

const saveAudio = async () => {
    const input = document.getElementById("audioUploader");
    const audio = await toBase64(input.files[0]);
    input.type = "text";
    input.type = "file";
    window.audios.push(audio);
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Update failed");
    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["audios"], "readwrite");
        transaction.objectStore("audios").add(audio);
    }
    document.getElementById("audioContainer").innerHTML = "";
    showFiles("audio", window.audios);
}

const getData = () => {
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Update failed");
    request.onsuccess = (event) => {
        const db = request.result;
        let req = db.transaction(["images"], "readwrite").objectStore("images").getAll();
        req.onsuccess = () => {
            window.images = req.result;
            req = db.transaction(["videos"], "readwrite").objectStore("videos").getAll();
            req.onsuccess = () => {
                window.videos = req.result;
                req = db.transaction(["audios"], "readwrite").objectStore("audios").getAll();
                req.onsuccess = () => {
                    window.audios = req.result;
                    document.getElementById("imgContainer").innerHTML = "";
                    document.getElementById("videoContainer").innerHTML = "";
                    document.getElementById("audioContainer").innerHTML = "";
                    document.getElementById("imgContainerUrl").innerHTML = "";
                    document.getElementById("videoContainerUrl").innerHTML = "";
                    document.getElementById("audioContainerUrl").innerHTML = "";
                    showFiles("img", window.images, window.imagesURL);
                    showFiles("video", window.videos, window.videosURL);
                    showFiles("audio", window.audios, window.audiosURL);
                }
            }
        }   
    }
    window.imagesURL = window.localStorage.getItem("images") !== null ? JSON.parse(window.localStorage.getItem("images")) : [];
    window.videosURL = window.localStorage.getItem("videos") !== null ? JSON.parse(window.localStorage.getItem("videos")) : []; 
    window.audiosURL = window.localStorage.getItem("audios") !== null ? JSON.parse(window.localStorage.getItem("audios")) : []; 
};

const showFiles = (fileType, source, sourceURL) => {
    source.forEach((element, index) => {
        const fileContainer = document.createElement("div");
        const file = document.createElement(fileType);
        const cross = document.createElement("i");
        fileContainer.classList.add("file-container");
        cross.classList.add("material-icons");
        cross.innerHTML = "close";
        cross.addEventListener("click", () => deleteFile(fileType, index));
        file.src = element;
        if (fileType === "video" || fileType === "audio") file.controls = true;
        fileContainer.appendChild(file);
        fileContainer.appendChild(cross);
        document.getElementById(`${fileType}Container`).appendChild(fileContainer);
    });
    sourceURL.forEach((element, index) => {
        const fileContainer = document.createElement("div");
        const file = document.createElement(fileType);
        const cross = document.createElement("i");
        fileContainer.classList.add("file-container");
        cross.classList.add("material-icons");
        cross.innerHTML = "close";
        cross.addEventListener("click", () => deleteFileURL(fileType, index));
        file.src = element;
        if (fileType === "video" || fileType === "audio") file.controls = true;
        fileContainer.appendChild(file);
        fileContainer.appendChild(cross);
        document.getElementById(`${fileType}ContainerUrl`).appendChild(fileContainer);
    });
}

const toggleContainer = (id) => {
    const container = document.getElementById(id);
    if (container.style.display === "block") {
        container.style.display = "none";
    } else {
        container.style.display = "block";
    }
}

const loadDatabase = () => {
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Creation failed");
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("images", { autoIncrement: true });
        db.createObjectStore("videos", { autoIncrement: true });
        db.createObjectStore("audios", { autoIncrement: true });
    }
    getData();
}

const deleteFile = (fileType, index) => {
    fileType = fileType === "img" ? "images" : (fileType === "video" ? "videos" : "audios");
    const request = window.indexedDB.open("Gallery", 3);
    request.onerror = (event) => window.alert("Update failed");
    request.onsuccess = (event) => {
        const db = request.result;
        let transaction = db.transaction([`${fileType}`], "readwrite").objectStore(fileType).getAll();
        transaction.onsuccess = () => {
            const toReplace = transaction.result.filter((element) => element !== transaction.result[index]);
            transaction = db.transaction([`${fileType}`], "readwrite").objectStore(fileType).clear();
            transaction.onsuccess = () => {
                toReplace.forEach((element) => {
                    transaction = db.transaction([`${fileType}`], "readwrite").objectStore(fileType).add(element);
                });
                getData();
            }
        }
    }
}

const updateLocal = () => {
    window.localStorage.setItem("images", JSON.stringify(window.imagesURL));
    window.localStorage.setItem("videos", JSON.stringify(window.videosURL));
    window.localStorage.setItem("audios", JSON.stringify(window.audiosURL));
}
const deleteFileURL = (fileType, index) => {
    if (fileType === "img") {
        window.imagesURL = window.imagesURL.filter((element) => element !== window.imagesURL[index]);
    } else if (fileType === "video") {
        window.videosURL = window.videosURL.filter((element) => element !== window.videosURL[index]);
    } else {
        window.audiosURL = window.audiosURL.filter((element) => element !== window.audiosURL[index]);
    }
    updateLocal();
    document.getElementById("imgContainer").innerHTML = "";
    document.getElementById("videoContainer").innerHTML = "";
    document.getElementById("audioContainer").innerHTML = "";
    document.getElementById("imgContainerUrl").innerHTML = "";
    document.getElementById("videoContainerUrl").innerHTML = "";
    document.getElementById("audioContainerUrl").innerHTML = "";
    showFiles("img", window.images, window.imagesURL);
    showFiles("video", window.videos, window.videosURL);
    showFiles("audio", window.audios, window. audiosURL);
}
const saveImgURL = () => {
    window.imagesURL.push(document.getElementById("imageInput").value);
    document.getElementById("imageInput").value = "";
    updateLocal();
    document.getElementById("imgContainer").innerHTML = "";
    document.getElementById("videoContainer").innerHTML = "";
    document.getElementById("audioContainer").innerHTML = "";
    document.getElementById("imgContainerUrl").innerHTML = "";
    document.getElementById("videoContainerUrl").innerHTML = "";
    document.getElementById("audioContainerUrl").innerHTML = "";
    showFiles("img", window.images, window.imagesURL);
    showFiles("video", window.videos, window.videosURL);
    showFiles("audio", window.audios, window. audiosURL);
}

const saveVideoURL = () => {
    window.videosURL.push(document.getElementById("videoInput").value);
    document.getElementById("videoInput").value = "";
    updateLocal();
    document.getElementById("imgContainer").innerHTML = "";
    document.getElementById("videoContainer").innerHTML = "";
    document.getElementById("audioContainer").innerHTML = "";
    document.getElementById("imgContainerUrl").innerHTML = "";
    document.getElementById("videoContainerUrl").innerHTML = "";
    document.getElementById("audioContainerUrl").innerHTML = "";
    showFiles("img", window.images, window.imagesURL);
    showFiles("video", window.videos, window.videosURL);
    showFiles("audio", window.audios, window. audiosURL);
}

const saveAudioURL = () => {
    window.audiosURL.push(document.getElementById("audioInput").value);
    document.getElementById("audioInput").value = "";
    updateLocal();
    document.getElementById("imgContainer").innerHTML = "";
    document.getElementById("videoContainer").innerHTML = "";
    document.getElementById("audioContainer").innerHTML = "";
    document.getElementById("imgContainerUrl").innerHTML = "";
    document.getElementById("videoContainerUrl").innerHTML = "";
    document.getElementById("audioContainerUrl").innerHTML = "";
    showFiles("img", window.images, window.imagesURL);
    showFiles("video", window.videos, window.videosURL);
    showFiles("audio", window.audios, window. audiosURL);
}