const defaultPortfolioData = {
  skills: [
    { title: "Networking", items: ["TCP/IP", "OSI Model", "DNS & DHCP", "VLANs", "Routing & Switching", "Troubleshooting", "Cisco Networking"] },
    { title: "Cybersecurity", items: ["Vulnerability Assessment", "Security Monitoring", "Incident Response", "Threat Analysis", "Security Documentation", "MITRE ATT&CK"] },
    { title: "Security tools", items: ["Wireshark", "Nmap", "Nessus", "Greenbone / OpenVAS", "Burp Suite", "Metasploit"] },
    { title: "Operating systems", items: ["Linux", "Ubuntu Server", "Windows", "SSH administration"] },
    { title: "Automation", items: ["Python", "Basic scripting", "Process automation", "Technical writing"] }
  ],
  projects: [
    {
      number: "01", title: "Greenbone Vulnerability Management Lab",
      description: "Deployment and configuration of GVM / OpenVAS on Ubuntu Server in a VMware virtualized environment.",
      technologies: ["Ubuntu Server", "GVM / OpenVAS", "PostgreSQL", "VMware", "SSH"],
      details: "A documented infrastructure lab covering Ubuntu preparation, dependencies, PostgreSQL, GVM components, service configuration, web interface setup, SSH administration, troubleshooting, and setup verification.",
      objective: "Build familiarity with vulnerability-management infrastructure and the operational steps needed to validate a working security platform.",
      skills: ["Linux administration", "Service verification", "Technical documentation"],
      status: "Documentation in progress"
    },
    {
      number: "02", title: "Network Security Lab",
      description: "A VMware-based networking and security laboratory for exploring architecture, connectivity, troubleshooting, and traffic analysis.",
      technologies: ["VMware Workstation", "Linux", "Windows", "Wireshark", "Nmap"],
      details: "A practical environment for working with virtual machines, IP addressing, connectivity checks, network troubleshooting, packet analysis, and foundational security concepts.",
      objective: "Create a repeatable environment for learning network behavior and documenting observations without overstating results.",
      skills: ["Network architecture", "Traffic analysis", "Troubleshooting"],
      status: "Active learning project"
    },
    {
      number: "03", title: "SOC Analyst Practice Lab",
      description: "A hands-on security operations laboratory for practicing monitoring, alert investigation, log analysis, documentation, and response workflows.",
      technologies: ["Linux", "Windows", "Wireshark", "SIEM concepts", "MITRE ATT&CK"],
      details: "A structured practice environment organized around detection, investigation, analysis, documentation, and response. Incidents and findings are only added when supported by lab evidence.",
      objective: "Develop disciplined security-operations habits and clear incident documentation through repeatable exercises.",
      skills: ["Log analysis", "Investigation workflow", "Incident documentation"],
      status: "Active learning project",
      url: "https://soc-analyst-toolkit.onrender.com"
    }
  ],
  documents: [
    { title: "GVM / OpenVAS Installation Guide", category: "Infrastructure · Coming soon", description: "A step-by-step record of the Ubuntu Server deployment and service verification process." },
    { title: "Network Lab Documentation", category: "Architecture · Coming soon", description: "Virtual network topology, addressing plan, connectivity checks, and observations." },
    { title: "Security Lab Reports", category: "Operations · Coming soon", description: "Structured reports for monitoring exercises, analysis, and incident documentation." }
  ]
};

async function loadPortfolioData() {
  try {
    const response = await fetch("content/portfolio.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Using bundled portfolio content.", error);
    return defaultPortfolioData;
  }
}

loadPortfolioData().then(portfolioData => {
  const skillGrid = document.querySelector("#skill-grid");
  skillGrid.innerHTML = portfolioData.skills.map(skill => `<article class="skill-card"><h3>${skill.title}</h3><ul>${skill.items.map(item => `<li>${item}</li>`).join("")}</ul></article>`).join("");
  const projectGrid = document.querySelector("#project-grid");
  projectGrid.innerHTML = portfolioData.projects.map(project => `<article class="project-card"><span class="project-number">${project.number} / PROJECT</span><h3>${project.title}</h3><p>${project.description}</p><div class="tech-list">${project.technologies.map(tech => `<span>${tech}</span>`).join("")}</div><button class="project-link" type="button" data-project="${project.number}">View project details ↗</button></article>`).join("");
  document.querySelector("#project-count").textContent = String(portfolioData.projects.length).padStart(2, "0");
  document.querySelector("#tech-count").textContent = `${portfolioData.skills.reduce((total, skill) => total + skill.items.length, 0)}+`;
  document.querySelector("#doc-count").textContent = String(portfolioData.documents.length).padStart(2, "0");
  document.querySelector("#document-grid").innerHTML = portfolioData.documents.map(document => `<article class="document-card"><span class="document-meta">${document.category}</span><h3>${document.title}</h3><p>${document.description}</p><a class="text-link" href="${document.url || "#contact"}">Request document ↗</a></article>`).join("");

  const modal = document.querySelector("#project-modal");
  const modalContent = document.querySelector("#modal-content");
  document.querySelectorAll("[data-project]").forEach(button => button.addEventListener("click", () => {
  const project = portfolioData.projects.find(item => item.number === button.dataset.project);
  modalContent.innerHTML = `<p class="modal-eyebrow">${project.number} / ${project.status}</p><h2>${project.title}</h2><p>${project.details}</p><h3>Objective</h3><p>${project.objective}</p><h3>Environment &amp; tools</h3><div class="tech-list">${project.technologies.map(tech => `<span>${tech}</span>`).join("")}</div><h3>Skills demonstrated</h3><ul>${project.skills.map(skill => `<li>${skill}</li>`).join("")}</ul>${project.url ? `<p><a class="button button-primary" href="${project.url}" target="_blank" rel="noopener noreferrer">Open live project ↗</a></p>` : ""}<p class="form-note">Detailed documentation and evidence will be linked here as they are published.</p>`;
  modal.showModal();
  }));
  document.querySelector(".modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", event => { if (event.target === modal) modal.close(); });
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.querySelector(".menu-icon").textContent = open ? "×" : "+";
});
navLinks.addEventListener("click", event => { if (event.target.matches("a")) navLinks.classList.remove("open"); });

document.querySelector("#contact-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = "samirchapagain10@gmail.com";
  const subject = encodeURIComponent(`Portfolio enquiry from ${form.get("name")}`);
  const body = encodeURIComponent(`Name: ${form.get("name")}\nEmail: ${form.get("email")}\n\n${form.get("message")}`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});
