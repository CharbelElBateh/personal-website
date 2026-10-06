/* Data + listing renderer for Work / Publishings / Projects */

window.WORK = [
  { id:"w1", title:"AI Engineer", org:"INMIND.AI", date:"Oct 2025 — Present", tags:["Agents","LLMs","R&D","Teaching"],
    summary:"Projects across the R&D division, from agentic product architecture to customer-support chatbots, alongside teaching at the INMIND academy.",
    bullets:["Worked on various projects, mainly in the R&D division.","Handled internal agentic product architecture and debugging.","Took customer-support chatbots from development to deployment.","Teach AI and data engineering at the INMIND academy."] },
  { id:"w2", title:"Lab Assistant", org:"Lebanese American University", date:"Sep 2025 — Dec 2025 · Sep 2026 — Present", tags:["Microelectronics","Digital testing","Synopsys EDA"],
    summary:"Assisting professors in Microelectronics and Testing for Digital Systems, using Synopsys EDA tools.",
    bullets:["Assist professors in Microelectronics and Testing for Digital Systems courses using Synopsys EDA tools.","Provide labs for students and support them through to completion."] },
  { id:"w3", title:"Software Engineer (part-time)", org:"MERAKI", date:"Feb 2025 — Aug 2025", tags:["Python","PHP","JavaScript"],
    summary:"Developed on-demand platforms using Python, PHP and JavaScript.",
    bullets:["Developed on-demand platforms using Python, PHP and JavaScript."] },
  { id:"w4", title:"R&D Vision Engineer", org:"BMW Group", date:"Aug 2024 — Dec 2024", tags:["Point clouds","Synthetic data","Isaac Sim","Omniverse"],
    summary:"3D point-cloud pipelines and synthetic-data augmentation built from BMW factory scans.",
    bullets:["Manipulated the SORDI.AI dataset and applied a range of augmentation methods to the synthetic data.","Contributed to pipelines that manipulate, process and create 3D point clouds from BMW factory scans.","Reviewed the literature on point-cloud processing for object detection, classification and semantic segmentation.","Used Isaac Sim (NVIDIA Omniverse) for scene scans, augmentation and point-cloud processing.","Developed and improved an NVIDIA Omniverse extension to create LiDARs and annotate real point clouds."] },
  { id:"w5", title:"Software Engineer", org:"Invigo", date:"Oct 2023 — Aug 2024", tags:["PHP","Vue.js","APIs"],
    summary:"Refactored legacy PHP and migrated telecom employee-activity platforms to a new Vue.js interface.",
    bullets:["Refactored legacy PHP code toward best practices and improved API request and response handling.","Migrated platforms that telecom companies use for employee activity tracking to a new Vue.js UI."] },
  { id:"w6", title:"Software Engineer Intern", org:"Invigo", date:"Jun 2023 — Aug 2023", tags:["Python","Dashboards","PHP"],
    summary:"Parsed server KPIs and errors, and built an interactive dashboard to analyse them.",
    bullets:["Implemented Python scripts to parse, clean and organise server KPIs and errors.","Designed and developed an interactive dashboard with jQuery, Bootstrap and PHP for data analysis."] },
  { id:"w7", title:"Software Engineer Intern", org:"Galactech.io", date:"May 2023 — Aug 2023", tags:["OpenAI API","Laravel","REST"],
    summary:"An AI-integrated API for businesses, and a full-stack site for Lebanese tourist locations.",
    bullets:["Designed and architected an AI-integrated API for businesses using the OpenAI API.","Implemented a full-stack Laravel website for Lebanese tourist locations using a RESTful API."] },
  { id:"w8", title:"Data Engineering Track", org:"INMIND.AI", date:"Jan 2023 — Mar 2023", tags:["Palantir Foundry","PySpark","SQL"],
    summary:"Completed the data engineering and app development track on Palantir Foundry.",
    bullets:["Completed the data engineering and app development track of Palantir Foundry.","Used Foundry apps including Code Repository, Workshop, Contour, Ontology Manager and Pipeline Builder.","Implemented solutions with PySpark, SQL, pandas, Power BI and Tableau."] }
];

window.PUBS = [
  { id:"p1", title:"Quantum State Preparation via Neural Network Encoding in Quantum Machine Learning", venue:"arXiv · Major revision, Physical Review Research", date:"Preprint", tags:["Quantum ML","Neural networks"],
    summary:"Preprint on arXiv; under major revision at Physical Review Research." },
  { id:"p2", title:"MIRA-Math: A Benchmark for Minimal Information Requesting and Mathematical Reasoning", venue:"arXiv · Submitting to Transactions of the ACL", date:"Preprint", tags:["LLMs","Benchmark","Reasoning"],
    summary:"Preprint on arXiv; being submitted to Transactions of the Association for Computational Linguistics." },
  { id:"p3", title:"KV caching", venue:"Forthcoming submission", date:"In preparation", tags:["LLMs","Inference"],
    summary:"A forthcoming submission related to KV caching." },
  { id:"p4", title:"Physics-informed neural networks for electronics", venue:"Forthcoming submission", date:"In preparation", tags:["PINNs","Electronics"],
    summary:"A forthcoming submission related to PINNs for electronics." }
];

