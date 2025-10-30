document.addEventListener('DOMContentLoaded', ()=>{
    const imgswaps = ['Images/teacher_1.jpg','Images/teacher_2.jpg','Images/teacher_3.jpg','Images/teacher_4.jpg'];
    const captions = ['Our Greek Teacher Andrea' , 'Our Mathematics Teacher Andreas' , 'Our Greek Teacher John' , 'Our Mathematics Teacher Maria']
    let currentIndex = 0;
    const swapImageElement = document.getElementById('swap_image');
    const nextImageButton = document.getElementById('next_image');
    const lastImageButton = document.getElementById('last_image');
    const ImageCaption = document.getElementById('Photo_Swap_caption');

    function nextImage() {
        currentIndex = (currentIndex+1) % imgswaps.length;
        swapImageElement.src = imgswaps[currentIndex];
        ImageCaption.textContent = captions[currentIndex];
    }
    function lastImage() {
        currentIndex = (currentIndex+3) % imgswaps.length;
        swapImageElement.src = imgswaps[currentIndex];
        ImageCaption.textContent = captions[currentIndex];
    }

    setInterval(nextImage,5000);

    nextImageButton.addEventListener('click',nextImage);
    lastImageButton.addEventListener('click',lastImage);
});