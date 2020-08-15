$("#create_playlist").click(function () {
    console.log(document.cookie)

    $.ajax({
        url: "/playlist_created",
        type: "post",
        data: document.cookie,
        success: function (data) {
            console.log("data sent to server")
        },
        error: function () {
            console.log("Error occurs here")
        },



    })


})


