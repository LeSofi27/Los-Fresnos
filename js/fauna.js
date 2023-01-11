var Fauna = {
    swiper: null,

    iniciarSwiper: function () {
        this.swiper = new Swiper("#fauna-swiper", {
            effect: "cards",
            grabCursor: true,
        });
    },
};

window.addEventListener("load", function () {
    Fauna.iniciarSwiper();
});
