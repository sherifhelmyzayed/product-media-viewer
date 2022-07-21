class pairCollection {

    #povPairs = [
    ];

    setPair(mediaID, pov) {
        if (mediaID === undefined && pov === undefined) throw RangeError();

        // checks if mediaID exists in pov pairs
        const filteredItem = this.#povPairs.find((item) => (item.mediaID === mediaID));

        // if mediaID exists, POV data are changed, otherwise new data is created
        if (filteredItem) {
            this.#povPairs.map(
                current => (current.mediaID === mediaID)
                    ? current.pov = pov
                    : null
            )
        } else {
            this.#povPairs.push({ mediaID: mediaID, pov: pov });
        }
        return "SUCCESS"
    }

    // gets pov pair for matching mediaID
    getPov(mediaID) {
        return this.#povPairs.find(el => el.mediaID === mediaID);
    }

    // gets the nearest position in pov pair
    getMedia(pov) {
        // get pov nearest to the current pov
        const distArr = this.#povPairs;

        // calculates the distance from each pov element
        for (const item of distArr) {
            item.distance = (item.pov.position[0] - pov[0]) ** 2 + (item.pov.position[1] - pov[1]) ** 2 + (item.pov.position[2] - pov[2]) ** 2;
        }

        // sort the pov according to the lowest distance
        distArr.sort((a, b) => a.distance - b.distance);

        // returns the media nearest to the current pov
        return distArr[0];
    }
}


export default pairCollection;