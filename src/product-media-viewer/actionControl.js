import { gsap } from 'gsap'

export const eventListers = (mediaCollection, camera, controls) => {

    /////////////////////////////////////////////////////////////////////
    //////////////////// IMAGE  CONTAINER START  ////////////////////////
    /////////////////////////////////////////////////////////////////////

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
                    let uniqueId = Math.floor(Math.random() * 10000000)
                    imageContainer.getElementsByClassName('cards')[0].insertAdjacentHTML('beforeend', `
                <img src="${fileURL}" alt="image" imageId="${uniqueId}" class="thumbnail-img" img>
                `)
                    const thumbnailImages = document.getElementsByClassName('thumbnail-img')
                    for (let i = 0; i < thumbnailImages.length; i++) {
                        thumbnailImages[i].addEventListener('click', () => (thumbnailClick()))
                    }
                    mediaCollection.setPair(
                        uniqueId, ''
                    )
                }
                fileReader.readAsDataURL(file[i]);
            } catch {
            }
        }
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    }



    /////////////////////////////////////////////////////////////////////
    //////////////////// IMAGE  CONTAINER  ENDS  ////////////////////////
    /////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////
    //////////////////// BUTTONS ACTIVITIES START ///////////////////////
    /////////////////////////////////////////////////////////////////////

    const viewerContainer = document.getElementsByClassName('viewer-container')[0]
    const thumbnailImages = document.getElementsByClassName('thumbnail-img')
    const previewImage = document.querySelector('.display-image img')
    const viewBtnIcon = document.querySelector('.icon.view')
    const setBtnIcon = document.querySelector('.icon.set')
    let selectedID

    const thumbnailClick = () => {
        console.log("works");
        previewImage.setAttribute('src', event.target.getAttribute('src'))
        for (let i = 0; i < thumbnailImages.length; i++) {
            thumbnailImages[i].classList.remove('active')
        }
        event.target.classList.add('active')
        selectedID = parseInt(event.target.getAttribute('imageId'))
        viewBtnIcon.classList.remove('disable')
        setBtnIcon.classList.remove('disable')
        if (!mediaCollection.getPov(selectedID).pov) {
            viewBtnIcon.classList.add('disable')
        }

    }


    const viewBtn = () => {
        let newCamPos = mediaCollection.getPov(selectedID).pov
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
                onComplete: () => {
                    console.log("completed");
                }
            });


        }

    }
    const setBtn = () => {
        viewBtnIcon.classList.remove('disable')
        mediaCollection.setPair(
            selectedID,
            {
                position: [camera.position.x, camera.position.y, camera.position.z],
                rotation: [camera.rotation._x, camera.rotation._y, camera.rotation._z]
            }
        );
    }


    const openBtnIcon = document.querySelector('.icon.open')
    const closeBtnIcon = document.querySelector('.icon.close')
    const controlButtons = document.querySelectorAll('.control-buttons .icon')
    const iconText = document.querySelectorAll('.icon-text')

    const closeBtn = () => {
        
        previewImage.parentElement.style.opacity = '0';
        selectedID = null;
        closeBtnIcon.style.display = 'none';
        openBtnIcon.style.display = 'block';
        controlButtons[0].style.left = '100px';
        controlButtons[1].style.left = '100px';
        iconText[0].style.left = '100px';
        iconText[1].style.left = '100px';
        viewerContainer.style.bottom = '-150px'
    }

    const openBtn = () => {
        previewImage.parentElement.style.opacity = '1';
        closeBtnIcon.style.display = 'block';
        openBtnIcon.style.display = 'none';
        controlButtons[0].style.left = '0';
        controlButtons[1].style.left = '0';
        iconText[0].style.left = '0';
        iconText[1].style.left = '0';
        viewerContainer.style.bottom = '0'
    }



    /////////////////////////////////////////////////////////////////////
    //////////////////// BUTTONS ACTIVITIES ENDS  ///////////////////////
    /////////////////////////////////////////////////////////////////////


    console.log(mediaCollection.setPair(123456, [123]));

    const setS = () => {
        console.log("SDDSD")
    }



    document.querySelector('#closeBtn').addEventListener('click', () => (closeBtn()))
    document.querySelector('#openBtn').addEventListener('click', () => (openBtn()))
    document.querySelector('#viewBtn').addEventListener('click', () => (viewBtn()))
    document.querySelector('#setBtn').addEventListener('click', () => (setBtn()))
}