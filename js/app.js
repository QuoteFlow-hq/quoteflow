(() => {

  "use strict";


  /* =========================================
     DOM
  ========================================= */

  const $ =
    selector => document.querySelector(selector);

  const $$ =
    selector => [...document.querySelectorAll(selector)];


  const input =
    $("#clientRequest");

  const transformBtn =
    $("#transformBtn");

  const continueBtn =
    $("#continueBtn");

  const generateBtn =
    $("#generateBtn");

  const previewBtn =
    $("#previewBtn");

  const copyBtn =
    $("#copyBtn");

  const closePreview =
    $("#closePreview");

  const restartBtn =
    $("#restartBtn");

  const jumpDemo =
    $("#jumpDemo");

  const mobileTransform =
    $("#mobileTransform");


  const extractionSection =
    $("#extractionSection");

  const proposalSection =
    $("#proposalSection");

  const clientPreview =
    $("#clientPreview");


  const characterCount =
    $("#characterCount");

  const confidenceValue =
    $("#confidenceValue");

  const controlMessage =
    $("#controlMessage");

  const toast =
    $("#toast");

  const toastMessage =
    $("#toastMessage");


  const serviceInput =
    $("#serviceInput");

  const deliverablesInput =
    $("#deliverablesInput");

  const timelineInput =
    $("#timelineInput");

  const revisionsInput =
    $("#revisionsInput");

  const basePrice =
    $("#basePrice");


  const paperService =
    $("#paperService");

  const paperTimeline =
    $("#paperTimeline");

  const paperPrice =
    $("#paperPrice");

  const proposalTitle =
    $("#proposalTitle");

  const proposalSubtitle =
    $("#proposalSubtitle");

  const proposalLines =
    $("#proposalLines");

  const proposalDate =
    $("#proposalDate");


  const clientTitle =
    $("#clientTitle");

  const clientService =
    $("#clientService");

  const clientTimeline =
    $("#clientTimeline");

  const clientRevisions =
    $("#clientRevisions");

  const clientTotal =
    $("#clientTotal");


  let currentQuote = null;


  /* =========================================
     DEMO DATA
  ========================================= */

  const demoRequests =
    $$("[data-example]");


  /* =========================================
     TOAST
  ========================================= */

  function showToast(message){

    if(!toast || !toastMessage) return;

    toastMessage.textContent =
      message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer =
      setTimeout(() => {

        toast.classList.remove("show");

      },2300);

  }


  /* =========================================
     SCROLL
  ========================================= */

  function scrollToElement(element){

    if(!element) return;

    element.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });

  }


  /* =========================================
     SERVICE DETECTION
  ========================================= */

  function detectService(text){

    const rules = [

      [/logo|brand identity|branding/i,
        "Logo / Brand Identity"],

      [/instagram|social media|social post/i,
        "Social Media Content"],

      [/website|portfolio|landing page|web/i,
        "Website Design"],

      [/video|tiktok|reel|editing/i,
        "Video Editing"],

      [/copywriting|article|blog|content/i,
        "Content / Copywriting"],

      [/design|poster|flyer|graphic/i,
        "Graphic Design"]

    ];


    for(const [pattern,name] of rules){

      if(pattern.test(text)){
        return name;
      }

    }


    return "Creative Project";

  }


  /* =========================================
     DELIVERABLE EXTRACTION
  ========================================= */

  function extractDeliverables(text){

    const found = [];

    const patterns = [

      /(\d+)\s+(instagram\s+posts?)/i,

      /(\d+)\s+(posts?)/i,

      /(\d+)\s+(videos?)/i,

      /(\d+)\s+(pages?)/i,

      /(\d+)\s+(templates?)/i

    ];


    patterns.forEach(pattern => {

      const match =
        text.match(pattern);

      if(match){

        found.push(
          `${match[1]} ${match[2]}`
        );

      }

    });


    if(/logo/i.test(text)){
      found.unshift("Logo");
    }


    if(/portfolio website|website/i.test(text)){
      found.unshift("Website");
    }


    if(
      /video/i.test(text) &&
      !found.some(item => /video/i.test(item))
    ){
      found.push("Video editing");
    }


    return [
      ...new Set(found)
    ].join(" + ") ||
      "Defined project scope";

  }


  /* =========================================
     TIMELINE
  ========================================= */

  function extractTimeline(text){

    const match =
      text.match(
        /(\d+)\s*(day|days|week|weeks)/i
      );


    if(!match){
      return "5 days";
    }


    const value =
      Number(match[1]);

    const unit =
      match[2].toLowerCase();


    return `${value} ${unit}`;

  }


  /* =========================================
     REVISIONS
  ========================================= */

  function extractRevisions(text){

    const match =
      text.match(
        /(\d+)\s*(rounds?\s+of\s+|per\s+)?revisions?/i
      );


    if(!match){
      return "2 rounds";
    }


    const value =
      Number(match[1]);


    return `${value} round${value === 1 ? "" : "s"}`;

  }


  /* =========================================
     CONFIDENCE
  ========================================= */

  function calculateConfidence(text){

    let score = 45;


    if(
      detectService(text) !==
      "Creative Project"
    ){
      score += 20;
    }


    if(
      /\d+\s*(day|days|week|weeks)/i.test(text)
    ){
      score += 15;
    }


    if(/revision/i.test(text)){
      score += 10;
    }


    if(
      /\d+\s*(post|posts|video|videos|page|pages|template|templates)/i
        .test(text)
    ){
      score += 10;
    }


    return Math.min(score,99);

  }


  /* =========================================
     ANALYZE
  ========================================= */

  function analyzeRequest(text){

    const clean =
      text.trim();


    return {

      service:
        detectService(clean),

      deliverables:
        extractDeliverables(clean),

      timeline:
        extractTimeline(clean),

      revisions:
        extractRevisions(clean),

      confidence:
        calculateConfidence(clean)

    };

  }


  /* =========================================
     PRICE
  ========================================= */

  function calculateTotal(){

    const base =
      Number(basePrice?.value || 0);


    const deliverables =
      deliverablesInput?.value || "";


    let extras = 0;


    const countMatch =
      deliverables.match(/\d+/);


    if(countMatch){

      const count =
        Number(countMatch[0]);


      if(/post/i.test(deliverables)){

        extras +=
          Math.max(0,count - 1) * 15;

      }


      if(/video/i.test(deliverables)){

        extras +=
          Math.max(0,count - 1) * 35;

      }


      if(/page/i.test(deliverables)){

        extras +=
          Math.max(0,count - 1) * 30;

      }

    }


    return Math.max(
      0,
      base + extras
    );

  }


  /* =========================================
     SAFE TEXT
  ========================================= */

  function setText(element,value){

    if(element){

      element.textContent =
        value;

    }

  }


  /* =========================================
     EXTRACTION RENDER
  ========================================= */

  function renderExtraction(data){

    if(serviceInput)
      serviceInput.value =
        data.service;


    if(deliverablesInput)
      deliverablesInput.value =
        data.deliverables;


    if(timelineInput)
      timelineInput.value =
        data.timeline;


    if(revisionsInput)
      revisionsInput.value =
        data.revisions;


    setText(
      confidenceValue,
      `${data.confidence}%`
    );


    extractionSection?.classList.add(
      "active"
    );


    $$(".extract-card")
      .forEach((card,index) => {

        setTimeout(() => {

          card.classList.add(
            "active"
          );

        },index * 110);

      });

  }


  /* =========================================
     PROPOSAL
  ========================================= */

  function renderProposal(){

    const service =
      serviceInput?.value ||
      "Creative Project";


    const deliverables =
      deliverablesInput?.value ||
      "Defined project scope";


    const timeline =
      timelineInput?.value ||
      "5 days";


    const revisions =
      revisionsInput?.value ||
      "2 rounds";


    const total =
      calculateTotal();


    currentQuote = {

      service,
      deliverables,
      timeline,
      revisions,
      total

    };


    setText(
      paperService,
      service
    );


    setText(
      paperTimeline,
      timeline
    );


    setText(
      paperPrice,
      `$${total.toLocaleString()}`
    );


    setText(
      proposalTitle,
      service
    );


    setText(
      proposalSubtitle,
      `${deliverables} · ${revisions}`
    );


    if(proposalLines){

      const items = [

        ["Scope",deliverables],

        ["Timeline",timeline],

        ["Revisions",revisions]

      ];


      proposalLines.innerHTML =
        items.map(
          ([label,value]) => `

          <div class="paper-price-row">

            <p>${label}</p>

            <strong>${value}</strong>

          </div>

        `
        ).join("");

    }


    setText(
      proposalDate,
      new Date().toLocaleDateString(
        undefined,
        {
          month:"short",
          day:"numeric",
          year:"numeric"
        }
      )
    );


    proposalSection?.classList.add(
      "ready"
    );

  }


  /* =========================================
     BUTTON LOADING
  ========================================= */

  function setLoading(
    button,
    loadingText="Working…"
  ){

    if(!button){

      return () => {};

    }


    const original =
      button.innerHTML;


    button.disabled =
      true;


    button.innerHTML =
      `<span>${loadingText}</span>`;


    return () => {

      button.disabled =
        false;

      button.innerHTML =
        original;

    };

  }


  /* =========================================
     TRANSFORM
  ========================================= */

  async function transformRequest(){

    const text =
      input?.value.trim() || "";


    if(!text){

      showToast(
        "Paste a client request first."
      );

      input?.focus();

      return;

    }


    const restore =
      setLoading(
        transformBtn,
        "Reading request…"
      );


    await new Promise(
      resolve =>
        setTimeout(resolve,500)
    );


    const data =
      analyzeRequest(text);


    renderExtraction(data);


    restore();


    scrollToElement(
      extractionSection
    );


    showToast(
      "Request transformed."
    );

  }


  /* =========================================
     BUILD PROPOSAL
  ========================================= */

  async function buildProposal(){

    if(
      !serviceInput?.value ||
      serviceInput.value === "—"
    ){

      showToast(
        "Transform the request first."
      );

      return;

    }


    const restore =
      setLoading(
        continueBtn,
        "Building proposal…"
      );


    await new Promise(
      resolve =>
        setTimeout(resolve,450)
    );


    renderProposal();


    restore();


    scrollToElement(
      proposalSection
    );


    showToast(
      "Proposal ready."
    );

  }


  /* =========================================
     CLIENT VIEW
  ========================================= */

  async function generateClientView(){

    if(!currentQuote){

      renderProposal();

    }


    const restore =
      setLoading(
        generateBtn,
        "Preparing client view…"
      );


    await new Promise(
      resolve =>
        setTimeout(resolve,450)
    );


    populateClientView();


    clientPreview?.classList.add(
      "open"
    );


    clientPreview?.setAttribute(
      "aria-hidden",
      "false"
    );


    restore();


    showToast(
      "Client view generated."
    );

  }


  function populateClientView(){

    if(!currentQuote) return;


    setText(
      clientTitle,
      currentQuote.service
    );


    setText(
      clientService,
      currentQuote.service
    );


    setText(
      clientTimeline,
      currentQuote.timeline
    );


    setText(
      clientRevisions,
      currentQuote.revisions
    );


    setText(
      clientTotal,
      `$${currentQuote.total.toLocaleString()}`
    );

  }


  function openPreview(){

    if(!currentQuote){

      renderProposal();

    }


    populateClientView();


    clientPreview?.classList.add(
      "open"
    );


    clientPreview?.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function closeClientPreview(){

    clientPreview?.classList.remove(
      "open"
    );


    clientPreview?.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  /* =========================================
     SHARE LINK
  ========================================= */

  async function copyProposalLink(){

    if(!currentQuote){

      showToast(
        "Build a proposal first."
      );

      return;

    }


    const payload = {

      quote:currentQuote,

      source:"QuoteFlow",

      version:"validation"

    };


    const encoded =
      btoa(
        unescape(
          encodeURIComponent(
            JSON.stringify(payload)
          )
        )
      );


    const link =
      `${location.origin}${location.pathname}#proposal=${encoded}`;


    try{

      await navigator.clipboard.writeText(
        link
      );


      setText(
        controlMessage,
        "Share link copied to clipboard."
      );


      showToast(
        "Share link copied."
      );

    }catch{

      setText(
        controlMessage,
        link
      );


      showToast(
        "Link generated."
      );

    }

  }


  /* =========================================
     EXAMPLES
  ========================================= */

  function loadExample(button){

    const text =
      button.dataset.example || "";


    if(!input) return;


    input.value =
      text;


    updateCharacterCount();


    input.focus();


    showToast(
      "Example loaded."
    );

  }


  /* =========================================
     CHARACTER COUNT
  ========================================= */

  function updateCharacterCount(){

    if(!characterCount || !input)
      return;


    const count =
      input.value.length;


    characterCount.textContent =
      `${count} character${count === 1 ? "" : "s"}`;

  }


  /* =========================================
     RESTART
  ========================================= */

  function restart(){

    if(input)
      input.value = "";


    if(serviceInput)
      serviceInput.value = "—";


    if(deliverablesInput)
      deliverablesInput.value = "—";


    if(timelineInput)
      timelineInput.value = "—";


    if(revisionsInput)
      revisionsInput.value = "—";


    if(basePrice)
      basePrice.value = 80;


    currentQuote = null;


    extractionSection?.classList.remove(
      "active"
    );


    $$(".extract-card")
      .forEach(card =>
        card.classList.remove("active")
      );


    proposalSection?.classList.remove(
      "ready"
    );


    closeClientPreview();


    updateCharacterCount();


    window.scrollTo({
      top:0,
      behavior:"smooth"
    });


    showToast(
      "Ready for another quote."
    );

  }


  /* =========================================
     EVENTS
  ========================================= */

  transformBtn?.addEventListener(
    "click",
    transformRequest
  );


  mobileTransform?.addEventListener(
    "click",
    transformRequest
  );


  continueBtn?.addEventListener(
    "click",
    buildProposal
  );


  generateBtn?.addEventListener(
    "click",
    generateClientView
  );


  previewBtn?.addEventListener(
    "click",
    openPreview
  );


  copyBtn?.addEventListener(
    "click",
    copyProposalLink
  );


  closePreview?.addEventListener(
    "click",
    closeClientPreview
  );


  restartBtn?.addEventListener(
    "click",
    restart
  );


  jumpDemo?.addEventListener(
    "click",
    () => {

      scrollToElement(
        document.querySelector("#demo")
      );

    }
  );


  demoRequests.forEach(button => {

    button.addEventListener(
      "click",
      () => loadExample(button)
    );

  });


  input?.addEventListener(
    "input",
    updateCharacterCount
  );


  input?.addEventListener(
    "keydown",
    event => {

      if(
        (event.ctrlKey || event.metaKey) &&
        event.key === "Enter"
      ){

        event.preventDefault();

        transformRequest();

      }

    }
  );


  basePrice?.addEventListener(
    "input",
    () => {

      if(currentQuote){

        renderProposal();

      }

    }
  );


  [
    serviceInput,
    deliverablesInput,
    timelineInput,
    revisionsInput
  ]
  .filter(Boolean)
  .forEach(element => {

    element.addEventListener(
      "input",
      () => {

        if(currentQuote){

          renderProposal();

        }

      }
    );

  });


  clientPreview?.addEventListener(
    "click",
    event => {

      if(
        event.target === clientPreview
      ){

        closeClientPreview();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if(event.key === "Escape"){

        closeClientPreview();

      }

    }
  );


  /* =========================================
     INITIALIZATION
  ========================================= */

  updateCharacterCount();

})();
