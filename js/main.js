document.addEventListener('DOMContentLoaded', ()=>{
    const lang = document.documentElement.lang;

    if (lang == 'el') {
        console.log('Greek site loaded');
        //Greek Specific code
        const captions = ['Η Φιλόλογος κα Άντρη' , 'Η Μαθηματικός κα Ευριδίκη' , 'Η Φιλόλογος κα Λία' , 'Ο Μαθηματικός κος Αντρέας']
    } else {
        console.log('English site loaded');
        //English Specific code
        const captions = ['Our Greek Teacher Andrea' , 'Our Mathematics Teacher Andreas' , 'Our Greek Teacher John' , 'Our Mathematics Teacher Maria']
    }



    const imgswaps = ['../images/teacher_1.jpg','../images/teacher_2.jpg','../images/teacher_3.jpg','../images/teacher_4.jpg'];
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

    setInterval(nextImage,4000);

    nextImageButton.addEventListener('click',nextImage);
    lastImageButton.addEventListener('click',lastImage);
});