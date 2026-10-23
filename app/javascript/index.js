(() => {

    function initWebsite() {

        /* =====================================================
           HEADER
        ===================================================== */

        const header =
            document.querySelector(".site-header");


        function updateHeader() {

            if (!header) return;

            if (window.scrollY > 10) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        }


        updateHeader();


        if (!header.dataset.initialized) {

            header.dataset.initialized = "true";

            window.addEventListener(
                "scroll",
                updateHeader,
                { passive: true }
            );

        }



        /* =====================================================
           MOBILE MENU
        ===================================================== */

        const menuButton =
            document.getElementById("mobileMenu");

        const nav =
            document.getElementById("mainNav");


        if (
            menuButton &&
            nav &&
            !menuButton.dataset.initialized
        ) {

            menuButton.dataset.initialized = "true";


            menuButton.addEventListener(
                "click",
                () => {

                    const isOpen =
                        nav.classList.toggle("open");


                    menuButton.setAttribute(
                        "aria-expanded",
                        String(isOpen)
                    );

                }
            );


            nav
                .querySelectorAll("a")
                .forEach(link => {

                    link.addEventListener(
                        "click",
                        () => {

                            nav.classList.remove("open");


                            menuButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }
                    );

                });

        }



        /* =====================================================
           ACTIVE NAVIGATION
        ===================================================== */

        const navLinks =
            document.querySelectorAll(
                '.main-nav a[href^="#"]'
            );


        const sections =
            document.querySelectorAll(
                "main section[id]"
            );


        if (
            navLinks.length &&
            sections.length
        ) {

            function updateActiveLink() {

                let current = "home";


                sections.forEach(section => {

                    const rect =
                        section.getBoundingClientRect();


                    if (
                        rect.top <= 160 &&
                        rect.bottom >= 160
                    ) {

                        current =
                            section.id;

                    }

                });


                navLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                        `#${current}`
                    );

                });

            }


            updateActiveLink();


            /*
             * Avoid attaching the same scroll listener
             * multiple times during Turbo navigation.
             */

            if (
                !document.body.dataset.activeNavInitialized
            ) {

                document.body.dataset.activeNavInitialized =
                    "true";


                window.addEventListener(
                    "scroll",
                    updateActiveLink,
                    { passive: true }
                );

            }

        }



        /* =====================================================
           COUNTERS
           Restart every time they enter the viewport
        ===================================================== */

        const counters =
            document.querySelectorAll(
                ".counter"
            );


        counters.forEach(counter => {

            if (
                counter.dataset.counterInitialized
            ) {
                return;
            }


            counter.dataset.counterInitialized =
                "true";


            const target =
                Number(
                    counter.dataset.target
                );


            const decimal =
                counter.dataset.decimal === "true";


            let animationFrame = null;


            function startCounter() {

                /*
                 * Cancel previous animation if one exists.
                 */

                if (animationFrame) {

                    cancelAnimationFrame(
                        animationFrame
                    );

                }


                const duration =
                    1700;


                const startTime =
                    performance.now();


                /*
                 * Reset number before every animation.
                 */

                counter.textContent =
                    decimal
                        ? "0.0"
                        : "0";


                function animate(currentTime) {

                    const elapsed =
                        currentTime - startTime;


                    const progress =
                        Math.min(
                            elapsed / duration,
                            1
                        );


                    /*
                     * Smooth ease-out
                     */

                    const eased =
                        1 -
                        Math.pow(
                            1 - progress,
                            3
                        );


                    const value =
                        target * eased;


                    if (decimal) {

                        counter.textContent =
                            value.toFixed(1);

                    } else {

                        counter.textContent =
                            Math.floor(value)
                                .toLocaleString();

                    }


                    if (progress < 1) {

                        animationFrame =
                            requestAnimationFrame(
                                animate
                            );

                    } else {

                        counter.textContent =
                            decimal
                                ? target.toFixed(1)
                                : target.toLocaleString();

                        animationFrame = null;

                    }

                }


                animationFrame =
                    requestAnimationFrame(
                        animate
                    );

            }


            /*
             * Observe counter continuously.
             *
             * When it enters viewport:
             *   start animation
             *
             * When it leaves:
             *   reset it
             *
             * When it enters again:
             *   animate again
             */

            const counterObserver =
                new IntersectionObserver(
                    entries => {

                        entries.forEach(entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                startCounter();

                            } else {

                                /*
                                 * Reset when leaving viewport.
                                 */

                                if (animationFrame) {

                                    cancelAnimationFrame(
                                        animationFrame
                                    );

                                    animationFrame =
                                        null;

                                }


                                counter.textContent =
                                    decimal
                                        ? "0.0"
                                        : "0";

                            }

                        });

                    },
                    {
                        threshold: 0.25
                    }
                );


            counterObserver.observe(
                counter
            );

        });



        /* =====================================================
           QUOTE MODAL
        ===================================================== */

        const modal =
            document.getElementById(
                "quoteModal"
            );


        const openButtons =
            document.querySelectorAll(
                "[data-open-quote]"
            );


        const closeButtons =
            document.querySelectorAll(
                "[data-close-quote]"
            );


        if (
            modal &&
            !modal.dataset.initialized
        ) {

            modal.dataset.initialized =
                "true";


            function openModal() {

                modal.classList.add("open");


                modal.setAttribute(
                    "aria-hidden",
                    "false"
                );


                document.body.classList.add(
                    "modal-open"
                );


                const firstInput =
                    modal.querySelector(
                        "input"
                    );


                if (firstInput) {

                    setTimeout(
                        () => firstInput.focus(),
                        100
                    );

                }

            }


            function closeModal() {

                modal.classList.remove(
                    "open"
                );


                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );


                document.body.classList.remove(
                    "modal-open"
                );

            }


            openButtons.forEach(button => {

                button.addEventListener(
                    "click",
                    openModal
                );

            });


            closeButtons.forEach(button => {

                button.addEventListener(
                    "click",
                    closeModal
                );

            });


            /*
             * Close modal when clicking
             * outside the modal content.
             */

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        closeModal();

                    }

                }
            );


            /*
             * Escape key
             */

            document.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Escape" &&
                        modal.classList.contains("open")
                    ) {

                        closeModal();

                    }

                }
            );

        }



        /* =====================================================
           SMOOTH NAVIGATION
        ===================================================== */

        const smoothLinks =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        smoothLinks.forEach(link => {

            /*
             * Prevent duplicate listeners
             */

            if (
                link.dataset.smoothInitialized
            ) {
                return;
            }


            link.dataset.smoothInitialized =
                "true";


            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    /*
                     * Escape selector safely.
                     */

                    let target;

                    try {

                        target =
                            document.querySelector(
                                targetId
                            );

                    } catch (error) {

                        return;

                    }


                    if (!target) return;


                    event.preventDefault();


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target
                            .getBoundingClientRect()
                            .top +
                        window.pageYOffset -
                        headerHeight;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        });



        /* =====================================================
           SCROLL REVEAL
           REPLAYS EVERY TIME ELEMENT ENTERS VIEWPORT
        ===================================================== */

        const revealElements =
            document.querySelectorAll(
                [
                    ".service",
                    ".language-card",
                    ".industry-grid article",
                    ".about-content",
                    ".contact-form"
                ].join(", ")
            );


        if (
            "IntersectionObserver" in window &&
            revealElements.length
        ) {

            revealElements.forEach(element => {

                /*
                 * Do not initialize the same element
                 * more than once during Turbo navigation.
                 */

                if (
                    element.dataset.revealInitialized
                ) {

                    return;

                }


                element.dataset.revealInitialized =
                    "true";


                /*
                 * Initial hidden state
                 */

                element.classList.add(
                    "reveal"
                );


                /*
                 * Every element gets its own observer.
                 *
                 * This allows the animation to reset
                 * whenever the element leaves the viewport.
                 */

                const revealObserver =
                    new IntersectionObserver(
                        entries => {

                            entries.forEach(entry => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    /*
                                     * ENTER VIEWPORT
                                     *
                                     * Add visible class
                                     */

                                    entry.target.classList.add(
                                        "visible"
                                    );

                                } else {

                                    /*
                                     * LEAVE VIEWPORT
                                     *
                                     * Remove visible class.
                                     *
                                     * This is the important part:
                                     * when the element comes back,
                                     * the animation will run again.
                                     */

                                    entry.target.classList.remove(
                                        "visible"
                                    );

                                }

                            });

                        },
                        {
                            threshold: 0.12
                        }
                    );


                revealObserver.observe(
                    element
                );

            });

        }



        /* =====================================================
           OPTIONAL HERO ANIMATION
           Makes sure hero content can animate again
           when returning to the top.
        ===================================================== */

        const heroElements =
            document.querySelectorAll(
                ".hero-content, .hero-title, .hero-subtitle, .hero-actions"
            );


        if (
            "IntersectionObserver" in window &&
            heroElements.length
        ) {

            heroElements.forEach(element => {

                if (
                    element.dataset.heroRevealInitialized
                ) {

                    return;

                }


                element.dataset.heroRevealInitialized =
                    "true";


                element.classList.add(
                    "reveal"
                );


                const heroObserver =
                    new IntersectionObserver(
                        entries => {

                            entries.forEach(entry => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "visible"
                                    );

                                } else {

                                    entry.target.classList.remove(
                                        "visible"
                                    );

                                }

                            });

                        },
                        {
                            threshold: 0.15
                        }
                    );


                heroObserver.observe(
                    element
                );

            });

        }

    }

    /* =====================================================
       RAILS / TURBO
       
       Works with:
       - normal page load
       - Turbo navigation
       - page refresh
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initWebsite
    );


    document.addEventListener(
        "turbo:load",
        initWebsite
    );


})();

/* =========================================================
   SUCCESS MODAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("successModal");

    if (!modal) return;

    const closeButton =
        document.getElementById("successModalClose");

    const modalButton =
        document.getElementById("successModalButton");


    function closeModal() {

        modal.style.opacity = "0";

        setTimeout(() => {
            modal.remove();
        }, 250);

    }


    closeButton?.addEventListener(
        "click",
        closeModal
    );


    modalButton?.addEventListener(
        "click",
        closeModal
    );


    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            closeModal();
        }

    });


    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeModal();
        }

    });

});
