const trashButtons = document.querySelectorAll(".trashButton")
const updateRequirements = document.querySelector("#updateRequirements");

updateRequirements.addEventListener('click', () => {

    // If this is not checked, we prioritize routes that have minimal changes to modes of travel.
    const wantsRouteTransfer = document.querySelector('#routeTransferCheckbox').checked;
    const needsWheelchairAccess = document.querySelector('#mobilityCheckbox').checked;
    const needsVisibility = document.querySelector('#visibilityCheckbox').checked;

    fetch('/updateAccessibilityNeeds', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                wantsRouteTransfer: wantsRouteTransfer,
                needsVisibility: needsVisibility,
                needsWheelchairAccess: needsWheelchairAccess
            })
        })
        then(() => {
            window.location.reload();
        })
        .catch(err => console.log(err));

});

trashButtons.forEach(el => {

    el.addEventListener('click', () => {
        const stationName = event.target.parentNode.querySelector(".stationName").textContent;
    
        fetch('/deleteFavoriteStation', {
                method: 'delete',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    stationName: stationName
                })
            })
            .then(() => {
                window.location.reload()
            })
            .catch(err => console.log(err));

    });

});