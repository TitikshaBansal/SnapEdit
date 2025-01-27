var tl = gsap.timeline();
var tl1 = gsap.timeline();

tl1.to(".wrapper ", {
    opacity: 1,
});

tl1.to("#loader h1", {
    delay: 0.9,
    duration: 1,
    onStart: time(),
});

tl1.to("#loader", {
    top: "-100vh",
    delay: 0.5,
    duration: 1.5,
});

tl1.from("nav a ", {
    y: -80,
    opacity: 0,
    duration: 0.8,
    delay: 0.5
})

tl1.from("#page1 h1", {
    x: -500,
    opacity: 0,
    duration: 0.8,
})

tl1.from(".container", {
    scale: 0.5,
    opacity: 0,
    duration: 1,
})

function time() {
    var a = 0;
    setInterval(function () {
        a = a + Math.floor(Math.random() * 15);

        if (a < 100) {
            document.querySelector("#loader h1").innerHTML = a + "%";
        } else {
            a = 100;
            document.querySelector("#loader h1").innerHTML = a + "%";
        }
    }, 150);
}

tl.to("#page1 h1 ", {
    transform: "translateX(-100%)",
    fontWeight: "100",
    scrollTrigger: {
        trigger: "#page1",
        scroller: "body",
        start: "top 0",
        end: "top -200%",
        scrub: 3,
        pin: true,
    },
});

const fileInput = document.querySelector(".file-input"),
    filterOptions = document.querySelectorAll(".filter button"),
    filterName = document.querySelector(".filter-info .name"),
    filterValue = document.querySelector(".filter-info .value"),
    filterSlider = document.querySelector(".slider input"),
    rotateOptions = document.querySelectorAll(".rotate button"),
    previewImg = document.querySelector(".preview-img img"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    chooseImgBtn = document.querySelector(".choose-img"),
    saveImgBtn = document.querySelector(".save-img");

let brightness = "100", saturation = "100", inversion = "0", grayscale = "0", blur = "0", contrast = "100";
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blur}px) contrast(${contrast}%)`;
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else if (option.id === "blur") { 
            filterSlider.max = "10"; // Max blur value (in pixels)
            filterSlider.value = blur;
            filterValue.innerText = `${blur}px`;
        } else if (option.id === "contrast") { // Contrast case
            filterSlider.max = "200";
            filterSlider.value = contrast;
            filterValue.innerText = `${contrast}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else if (selectedFilter.id === "blur") { // Handle blur value
        blur = filterSlider.value;
        filterValue.innerText = `${blur}px`; // Show blur in pixels
    } else if (selectedFilter.id === "contrast") { // Handle contrast value
        contrast = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0", blur = "0", contrast = "100";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%) blur(${blur}px) contrast(${contrast}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());