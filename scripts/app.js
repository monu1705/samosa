(() => {
  const PAGE_KEY_MAP = {
    'index.html': 'home',
    'demo.html': 'demo',
    'templates.html': 'templates',
    'how-it-works.html': 'how',
    'about.html': 'about'
  };

  const ROLE_KEYWORDS = {
    general: ['collaboration', 'communication', 'leadership', 'results'],
    software: ['python', 'javascript', 'api', 'cloud', 'testing', 'deployment', 'agile', 'debugging'],
    product: ['roadmap', 'stakeholder', 'launch', 'metrics', 'user research', 'prioritization', 'backlog'],
    data: ['sql', 'dashboard', 'insights', 'data pipeline', 'tableau', 'analytics', 'hypothesis', 'forecast'],
    marketing: ['campaign', 'conversion', 'audience', 'seo', 'content', 'branding', 'analytics', 'growth']
  };

  const ROLE_VERBS = {
    general: ['Delivered', 'Championed', 'Elevated', 'Improved'],
    software: ['Built', 'Optimized', 'Engineered', 'Automated'],
    product: ['Launched', 'Prioritized', 'Orchestrated', 'Defined'],
    data: ['Analyzed', 'Modeled', 'Visualized', 'Quantified'],
    marketing: ['Executed', 'Amplified', 'Boosted', 'Strategized']
  };

  const ROLE_IMPACT_PHRASES = {
    general: 'to exceed expectations and strengthen team outcomes.',
    software: 'to ship reliable features and cut defects by 20%.',
    product: 'to drive roadmap outcomes and align stakeholders on priorities.',
    data: 'to surface insights that informed key decisions.',
    marketing: 'to grow campaign reach and lift conversions.'
  };

  const ACTION_VERBS = [
    'Achieved', 'Analyzed', 'Architected', 'Built', 'Coordinated', 'Delivered', 'Developed', 'Designed',
    'Drove', 'Enhanced', 'Executed', 'Implemented', 'Improved', 'Led', 'Optimized', 'Orchestrated',
    'Piloted', 'Resolved', 'Spearheaded'
  ];

  const WEAK_OPENERS = [/^responsible for/i, /^helped/i, /^worked on/i, /^tasked with/i, /^assisted/i];
  const COMMON_MISSPELLINGS = [/teh/i, /recieve/i, /adress/i, /enviroment/i];
  const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const PHONE_REGEX = /(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/;
  const URL_REGEX = /(https?:\/\/)?(www\.)?(linkedin\.com\/[A-Za-z0-9-_\/]+|github\.com\/[A-Za-z0-9-_\/]+)/i;
  const DATE_LONG_REGEX = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s?\d{4}\b/i;
  const DATE_NUMERIC_REGEX = /\b(0?[1-9]|1[0-2])[\/-](19|20)\d{2}\b/;

  const categoryLabels = {
    contact: 'Contact',
    structure: 'Structure',
    achievements: 'Impact & Metrics',
    language: 'Language & Clarity',
    keywords: 'Keywords',
    formatting: 'Formatting'
  };

  let issueCounter = 0;

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    setDynamicYear();
    const pageKey = document.body.dataset.page;

    if (pageKey === 'home') {
      initHeroTypewriter();
    }

    if (pageKey === 'demo') {
      initDemo();
    }
  });

  function initNav() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    const toggle = nav.querySelector('.nav-toggle');
    const list = nav.querySelector('.nav-list');
    const pageKey = document.body.dataset.page || '';

    nav.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      const mapped = PAGE_KEY_MAP[href];
      if (mapped && mapped === pageKey) {
        link.setAttribute('aria-current', 'page');
      }
    });

    if (toggle && list) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('open', !expanded);
      });

      document.addEventListener('click', event => {
        if (!nav.contains(event.target) && nav.classList.contains('open')) {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('open');
        }
      });
    }
  }

  function setDynamicYear() {
    const yearSpans = document.querySelectorAll('[data-year]');
    const year = new Date().getFullYear();
    yearSpans.forEach(span => {
      span.textContent = String(year);
    });
  }

  function initHeroTypewriter() {
    const loop = document.querySelector('.type-loop');
    if (!loop) return;

    let messages = [];
    try {
      messages = JSON.parse(loop.dataset.messages || '[]');
    } catch (error) {
      messages = [];
    }
    if (!messages.length) return;

    let messageIndex = 0;
    let charIndex = 0;
    let typing = true;

    const type = () => {
      const message = messages[messageIndex];
      if (typing) {
        loop.textContent = message.slice(0, charIndex);
        if (charIndex < message.length) {
          charIndex += 1;
          setTimeout(type, 60);
        } else {
          typing = false;
          setTimeout(type, 1500);
        }
      } else {
        if (charIndex > 0) {
          charIndex -= 1;
          loop.textContent = message.slice(0, charIndex);
          setTimeout(type, 30);
        } else {
          typing = true;
          messageIndex = (messageIndex + 1) % messages.length;
          setTimeout(type, 120);
        }
      }
    };

    type();
  }

  function initDemo() {
    const elements = {
      fileInput: document.getElementById('resume-file'),
      loadSample: document.getElementById('load-sample'),
      analyze: document.getElementById('analyze-btn'),
      clear: document.getElementById('clear-btn'),
      textarea: document.getElementById('resume-text'),
      status: document.getElementById('input-status'),
      targetRole: document.getElementById('target-role'),
      scoreValue: document.getElementById('score-value'),
      scorePill: document.getElementById('score-pill'),
      progressRing: document.querySelector('.progress-ring__value'),
      issueGroups: document.getElementById('issue-groups'),
      analysisStatus: document.getElementById('analysis-status'),
      analysisComplete: document.getElementById('analysis-complete'),
      fixedText: document.getElementById('fixed-text'),
      autoFix: document.getElementById('auto-fix-btn'),
      copy: document.getElementById('copy-btn'),
      download: document.getElementById('download-btn'),
      toast: document.getElementById('action-toast'),
      resultsPanel: document.querySelector('.results-panel')
    };

    const demoState = {
      role: 'general',
      originalLines: [],
      fixedLines: [],
      issueMap: new Map(),
      appliedSuggestions: new Set(),
      issues: [],
      score: 0,
      hasAnalyzed: false
    };

    if (elements.fileInput) {
      elements.fileInput.addEventListener('change', event => {
        handleFileUpload(event, elements, demoState);
      });
    }

    if (elements.loadSample) {
      elements.loadSample.addEventListener('click', () => {
        loadSampleResume(elements, demoState);
      });
    }

    if (elements.clear) {
      elements.clear.addEventListener('click', () => {
        elements.textarea.value = '';
        elements.fixedText.value = '';
        demoState.originalLines = [];
        demoState.fixedLines = [];
        demoState.issueMap.clear();
        demoState.appliedSuggestions.clear();
        demoState.hasAnalyzed = false;
        resetResults(elements);
        announceStatus(elements.status, 'Inputs cleared.');
      });
    }

    if (elements.targetRole) {
      elements.targetRole.addEventListener('change', event => {
        demoState.role = event.target.value;
      });
    }

    if (elements.analyze) {
      elements.analyze.addEventListener('click', () => {
        runAnalysis(elements, demoState);
      });
    }

    if (elements.autoFix) {
      elements.autoFix.addEventListener('click', () => {
        autoApplySuggestions(elements, demoState);
      });
    }

    if (elements.copy) {
      elements.copy.addEventListener('click', () => {
        copyFixedResume(elements, demoState);
      });
    }

    if (elements.download) {
      elements.download.addEventListener('click', () => {
        downloadFixedResume(elements, demoState);
      });
    }

    if (elements.issueGroups) {
      elements.issueGroups.addEventListener('click', event => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const issueId = button.dataset.issueId;
        const action = button.dataset.action;
        const card = elements.issueGroups.querySelector(`.issue-card[data-issue-id="${issueId}"]`);
        if (!issueId || !action || !card) return;

        if (action === 'toggle') {
          card.classList.toggle('show-suggestion');
          button.textContent = card.classList.contains('show-suggestion') ? 'Hide suggestion' : 'Show suggestion';
        } else if (action === 'apply') {
          applySuggestion(issueId, elements, demoState);
        }
      });
    }
  }

  function handleFileUpload(event, elements, demoState) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const extension = (file.name.split('.').pop() || '').toLowerCase();
    if (!['txt', 'md', 'text'].includes(extension)) {
      announceStatus(elements.status, 'Please upload a .txt or .md file for this demo.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      elements.textarea.value = reader.result;
      announceStatus(elements.status, `Loaded ${file.name}. Ready to analyze.`);
    };
    reader.onerror = () => {
      announceStatus(elements.status, 'There was a problem reading that file. Please try again.');
    };
    reader.readAsText(file);
  }

  function loadSampleResume(elements, demoState) {
    fetch('assets/sample-resume.txt')
      .then(response => response.text())
      .then(text => {
        elements.textarea.value = text;
        announceStatus(elements.status, 'Loaded sample resume. Customize it and click Analyze.');
        demoState.role = elements.targetRole.value;
      })
      .catch(() => {
        announceStatus(elements.status, 'Sample resume could not be loaded. Check file path.');
      });
  }

  function runAnalysis(elements, demoState) {
    if (!elements || !demoState) return;
    const text = elements.textarea.value.trim();
    if (!text) {
      announceStatus(elements.status, 'Add resume text or upload a file before analyzing.');
      return;
    }

    elements.analysisStatus.textContent = 'Running analysis...';
    elements.analysisComplete.style.display = 'none';
    removeExistingConfetti(elements.resultsPanel);

    setTimeout(() => {
      const role = elements.targetRole.value || 'general';
      const lines = text.split(/\r?\n/);
      const analysis = analyzeResume(text, lines, role);

      demoState.role = role;
      demoState.originalLines = lines.slice();
      demoState.fixedLines = lines.slice();
      demoState.issueMap.clear();
      demoState.appliedSuggestions.clear();
      demoState.issues = analysis.issues;
      demoState.score = analysis.score;
      demoState.hasAnalyzed = true;

      analysis.issues.forEach(issue => {
        demoState.issueMap.set(issue.id, issue);
      });

      updateScore(elements, analysis.score);
      renderIssues(elements, analysis.categories, demoState);
      renderFixedPreview(elements, demoState);
      updateAnalysisSummary(elements, analysis);

      if (analysis.issues.length === 0) {
        elements.analysisStatus.textContent = 'No red flags detected. Great job — still consider tailoring for your audience.';
      }

      elements.analysisComplete.style.display = 'block';
      sprinkleConfetti(elements.resultsPanel);
    }, 650);
  }

  function analyzeResume(text, lines, role) {
    const issues = [];

    const contactIssues = checkContactSection(text, lines);
    const structureIssues = checkStructure(text, lines);
    const bulletIssues = checkBullets(lines, role);
    const grammarIssues = checkGrammar(lines);
    const keywordIssues = checkKeywords(text, role);
    const formattingIssues = checkFormatting(lines);

    issues.push(...contactIssues, ...structureIssues, ...bulletIssues, ...grammarIssues, ...keywordIssues, ...formattingIssues);

    const score = calculateScore(issues);
    const categories = buildCategories(issues);

    return { score, issues, categories };
  }

  function checkContactSection(text, lines) {
    const issues = [];
    const trimmedLines = lines.map(line => line.trim());
    const firstNonEmptyIndex = trimmedLines.findIndex(line => line.length);
    const firstLine = firstNonEmptyIndex >= 0 ? trimmedLines[firstNonEmptyIndex] : '';

    if (!EMAIL_REGEX.test(text)) {
      issues.push(createIssue({
        category: 'contact',
        severity: 'high',
        message: 'Add a professional email address.',
        detail: 'Include a reachable, professional email address near the top of your resume.',
        suggestion: 'Add a line such as "Email: your.name@email.com".'
      }));
    }

    if (!PHONE_REGEX.test(text)) {
      issues.push(createIssue({
        category: 'contact',
        severity: 'medium',
        message: 'Phone number is missing.',
        detail: 'Most hiring teams expect a quick way to call you. Include a region-appropriate phone number.',
        suggestion: 'Add a phone line such as "(123) 456-7890".'
      }));
    }

    if (!URL_REGEX.test(text)) {
      issues.push(createIssue({
        category: 'contact',
        severity: 'info',
        message: 'Add a LinkedIn or GitHub link.',
        detail: 'Linking to a portfolio or profile boosts credibility and gives reviewers more context.',
        suggestion: 'Add "linkedin.com/in/yourname" or "github.com/yourname".'
      }));
    }

    if (firstLine && !/^[A-Z][a-z]+/.test(firstLine)) {
      issues.push(createIssue({
        category: 'contact',
        severity: 'info',
        message: 'Lead with your name.',
        detail: 'The first line should usually highlight your name in a standout format.',
        suggestion: 'Example: "Jordan Rivera — Product Manager".',
        lineIndex: firstNonEmptyIndex,
        replacement: firstLine ? capitalizeNameLine(firstLine) : undefined
      }));
    }

    return issues;
  }

  function checkStructure(text, lines) {
    const issues = [];
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const estimatedPages = wordCount / 500;

    if (estimatedPages > 1.2) {
      issues.push(createIssue({
        category: 'structure',
        severity: 'medium',
        message: 'Resume may exceed one page.',
        detail: `This resume is roughly ${wordCount} words (~${estimatedPages.toFixed(1)} pages). For early career roles, aim for one page.`,
        suggestion: 'Trim older experience or condense verbose sections into bullet points.'
      }));
    }

    const headings = ['experience', 'education', 'skills', 'projects'];
    const headingHits = headings.filter(heading => new RegExp(`\\b${heading}\\b`, 'i').test(text));

    if (headingHits.length <= 1) {
      issues.push(createIssue({
        category: 'structure',
        severity: 'info',
        message: 'Consider clearer section headings.',
        detail: 'Use familiar headings (Experience, Education, Skills, Projects) to help readers skim quickly.',
        suggestion: 'Add or emphasize standard headings using consistent styling.'
      }));
    }

    return issues;
  }

  function checkBullets(lines, role) {
    const issues = [];
    const bulletRegex = /^\s*([-*•])\s+/;
    const roleKey = ROLE_VERBS[role] ? role : 'general';

    lines.forEach((line, index) => {
      if (!bulletRegex.test(line)) return;

      const [, marker] = line.match(bulletRegex) || [];
      const content = line.replace(bulletRegex, '').trim();
      if (!content) return;

      const firstWord = content.split(/\s+/)[0] || '';
      const hasActionVerb = ACTION_VERBS.some(verb => firstWord.toLowerCase().startsWith(verb.toLowerCase()));
      const hasWeakOpener = WEAK_OPENERS.some(regex => regex.test(content));
      const hasMetric = /\d/.test(content);

      const needsUpgrade = !hasActionVerb || hasWeakOpener || !hasMetric;
      if (!needsUpgrade) return;

      const problemParts = [];
      if (!hasActionVerb) problemParts.push('add a stronger action verb');
      if (hasWeakOpener) problemParts.push('replace weak phrasing');
      if (!hasMetric) problemParts.push('include a measurable outcome');

      const message = `Strengthen bullet: “${truncate(content, 72)}”`;
      const detail = `Consider ${problemParts.join(', ')}.`;
      const suggestionText = generateBulletSuggestion(content, roleKey);
      const replacement = `${marker || '-'} ${suggestionText}`;

      const severity = !hasActionVerb && !hasMetric ? 'high' : 'medium';
      const meta = [];
      if (!hasActionVerb) meta.push('No action verb');
      if (!hasMetric) meta.push('Missing number');
      if (hasWeakOpener) meta.push('Weak opener');

      issues.push(createIssue({
        category: 'achievements',
        severity,
        message,
        detail,
        suggestion: suggestionText,
        lineIndex: index,
        replacement,
        meta
      }));
    });

    return issues;
  }

  function checkGrammar(lines) {
    const issues = [];

    lines.forEach((line, index) => {
      if (!line.trim()) return;

      if (line.includes('  ')) {
        issues.push(createIssue({
          category: 'language',
          severity: 'info',
          message: 'Remove repeated spaces.',
          detail: 'Repeated spaces can look like formatting errors. Replace double spaces with single spacing.',
          lineIndex: index,
          replacement: line.replace(/\s{2,}/g, ' ')
        }));
      }

      if (COMMON_MISSPELLINGS.some(regex => regex.test(line))) {
        issues.push(createIssue({
          category: 'language',
          severity: 'medium',
          message: 'Possible spelling issue detected.',
          detail: `Double-check wording in “${truncate(line.trim(), 60)}”.`,
          suggestion: 'Run a spell-check or read the sentence aloud to confirm.',
          lineIndex: index
        }));
      }

      const words = line.trim().split(/\s+/).length;
      if (words <= 4 && line.trim().length && !/^[-*•]/.test(line.trim())) {
        issues.push(createIssue({
          category: 'language',
          severity: 'info',
          message: 'Sentence fragment spotted.',
          detail: 'Ensure statements read as complete bullet points or merge with adjacent lines.',
          lineIndex: index
        }));
      }
    });

    return issues;
  }

  function checkKeywords(text, role) {
    const issues = [];
    const normalizedText = text.toLowerCase();
    const keywords = ROLE_KEYWORDS[role] || ROLE_KEYWORDS.general;

    const missing = keywords.filter(keyword => !normalizedText.includes(keyword.toLowerCase()));

    if (missing.length) {
      const topMissing = missing.slice(0, 4);
      issues.push(createIssue({
        category: 'keywords',
        severity: 'medium',
        message: 'Add more role-specific keywords.',
        detail: `Missing keywords: ${topMissing.join(', ')}.`,
        suggestion: 'Weave these terms into bullet points where they naturally fit.'
      }));
    }

    return issues;
  }

  function checkFormatting(lines) {
    const issues = [];
    const hasLongDates = lines.some(line => DATE_LONG_REGEX.test(line));
    const hasNumericDates = lines.some(line => DATE_NUMERIC_REGEX.test(line));

    if (hasLongDates && hasNumericDates) {
      issues.push(createIssue({
        category: 'formatting',
        severity: 'info',
        message: 'Align date formats.',
        detail: 'Detected both “Jan 2024” and “01/2024” styles. Pick one format and use it consistently.'
      }));
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (!/^[-*•]/.test(trimmed) && trimmed.length < 26 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
        issues.push(createIssue({
          category: 'formatting',
          severity: 'info',
          message: 'Avoid ALL CAPS headings.',
          detail: 'Title case is easier to read. Consider capitalizing each word instead of using all caps.',
          lineIndex: index,
          replacement: toTitleCase(trimmed.toLowerCase())
        }));
      }
    });

    return issues;
  }

  function calculateScore(issues) {
    if (!issues.length) return 100;
    const weights = { high: 12, medium: 8, info: 4 };
    let deduction = 0;
    issues.forEach(issue => {
      deduction += weights[issue.severity] || 5;
    });
    const score = Math.max(0, Math.min(100, 100 - deduction));
    return Math.round(score);
  }

  function buildCategories(issues) {
    const categories = {};

    Object.entries(categoryLabels).forEach(([key, label]) => {
      categories[key] = { label, issues: [] };
    });

    issues.forEach(issue => {
      if (!categories[issue.category]) {
        categories[issue.category] = { label: capitalizeWords(issue.category), issues: [] };
      }
      categories[issue.category].issues.push(issue);
    });

    Object.values(categories).forEach(category => {
      category.issues.sort((a, b) => severityRank(a.severity) - severityRank(b.severity));
    });

    return categories;
  }

  function renderIssues(elements, categories, demoState) {
    elements.issueGroups.innerHTML = '';
    const fragment = document.createDocumentFragment();

    Object.entries(categories).forEach(([key, category]) => {
      const group = document.createElement('section');
      group.className = 'issue-group';

      const heading = document.createElement('h3');
      heading.textContent = category.label;
      group.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'issue-list';

      if (!category.issues.length) {
        const successCard = document.createElement('article');
        successCard.className = 'issue-card success';
        successCard.innerHTML = `<div class="issue-title">No blockers in this area.</div><p>Everything looks tidy here. Keep refining other sections.</p>`;
        list.appendChild(successCard);
      } else {
        category.issues.forEach(issue => {
          const card = createIssueCard(issue, demoState);
          list.appendChild(card);
        });
      }

      group.appendChild(list);
      fragment.appendChild(group);
    });

    elements.issueGroups.appendChild(fragment);
  }

  function createIssueCard(issue, demoState) {
    const card = document.createElement('article');
    const classes = ['issue-card'];
    if (issue.severity === 'high') classes.push('warning');
    if (issue.severity === 'info') classes.push('info');
    if (demoState.appliedSuggestions.has(issue.id)) classes.push('applied');
    card.className = classes.join(' ');
    card.dataset.issueId = issue.id;

    const title = document.createElement('div');
    title.className = 'issue-title';
    title.textContent = issue.message;
    card.appendChild(title);

    if (issue.detail) {
      const detail = document.createElement('p');
      detail.textContent = issue.detail;
      card.appendChild(detail);
    }

    const metaItems = [];
    if (Array.isArray(issue.meta) && issue.meta.length) {
      metaItems.push(...issue.meta);
    }
    if (typeof issue.lineIndex === 'number') {
      metaItems.push(`Line ${issue.lineIndex + 1}`);
    }

    if (metaItems.length) {
      const meta = document.createElement('div');
      meta.className = 'issue-meta';
      meta.innerHTML = metaItems.map(item => `<span>${item}</span>`).join('');
      card.appendChild(meta);
    }

    const hasSuggestion = Boolean(issue.suggestion || issue.replacement);
    if (hasSuggestion) {
      const actions = document.createElement('div');
      actions.className = 'issue-actions';

      const toggle = document.createElement('button');
      toggle.className = 'btn ghost';
      toggle.type = 'button';
      toggle.dataset.action = 'toggle';
      toggle.dataset.issueId = issue.id;
      toggle.textContent = 'Show suggestion';
      actions.appendChild(toggle);

      const canApply = typeof issue.lineIndex === 'number' && typeof issue.replacement === 'string';
      if (canApply) {
        const apply = document.createElement('button');
        apply.className = 'btn secondary';
        apply.type = 'button';
        apply.dataset.action = 'apply';
        apply.dataset.issueId = issue.id;
        apply.textContent = demoState.appliedSuggestions.has(issue.id) ? 'Applied' : 'Apply suggestion';
        apply.disabled = demoState.appliedSuggestions.has(issue.id);
        actions.appendChild(apply);
      }

      card.appendChild(actions);

      const suggestion = document.createElement('div');
      suggestion.className = 'issue-suggestion';
      const suggestionText = issue.suggestion || issue.replacement;
      suggestion.innerHTML = `<strong>Try this rewrite:</strong><br>${escapeHtml(suggestionText)}`;
      card.appendChild(suggestion);
    }

    return card;
  }

  function renderFixedPreview(elements, demoState) {
    elements.fixedText.value = demoState.fixedLines.join('\n');
  }

  function updateScore(elements, score) {
    elements.scoreValue.textContent = String(score);
    elements.scorePill.classList.remove('good', 'ok', 'low');
    let strokeColor = 'var(--accent)';
    if (score >= 90) {
      elements.scorePill.textContent = 'Presentation-ready';
      elements.scorePill.classList.add('good');
    } else if (score >= 70) {
      elements.scorePill.textContent = 'Solid start';
      elements.scorePill.classList.add('ok');
      strokeColor = 'var(--warning)';
    } else {
      elements.scorePill.textContent = 'Needs polish';
      elements.scorePill.classList.add('low');
      strokeColor = 'var(--danger)';
    }

    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (score / 100) * circumference;
    elements.progressRing.style.strokeDasharray = circumference.toString();
    elements.progressRing.style.strokeDashoffset = offset.toString();
    elements.progressRing.style.stroke = strokeColor;
  }

  function updateAnalysisSummary(elements, analysis) {
    const { issues } = analysis;
    if (!issues.length) {
      elements.analysisStatus.textContent = 'Score is 100. No suggestions at this time — consider tailoring for each role.';
      return;
    }

    const byCategory = new Map();
    issues.forEach(issue => {
      const label = categoryLabels[issue.category] || capitalizeWords(issue.category);
      byCategory.set(label, (byCategory.get(label) || 0) + 1);
    });

    const summaries = Array.from(byCategory.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, count]) => `${count} ${label.toLowerCase()}`);

    const summaryText = `Found ${issues.length} improvement opportunities across ${summaries.join(', ')}.`;
    elements.analysisStatus.textContent = summaryText;
  }

  function applySuggestion(issueId, elements, demoState) {
    const issue = demoState.issueMap.get(issueId);
    if (!issue) return;
    if (demoState.appliedSuggestions.has(issueId)) return;
    if (typeof issue.lineIndex !== 'number' || typeof issue.replacement !== 'string') {
      announceStatus(elements.toast, 'This suggestion needs manual editing.');
      return;
    }

    demoState.fixedLines[issue.lineIndex] = issue.replacement;
    demoState.appliedSuggestions.add(issueId);
    renderFixedPreview(elements, demoState);
    updateIssueCardAppliedState(issueId, elements, demoState);
    announceStatus(elements.toast, 'Suggestion applied to the fixed version.');
  }

  function updateIssueCardAppliedState(issueId, elements, demoState) {
    const card = elements.issueGroups.querySelector(`.issue-card[data-issue-id="${issueId}"]`);
    if (!card) return;
    if (!demoState.appliedSuggestions.has(issueId)) return;
    card.classList.add('applied');
    const applyButton = card.querySelector('button[data-action="apply"]');
    if (applyButton) {
      applyButton.disabled = true;
      applyButton.textContent = 'Applied';
    }
  }

  function autoApplySuggestions(elements, demoState) {
    if (!demoState.hasAnalyzed) {
      announceStatus(elements.toast, 'Run the analysis first.');
      return;
    }

    let appliedCount = 0;
    demoState.issueMap.forEach(issue => {
      if (demoState.appliedSuggestions.has(issue.id)) return;
      if (typeof issue.lineIndex === 'number' && typeof issue.replacement === 'string') {
        demoState.fixedLines[issue.lineIndex] = issue.replacement;
        demoState.appliedSuggestions.add(issue.id);
        appliedCount += 1;
      }
    });

    if (appliedCount > 0) {
      renderFixedPreview(elements, demoState);
      demoState.issueMap.forEach(issue => updateIssueCardAppliedState(issue.id, elements, demoState));
      announceStatus(elements.toast, `Applied ${appliedCount} rewrite${appliedCount === 1 ? '' : 's'}.`);
    } else {
      announceStatus(elements.toast, 'No auto-applicable suggestions remaining.');
    }
  }

  function copyFixedResume(elements, demoState) {
    if (!demoState.hasAnalyzed) {
      announceStatus(elements.toast, 'Run analysis first to generate fixes.');
      return;
    }
    const text = demoState.fixedLines.join('\n');
    navigator.clipboard.writeText(text).then(
      () => announceStatus(elements.toast, 'Copied fixed resume to clipboard.'),
      () => announceStatus(elements.toast, 'Clipboard copy failed. Try selecting and copying manually.')
    );
  }

  function downloadFixedResume(elements, demoState) {
    if (!demoState.hasAnalyzed) {
      announceStatus(elements.toast, 'Run analysis first to generate fixes.');
      return;
    }
    const text = demoState.fixedLines.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume-fixed.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    announceStatus(elements.toast, 'Download started.');
  }

  function resetResults(elements) {
    elements.scoreValue.textContent = '--';
    elements.scorePill.textContent = 'Awaiting analysis';
    elements.scorePill.classList.remove('good', 'ok', 'low');
    elements.progressRing.style.strokeDashoffset = '439.6';
    elements.analysisStatus.textContent = 'Paste text and run analysis to see results.';
    elements.issueGroups.innerHTML = '';
    elements.analysisComplete.style.display = 'none';
    removeExistingConfetti(elements.resultsPanel);
  }

  function announceStatus(element, message) {
    if (!element) return;
    element.textContent = message;
  }

  function sprinkleConfetti(panel) {
    if (!panel) return;
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    const colors = ['var(--accent)', 'var(--success)', 'var(--warning)', 'var(--danger)'];
    for (let i = 0; i < 14; i += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 90 + 5}%`;
      piece.style.top = `${Math.random() * 20}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      confetti.appendChild(piece);
    }
    panel.style.position = 'relative';
    panel.appendChild(confetti);
    setTimeout(() => {
      confetti.remove();
    }, 1500);
  }

  function removeExistingConfetti(panel) {
    if (!panel) return;
    panel.querySelectorAll('.confetti').forEach(el => el.remove());
  }

  function createIssue({ category, severity, message, detail, suggestion, lineIndex, replacement, meta }) {
    issueCounter += 1;
    return {
      id: `issue-${issueCounter}`,
      category,
      severity,
      message,
      detail,
      suggestion,
      lineIndex,
      replacement,
      meta
    };
  }

  function capitalizeNameLine(line) {
    const cleaned = line.replace(/[-–—]+/, ' ');
    return cleaned.split(/\s+/)
      .map(segment => segment ? segment[0].toUpperCase() + segment.slice(1).toLowerCase() : '')
      .join(' ');
  }

  function generateBulletSuggestion(content, role) {
    const roleVerbs = ROLE_VERBS[role] || ROLE_VERBS.general;
    const verb = roleVerbs[Math.floor(Math.random() * roleVerbs.length)];
    const cleaned = content
      .replace(/^[-*•]\s*/g, '')
      .replace(/^(responsible for|helped|worked on|tasked with|assisted)\s*/i, '')
      .replace(/\.$/, '')
      .trim();

    const focusKeyword = (ROLE_KEYWORDS[role] || ROLE_KEYWORDS.general)[0] || 'results';
    const impactPhrase = ROLE_IMPACT_PHRASES[role] || ROLE_IMPACT_PHRASES.general;
    const metric = 'by ' + (Math.floor(Math.random() * 20) + 5) + '%';

    if (!cleaned) {
      return `${verb} high-impact initiatives focused on ${focusKeyword} ${impactPhrase}`;
    }

    return `${verb} ${cleaned} ${metric} ${impactPhrase}`.replace(/\s+/g, ' ');
  }

  function truncate(text, limit) {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit - 1)}…`;
  }

  function capitalizeWords(text) {
    return text.replace(/\b\w/g, char => char.toUpperCase());
  }

  function toTitleCase(text) {
    return text.replace(/\b\w+/g, word => word[0].toUpperCase() + word.slice(1).toLowerCase());
  }

  function severityRank(severity) {
    if (severity === 'high') return 0;
    if (severity === 'medium') return 1;
    return 2;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
})();

