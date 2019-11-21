const trashButtons = document.querySelectorAll(".trashButton")

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
            .then(response => {
                window.location.reload()
            })
            .catch(err => console.log(err));

    });

});