window.PROJECTS = [
  { id:"pr1", title:"Oracle — a tiny local-first research assistant", org:"Open source · 2025", date:"2025", tags:["Rust","llama.cpp","Svelte"],
    summary:"A desktop research assistant that runs local models, indexes your own PDFs, and refuses to phone home.",
    bullets:["Rust core wrapping llama.cpp and a vector index.","Svelte desktop UI with a commonplace-book metaphor.","Footprint under 120MB."],
    embed:"github.com/charbelalbateh/oracle",
    close:"The project I use every morning." },
  { id:"pr2", title:"Meander — literate evaluation notebooks", org:"Open source · 2024", date:"2024", tags:["Eval","Python","Notebook"],
    summary:"Evaluation notebooks that read like essays — a Python kernel extension for telling the story of your evals.",
    bullets:["Inline-renders metric deltas as prose.","Exports to PDF with a citation appendix."],
    embed:"Meander · interactive demo",
    close:"Eval is writing. Write it that way." },
  { id:"pr3", title:"Stele — a static site generator for research lab pages", org:"Open source · 2023", date:"2023", tags:["SSG","TypeScript"],
    summary:"A static site generator tuned for academic labs — people, papers, reading groups, archival by default.",
    bullets:["Built in TypeScript, deploys to anything.","Zero JavaScript at runtime by default."],
    embed:"Stele · gallery of labs using it",
    close:"Paper sites should last a decade. This tries." },
  { id:"pr4", title:"Agora — a slow social reader for arXiv", org:"Weekend hack · 2023", date:"2023", tags:["arXiv","Reader","Weekend"],
    summary:"A reader for arXiv with one feature: you cannot scroll past an unread abstract. Read it or skip it.",
    bullets:["Enforces intent.","Keeps a private log of what I've read."],
    embed:"Agora · screenshot reel",
    close:"Tools that make me slower make me better." },
  { id:"pr5", title:"Hypatia — a study deck generator", org:"Weekend hack · 2022", date:"2022", tags:["Study","LLM","Weekend"],
    summary:"Turn a textbook chapter into an Anki deck worth reviewing.",
    bullets:["Local-only pipeline.","Quality-controls cards via a tiny rubric."],
    embed:"Hypatia · CLI demo",
    close:"The project that taught me to ship before I polish." }
];

function toRoman(n) {
  var map = [["M",1000],["CM",900],["D",500],["CD",400],["C",100],["XC",90],["L",50],["XL",40],["X",10],["IX",9],["V",5],["IV",4],["I",1]];
  var r = "";
  for (var i = 0; i < map.length; i++) { while (n >= map[i][1]) { r += map[i][0]; n -= map[i][1]; } }
  return r;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
  });
}

window.renderListing = function (mountId, data, modalMountId) {
  var root = document.getElementById(mountId);
  var modalRoot = document.getElementById(modalMountId);
  if (!root || !modalRoot) return;

  root.innerHTML = data.map(function (item, i) {
    return '<button class="listing-row reveal" data-id="' + item.id + '" aria-label="Open ' + escapeHtml(item.title) + '">' +
      '<div class="idx">' + toRoman(i + 1) + '</div>' +
      '<div class="title">' + escapeHtml(item.title) + '</div>' +
      '<div class="meta">' + escapeHtml(item.org || item.venue || "") + '</div>' +
      '<div class="date">' + escapeHtml(item.date) + '</div>' +
      '<div class="chevron" aria-hidden="true"><svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M1 5h14M11 1l4 4-4 4"/></svg></div></button>';
  }).join("");

  modalRoot.innerHTML = data.map(function (item) {
    return '<div class="modal-backdrop" id="modal-' + item.id + '" aria-hidden="true">' +
      '<div class="modal" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="mt-' + item.id + '">' +
        '<button class="modal-close" aria-label="Close" onclick="window.closeModal(this)">' +
          '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11"/></svg>' +
        '</button>' +
        '<h2 id="mt-' + item.id + '">' + escapeHtml(item.title) + '</h2>' +
        '<p class="modal-org">' + escapeHtml(item.org || item.venue || "") + '</p>' +
        '<div class="modal-meta">' + escapeHtml(item.date) + ' &nbsp;·&nbsp; ' + item.tags.map(escapeHtml).join(" · ") + '</div>' +
        '<div class="ornament" aria-hidden="true"><svg viewBox="0 0 80 16" fill="none" stroke="currentColor" stroke-width="0.8"><path d="M0 8h30M50 8h30"/><circle cx="40" cy="8" r="4"/><circle cx="40" cy="8" r="1.5" fill="currentColor"/></svg></div>' +
        '<p>' + escapeHtml(item.summary) + '</p>' +
        (item.bullets ? '<h3>Highlights</h3><ul>' + item.bullets.map(function(b){return '<li>'+escapeHtml(b)+'</li>';}).join("") + '</ul>' : "") +
        (item.embed ? '<div class="modal-embed">' + escapeHtml(item.embed) + '</div>' : "") +
        (item.close ? '<p class="modal-close-line">— ' + escapeHtml(item.close) + '</p>' : "") +
        '<div class="tags">' + item.tags.map(function(t){return '<span class="tag">'+escapeHtml(t)+'</span>';}).join("") + '</div>' +
      '</div></div>';
  }).join("");

  root.querySelectorAll(".listing-row").forEach(function (row) {
    row.addEventListener("click", function () { window.openModal("modal-" + row.dataset.id, row); });
  });
};
