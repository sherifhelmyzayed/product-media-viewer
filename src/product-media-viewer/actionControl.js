import { gsap } from 'gsap'

/////////////////////////////////////////////////////////////////////
//////////////////// IMAGE  CONTAINER START  ////////////////////////
/////////////////////////////////////////////////////////////////////

export const imageContainer = (mediaCollection) => {
    const imageContainer = document.getElementsByClassName('image-container')[0];

    //selecting all required elements
    const dropArea = document.querySelector(".drag-area"),
        dragText = dropArea.querySelector("header"),
        button = dropArea.querySelector("button"),
        input = dropArea.querySelector("input");
    let file; //this is a global variable and we'll use it inside multiple functions
    button.onclick = () => {
        input.click(); //if user click on the button then the input also clicked
    }
    input.addEventListener("change", function () {
        //getting user select file and [0] this means if user select multiple files then we'll select only the first one
        file = input.files;
        dropArea.classList.add("active");
        addFile(); //calling function
    });
    //If user Drag File Over DropArea
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault(); //preventing from default behaviour
        dropArea.classList.add("active");
        dragText.textContent = "Release to Upload File";
    });
    //If user leave dragged File from DropArea
    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    });
    //If user drop File on DropArea
    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        file = event.dataTransfer.files;
        addFile();
    });

    const addFile = () => {
        for (let i = 0; i < file.length; i++) {
            let fileReader = new FileReader();
            try {
                fileReader.onload = () => {
                    let fileURL = fileReader.result; //passing user file source in fileURL variable
                    let uniqueId = Math.floor(Math.random() * 10000000);
                    imageContainer.getElementsByClassName('cards')[0].insertAdjacentHTML('beforeend', `
                <img src="${fileURL}" alt="image" imageId="${uniqueId}" class="thumbnail-img" img>
                `);
                    const thumbnailImages = document.getElementsByClassName('thumbnail-img');
                    for (let i = 0; i < thumbnailImages.length; i++) {
                        thumbnailImages[i].addEventListener('click', () => (thumbnailClick()));
                    }
                    mediaCollection.setPair(uniqueId, '')
                }
                fileReader.readAsDataURL(file[i]);
            } catch {
            }
        }
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    }

    const thumbnailClick = () => {
        const thumbnailImages = document.getElementsByClassName('thumbnail-img');
        const previewImage = document.querySelector('.display-image img');
        const setBtnIcon = document.querySelector('.icon.set');
        const viewBtnIcon = document.querySelector('.icon.view');
        previewImage.setAttribute('src', event.target.getAttribute('src'));
        for (let i = 0; i < thumbnailImages.length; i++) {
            thumbnailImages[i].classList.remove('active');
        }
        event.target.classList.add('active');
        const selectedID = parseInt(event.target.getAttribute('imageId'));
        viewBtnIcon.classList.remove('disable');
        setBtnIcon.classList.remove('disable');
        viewBtnIcon.setAttribute('imageId', selectedID);
        setBtnIcon.setAttribute('imageId', selectedID);
        if (!mediaCollection.getPov(selectedID).pov) {
            viewBtnIcon.classList.add('disable')
        }
    }

}

/////////////////////////////////////////////////////////////////////
//////////////////// IMAGE  CONTAINER  ENDS  ////////////////////////
/////////////////////////////////////////////////////////////////////



export const viewBtn = (mediaCollection, camera, controls) => {
    const selectedID = parseInt(document.querySelector('#viewBtn').parentElement.getAttribute('imageId'));
    let newCamPos = mediaCollection.getPov(selectedID).pov;
    if (selectedID && newCamPos) {
        gsap.to(camera.position, {
            duration: 1,
            ease: 'easeOut',
            x: newCamPos.position[0],
            y: newCamPos.position[1],
            z: newCamPos.position[2],
            onUpdate: function () {
                camera.lookAt({ x: 0, y: 0, z: 0 })
                camera.updateProjectionMatrix();
                controls.update();
            },
        });
    }
}
export const setBtn = (mediaCollection, camera) => {
    const selectedID = parseInt(document.querySelector('#setBtn').parentElement.getAttribute('imageId'));
    const viewBtnIcon = document.querySelector('.icon.view');
    viewBtnIcon.classList.remove('disable');
    mediaCollection.setPair(
        selectedID,
        {
            position: [camera.position.x, camera.position.y, camera.position.z],
            rotation: [camera.rotation._x, camera.rotation._y, camera.rotation._z]
        }
    );
}