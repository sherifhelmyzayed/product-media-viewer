import { gsap } from 'gsap'

export default class ActionControlClass {

    imagesArr = [];
    selectedID;
    file;


    addFile = (mediaCollection) => {
        for (let i = 0; i < this.file.length; i++) {
            let fileReader = new FileReader();
            try {
                fileReader.onload = () => {
                    let fileURL = fileReader.result;
                    let uniqueId = Math.floor(Math.random() * 10000000);
                    this.imagesArr.push({ uniqueId: uniqueId, fileURL: fileURL })
                    if (this.imagesArr.length === 1) {
                        this.selectedID = uniqueId;
                        this.displayImage(mediaCollection)
                        document.querySelector('.icon.set').classList.remove('disable');
                        document.querySelector('.toggle-buttons').style.opacity = 1;
                    }
                    mediaCollection.setPair(uniqueId, null)
                }
                fileReader.readAsDataURL(this.file[i]);
            } catch {
            }
        }
    }

    nextImage = (mediaCollection) => {
        const index = this.imagesArr.findIndex(element => element.uniqueId === this.selectedID);

        if (this.imagesArr.length === 1) return;

        if (this.imagesArr.length > 1 && this.imagesArr[index + 1] != null) {
            this.selectedID = this.imagesArr[index + 1].uniqueId;
        }
        else this.selectedID = this.imagesArr[0].uniqueId;

        this.displayImage();

        if (mediaCollection.getPov(this.selectedID).pov) {
            document.querySelector('.icon.view').classList.remove('disable');
        } else document.querySelector('.icon.view').classList.add('disable');



    }

    prevImage = (mediaCollection) => {
        const index = this.imagesArr.findIndex(element => element.uniqueId === this.selectedID);

        if (this.imagesArr.length === 1) return;

        if (this.imagesArr.length > 1 && index > 0) {
            this.selectedID = this.imagesArr[index - 1].uniqueId;
        }
        else this.selectedID = this.imagesArr[this.imagesArr.length - 1].uniqueId;

        this.displayImage();

        if (mediaCollection.getPov(this.selectedID).pov) {
            document.querySelector('.icon.view').classList.remove('disable');
        } else document.querySelector('.icon.view').classList.add('disable');

    }

    displayImage = (mediaCollection) => {
        const imageSrc = this.imagesArr.find(element => element.uniqueId === this.selectedID).fileURL;
        document.querySelector('.display-image img').setAttribute('src', imageSrc);

    }


    viewBtn = (mediaCollection, camera, controls) => {
        let newCamPos = mediaCollection.getPov(this.selectedID).pov;
        if (this.selectedID && newCamPos) {
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

    setBtn = (mediaCollection, camera) => {
        document.querySelector('.icon.view').classList.remove('disable');
        mediaCollection.setPair(
            this.selectedID,
            {
                position: [camera.position.x, camera.position.y, camera.position.z],
                rotation: [camera.rotation._x, camera.rotation._y, camera.rotation._z]
            }
        );
    }
}