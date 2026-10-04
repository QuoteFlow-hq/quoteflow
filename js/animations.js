(() => {

  "use strict";


  const reduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canHover =
    window.matchMedia("(hover:hover)").matches;


  if (reduced) return;


  /* =========================================
     CURSOR LIGHT
  ========================================= */

  const glow =
    document.querySelector(".cursor-glow");

  if(glow && canHover){

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = null;

    window.addEventListener("pointermove", event => {

      targetX = event.clientX;
      targetY = event.clientY;

      if(frame) return;

      frame =
        requestAnimationFrame(function move(){

          x += (targetX - x) * .14;
          y += (targetY - y) * .14;

          glow.style.left = `${x}px`;
          glow.style.top = `${y}px`;

          frame =
            requestAnimationFrame(move);

        });

    });

    window.addEventListener("pointerleave", () => {
      glow.style.opacity = "0";
    });

    window.addEventListener("pointerenter", () => {
      glow.style.opacity = "1";
    });

  }


  /* =========================================
     HERO 3D OBJECT
  ========================================= */

  const stage =
    document.querySelector(".hero-object");

  const front =
    document.querySelector(".card-front");

  const back =
    document.querySelector(".card-back");

  if(stage && front && back && canHover){

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = null;

    const animate =
      () => {

        currentX +=
          (targetX - currentX) * .075;

        currentY +=
          (targetY - currentY) * .075;


        front.style.transform =
          `
          translate(
            ${35 + currentX * 22}px,
            ${35 + currentY * 17}px
          )
          rotate(
            ${5 + currentX * 4}deg
          )
          rotateX(
            ${10 - currentY * 9}deg
          )
          rotateY(
            ${currentX * 12}deg
          )
          `;


        back.style.transform =
          `
          translate(
            ${-42 - currentX * 13}px,
            ${-55 - currentY * 10}px
          )
          rotate(
            ${-8 - currentX * 2.5}deg
          )
          rotateX(
            ${8 + currentY * 6}deg
          )
          rotateY(
            ${currentX * -7}deg
          )
          `;


        frame =
          requestAnimationFrame(animate);

      };


    stage.addEventListener(
      "pointermove",
      event => {

        const rect =
          stage.getBoundingClientRect();

        targetX =
          ((event.clientX - rect.left) / rect.width - .5);

        targetY =
          ((event.clientY - rect.top) / rect.height - .5);

        if(!frame){
          frame =
            requestAnimationFrame(animate);
        }

      }
    );


    stage.addEventListener(
      "pointerleave",
      () => {

        targetX = 0;
        targetY = 0;

      }
    );

  }


  /* =========================================
     GENTLE HERO FLOAT
  ========================================= */

  const heroCards =
    document.querySelectorAll(
      ".floating-card"
    );


  if(heroCards.length){

    heroCards.forEach(
      (card,index) => {

        const distance =
          index === 0 ? 7 : 10;

        const duration =
          index === 0 ? 4200 : 5000;

        card.animate(
          [
            {
              translate:
                "0 0"
            },
            {
              translate:
                `0 -${distance}px`
            },
            {
              translate:
                "0 0"
            }
          ],
          {
            duration,
            iterations:Infinity,
            easing:"ease-in-out"
          }
        );

      }
    );

  }


  /* =========================================
     INTERACTIVE CARD LIGHT
  ========================================= */

  document
    .querySelectorAll(
      ".request-card,.proposal-paper,.floating-card"
    )
    .forEach(card => {

      card.addEventListener(
        "pointerenter",
        () => {

          card.style.transition =
            "border-color .4s ease, box-shadow .5s ease";

        }
      );


      card.addEventListener(
        "pointermove",
        event => {

          if(!canHover) return;

          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;


          card.style.setProperty(
            "--mouse-x",
            `${x * 100}%`
          );

          card.style.setProperty(
            "--mouse-y",
            `${y * 100}%`
          );

        }
      );

    });


  /* =========================================
     BUTTON PRESS FEEDBACK
  ========================================= */

  document
    .querySelectorAll("button")
    .forEach(button => {

      button.addEventListener(
        "pointerdown",
        () => {

          button.style.setProperty(
            "--press-scale",
            ".975"
          );

        }
      );


      button.addEventListener(
        "pointerup",
        () => {

          button.style.removeProperty(
            "--press-scale"
          );

        }
      );


      button.addEventListener(
        "pointercancel",
        () => {

          button.style.removeProperty(
            "--press-scale"
          );

        }
      );

    });


  /* =========================================
     REVEAL OBSERVER
  ========================================= */

  const revealTargets =
    document.querySelectorAll(
      ".section-head,.request-card,.proposal-intro,.final-section"
    );


  if("IntersectionObserver" in window){

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if(
              entry.isIntersecting
            ){

              entry.target.style.opacity =
                "1";

              entry.target.style.transform =
                "translateY(0)";

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold:.08
        }
      );


    revealTargets.forEach(
      element => {

        element.style.opacity =
          "0";

        element.style.transform =
          "translateY(18px)";

        element.style.transition =
          "opacity .8s cubic-bezier(.2,.75,.2,1), transform .8s cubic-bezier(.2,.75,.2,1)";

        observer.observe(element);

      }
    );

  }


})();
