document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll('.slider');

    sliders.forEach(function (slider) {
        const container = slider.closest('.img-container_slider');
        const image2 = container.querySelector('.image-2');

        let isSliding = false;

        slider.addEventListener('mousedown', function () {
            isSliding = true;
        });

        window.addEventListener('mouseup', function () {
            isSliding = false;
        });

        window.addEventListener('mousemove', function (event) {
            if (isSliding) {
                const rect = container.getBoundingClientRect();
                const offsetX = event.clientX - rect.left;
                const sliderPosition = Math.max(0, Math.min(offsetX, rect.width));
                const clipPathValue = `inset(0 ${rect.width - sliderPosition}px 0 0)`;

                slider.style.left = `${sliderPosition}px`;
                image2.style.clipPath = clipPathValue;
            }
        });
    });
});
