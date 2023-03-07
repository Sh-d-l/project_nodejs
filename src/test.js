/*const err = {
    "errorsMessages": [
        {
            message: null,
            field: "string"
        }
    ]
}
err.errorsMessages[0].message = "dwfdwedwe"
    console.log(typeof err.errorsMessages[0].message)*/
let arr = ["P144","P480","P455"]
const arrResolutionVideo = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
let filterResolutions = arr.filter(p => arrResolutionVideo.includes(p))
console.log(filterResolutions)