// app.js
// Flame Division Academy — Flame Language Trainer Dojo (Curriculum One)

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 Flame Language Trainer loaded");

  // =========================
  // TTS CORE
  // =========================
  const tts = {
    supported:
      "speechSynthesis" in window &&
      typeof window.SpeechSynthesisUtterance !== "undefined",
    synth: "speechSynthesis" in window ? window.speechSynthesis : null,
    currentUtterance: null,
  };

  console.log("🔊 TTS supported:", tts.supported);

  function speak(text) {
    if (!tts.supported || !text) return;
    try {
      if (tts.currentUtterance) {
        tts.synth.cancel();
        tts.currentUtterance = null;
      }
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        tts.currentUtterance = null;
      };
      utterance.onerror = (e) => {
        console.warn("TTS error:", e);
        tts.currentUtterance = null;
      };
      tts.currentUtterance = utterance;
      tts.synth.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  }

  function showTtsUnavailable(statusElement) {
    if (!statusElement) return;
    statusElement.textContent =
      "Voice mode is not available on this device or browser.";
  }

  // =========================
  // MODE SWITCHING
  // =========================
  const modeTabs = Array.from(document.querySelectorAll(".mode-tab"));
  const modePanels = Array.from(document.querySelectorAll(".mode-panel"));

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-target");
      if (!targetId) return;

      modeTabs.forEach((t) => t.classList.remove("active"));
      modePanels.forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // =========================
  // FOUNDATION TTS
  // =========================
  const foundationTextEl = document.getElementById("foundation-text");
  const foundationTtsBtn = document.getElementById("btn-foundation-tts");
  const foundationTtsStatus = document.getElementById("foundation-tts-status");

  if (foundationTtsStatus) {
    if (tts.supported) {
      foundationTtsStatus.textContent =
        "Voice engine detected. Tap “Read It To Me” to hear the foundation lesson.";
    } else {
      foundationTtsStatus.textContent =
        "Voice mode is not available on this device or browser.";
    }
  }

  if (foundationTtsBtn) {
    foundationTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(foundationTtsStatus);
        return;
      }
      const text = foundationTextEl ? foundationTextEl.innerText : "";
      if (!text.trim()) return;
      speak(text);
      if (foundationTtsStatus) {
        foundationTtsStatus.textContent = "Reading foundation lesson...";
      }
    });
  }

  // =========================
  // SYMBOL TRAINER
  // =========================
  const symbolDisplay = document.getElementById("symbol-display");
  const symbolLabel = document.getElementById("symbol-label");
  const symbolPrompt = document.getElementById("symbol-prompt");
  const symbolOptionsContainer = document.getElementById("symbol-options");
  const symbolFeedback = document.getElementById("symbol-feedback");
  const symbolScoreEl = document.getElementById("symbol-score");
  const symbolNextBtn = document.getElementById("btn-symbol-next");
  const symbolTtsBtn = document.getElementById("btn-symbol-tts");
  const symbolTtsStatus = document.getElementById("symbol-tts-status");

  const symbolCards = [
    {
      symbol: "🔥",
      label: "[INTENT]",
      role: "Intent / Goal",
      prompt:
        "🔥 marks structured intent — the focused signal of what you are actually trying to do.",
      options: [
        "Intent / Goal",
        "Boundary / Rule",
        "Context / Situation",
        "Action / Execution",
      ],
    },
    {
      symbol: "🧠",
      label: "[CONTEXT]",
      role: "Context / Situation",
      prompt:
        "🧠 represents context — who this applies to, and where the situation is happening.",
      options: [
        "Boundary / Rule",
        "Context / Situation",
        "Action / Execution",
        "Intent / Goal",
      ],
    },
    {
      symbol: "🛡️",
      label: "[BOUNDARY]",
      role: "Boundary / Rule",
      prompt:
        "🛡️ represents boundaries — the rules, ethics, and red lines that must not be crossed.",
      options: [
        "Action / Execution",
        "Context / Situation",
        "Boundary / Rule",
        "Intent / Goal",
      ],
    },
    {
      symbol: "⚙️",
      label: "[ACTION]",
      role: "Action / Execution",
      prompt:
        "⚙️ represents action — the steps you will actually take to carry out the intent safely.",
      options: [
        "Action / Execution",
        "Boundary / Rule",
        "Context / Situation",
        "Intent / Goal",
      ],
    },
  ];

  let symbolIndex = 0;
  let symbolCorrect = 0;
  let symbolAttempts = 0;

  function updateSymbolScore() {
    if (symbolScoreEl) {
      symbolScoreEl.textContent = `Score: ${symbolCorrect} / ${symbolAttempts}`;
    }
  }

  function disableSymbolOptions() {
    const buttons =
      symbolOptionsContainer &&
      symbolOptionsContainer.querySelectorAll(".symbol-option-btn");
    if (!buttons) return;
    buttons.forEach((btn) => {
      btn.classList.add("disabled");
      btn.disabled = true;
    });
  }

  function renderSymbolCard() {
    const card = symbolCards[symbolIndex];
    if (!card || !symbolDisplay || !symbolLabel || !symbolPrompt) return;

    symbolDisplay.textContent = card.symbol;
    symbolLabel.textContent = card.label;
    symbolPrompt.textContent =
      "What does this symbol represent in Flame Language training?";

    if (symbolFeedback) {
      symbolFeedback.textContent = "Select the correct role.";
      symbolFeedback.style.color = "";
    }

    if (symbolOptionsContainer) {
      symbolOptionsContainer.innerHTML = "";
      card.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "symbol-option-btn";
        btn.textContent = opt;

        btn.addEventListener("click", () => {
          if (btn.classList.contains("disabled")) return;

          symbolAttempts += 1;
          const correct = opt === card.role;
          if (correct) {
            symbolCorrect += 1;
            btn.classList.add("correct");
            if (symbolFeedback) {
              symbolFeedback.textContent =
                "Correct. Lock in that mapping and move to the next card when ready.";
              symbolFeedback.style.color = "#9af3c3";
            }
          } else {
            btn.classList.add("incorrect");
            if (symbolFeedback) {
              symbolFeedback.textContent = `Incorrect. Correct mapping: ${card.role}.`;
              symbolFeedback.style.color = "#ff9cae";
            }
            const buttons =
              symbolOptionsContainer.querySelectorAll(".symbol-option-btn");
            buttons.forEach((b) => {
              if (b.textContent === card.role) {
                b.classList.add("correct");
              }
            });
          }
          updateSymbolScore();
          disableSymbolOptions();
        });

        symbolOptionsContainer.appendChild(btn);
      });
    }
  }

  if (symbolNextBtn) {
    symbolNextBtn.addEventListener("click", () => {
      symbolIndex = (symbolIndex + 1) % symbolCards.length;
      renderSymbolCard();
    });
  }

  if (symbolTtsBtn) {
    symbolTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(symbolTtsStatus);
        return;
      }
      const card = symbolCards[symbolIndex];
      if (!card) return;
      const text = `${card.symbol} ${card.label}. ${card.prompt}`;
      speak(text);
      if (symbolTtsStatus) {
        symbolTtsStatus.textContent = "Reading current symbol card...";
      }
    });
  }

  if (!tts.supported && symbolTtsStatus) {
    symbolTtsStatus.textContent =
      "Voice mode is not available on this device or browser.";
  }

  renderSymbolCard();
  updateSymbolScore();

  // =========================
  // SENTENCE FORGE
  // =========================
  const plainInput = document.getElementById("plain-input");
  const structureBtn = document.getElementById("btn-structure");
  const flameOutput = document.getElementById("flame-output");
  const sentenceWarning = document.getElementById("sentence-warning");
  const sentenceTtsBtn = document.getElementById("btn-sentence-tts");
  const sentenceTtsStatus = document.getElementById("sentence-tts-status");
  const sentenceCopyBtn = document.getElementById("btn-sentence-copy");
  const sentenceCopyStatus = document.getElementById("sentence-copy-status");

  function buildStructuredSentence(raw) {
    const input = (raw || "").trim();
    if (!input) return "";

    let shortIntent = input;
    if (shortIntent.length > 140) {
      shortIntent = shortIntent.slice(0, 137) + "...";
    }

    const structured = `[INTENT] ${shortIntent} — [CONTEXT] Clearly state who this applies to and the environment you are operating in. — [BOUNDARY] No harm, no misuse, no manipulation, and full respect for ethical and legal limits. — [ACTION] Describe the concrete steps you will take to execute this safely and responsibly.`;
    return structured;
  }

  if (structureBtn) {
    structureBtn.addEventListener("click", () => {
      if (!plainInput || !flameOutput) return;
      const raw = plainInput.value.trim();
      if (!raw) {
        if (sentenceWarning) {
          sentenceWarning.textContent =
            "Write a plain sentence first. The dojo cannot structure a blank signal.";
        }
        return;
      }
      if (sentenceWarning) {
        sentenceWarning.textContent = "";
      }
      const structured = buildStructuredSentence(raw);
      flameOutput.readOnly = false;
      flameOutput.value = structured;
      flameOutput.readOnly = true;
    });
  }

  if (sentenceTtsBtn) {
    sentenceTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(sentenceTtsStatus);
        return;
      }
      if (!flameOutput || !flameOutput.value.trim()) {
        if (sentenceTtsStatus) {
          sentenceTtsStatus.textContent =
            "Nothing to read yet. Forge a structured sentence first.";
        }
        return;
      }
      speak(flameOutput.value);
      if (sentenceTtsStatus) {
        sentenceTtsStatus.textContent = "Reading structured Flame sentence...";
      }
    });
  }

  if (!tts.supported && sentenceTtsStatus) {
    sentenceTtsStatus.textContent =
      "Voice mode is not available on this device or browser.";
  }

  if (sentenceCopyBtn) {
    sentenceCopyBtn.addEventListener("click", () => {
      if (!flameOutput || !flameOutput.value.trim()) {
        if (sentenceCopyStatus) {
          sentenceCopyStatus.textContent =
            "Nothing to copy. Forge a structured sentence first.";
        }
        return;
      }
      const text = flameOutput.value;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            if (sentenceCopyStatus) {
              sentenceCopyStatus.textContent =
                "Structured sentence copied to clipboard.";
            }
          })
          .catch(() => {
            if (sentenceCopyStatus) {
              sentenceCopyStatus.textContent =
                "Unable to access clipboard. Select and copy manually.";
            }
          });
      } else if (sentenceCopyStatus) {
        sentenceCopyStatus.textContent =
          "Clipboard not supported. Select and copy manually.";
      }
    });
  }

  // =========================
  // ASSESSMENT DOJO
  // =========================
  const assessmentInput = document.getElementById("assessment-input");
  const runAssessmentBtn = document.getElementById("btn-run-assessment");
  const assessmentReportEl = document.getElementById("assessment-report");
  const copyReportBtn = document.getElementById("btn-copy-report");
  const copyReportStatus = document.getElementById("copy-report-status");
  const assessmentTtsBtn = document.getElementById("btn-assessment-tts");
  const assessmentTtsStatus = document.getElementById("assessment-tts-status");

  let lastAssessmentReport = "";

  const vagueWords = ["stuff", "things", "maybe", "kinda", "sort of", "sorta"];

  function countVagueWords(text) {
    if (!text) return 0;
    const lower = text.toLowerCase();
    let count = 0;
    vagueWords.forEach((w) => {
      const regex = new RegExp(`\\b${w.replace(" ", "\\s+")}\\b`, "g");
      const matches = lower.match(regex);
      if (matches) {
        count += matches.length;
      }
    });
    return count;
  }

  function extractSegment(full, tag, nextTagPositions) {
    const tagIndex = full.indexOf(tag);
    if (tagIndex === -1) return "";
    const start = tagIndex + tag.length;

    let end = full.length;
    nextTagPositions.forEach((pos) => {
      if (pos !== -1 && pos > start && pos < end) {
        end = pos;
      }
    });

    return full.slice(start, end).trim();
  }

  function categoryFromSegment(seg) {
    if (!seg || seg.length < 5) return "FAIL";
    const vagueCount = countVagueWords(seg);
    if (seg.length < 20 || vagueCount > 0) return "BORDERLINE";
    return "PASS";
  }

  function buildAssessmentReport(inputRaw) {
    const input = (inputRaw || "").trim();
    if (!input) {
      return {
        text:
          "Flame Language Assessment Report — Curriculum One\n\n" +
          "Overall Status: Not Ready\n\n" +
          "Hard Truth:\n" +
          "You submitted an empty signal. The dojo cannot assess what does not exist.\n\n" +
          "Correction Reps:\n" +
          "1. Write one complete Flame sentence using all four tags.\n" +
          "2. Make sure each section has at least one clear phrase.\n" +
          "3. Remove filler words like 'stuff' or 'things'.\n\n" +
          "Final Status: REJECTED – REVISE AND RESUBMIT",
        overall: "Not Ready",
      };
    }

    const positions = {
      intent: input.indexOf("[INTENT]"),
      context: input.indexOf("[CONTEXT]"),
      boundary: input.indexOf("[BOUNDARY]"),
      action: input.indexOf("[ACTION]"),
    };

    const allPositions = [
      positions.intent,
      positions.context,
      positions.boundary,
      positions.action,
    ];

    const intentSeg = extractSegment(input, "[INTENT]", allPositions);
    const contextSeg = extractSegment(input, "[CONTEXT]", allPositions);
    const boundarySeg = extractSegment(input, "[BOUNDARY]", allPositions);
    const actionSeg = extractSegment(input, "[ACTION]", allPositions);

    const hasAllTags =
      positions.intent !== -1 &&
      positions.context !== -1 &&
      positions.boundary !== -1 &&
      positions.action !== -1;

    const intentCat = categoryFromSegment(intentSeg);
    const contextCat = categoryFromSegment(contextSeg);
    const boundaryCat = categoryFromSegment(boundarySeg);
    const actionCat = categoryFromSegment(actionSeg);

    const totalVague =
      countVagueWords(intentSeg) +
      countVagueWords(contextSeg) +
      countVagueWords(boundarySeg) +
      countVagueWords(actionSeg);

    const categories = [intentCat, contextCat, boundaryCat, actionCat];
    const failCount = categories.filter((c) => c === "FAIL").length;
    const borderlineCount = categories.filter((c) => c === "BORDERLINE").length;

    let overall = "Borderline";
    let finalStatus = "PASS – CONTINUE TRAINING";
    let hardTruth = "";

    if (!hasAllTags || failCount >= 2) {
      overall = "Not Ready";
      finalStatus = "REJECTED – REVISE AND RESUBMIT";
      hardTruth =
        "Your sentence is missing critical structure. Every Flame sentence must include [INTENT], [CONTEXT], [BOUNDARY], and [ACTION] with real content, not placeholders.";
    } else if (
      hasAllTags &&
      failCount === 0 &&
      borderlineCount === 0 &&
      totalVague === 0
    ) {
      overall = "Strong";
      finalStatus = "PASS – CONTINUE TRAINING";
      hardTruth =
        "You are showing strong structural discipline. The next level is precision: refine each phrase until there is zero ambiguity.";
    } else {
      overall = "Borderline";
      finalStatus = "PASS – CONTINUE TRAINING";
      hardTruth =
        "You have the frame, but parts of your sentence are still vague or underpowered. The dojo requires sharper context and boundaries.";
    }

    const correctionReps = [];

    if (intentCat !== "PASS") {
      correctionReps.push(
        "Tighten your [INTENT] section — state one clear outcome, not a soft desire."
      );
    }
    if (contextCat !== "PASS") {
      correctionReps.push(
        "Upgrade your [CONTEXT] section — name who this applies to and where it operates."
      );
    }
    if (boundaryCat !== "PASS") {
      correctionReps.push(
        "Strengthen your [BOUNDARY] section — define what you will NOT allow, especially around harm and misuse."
      );
    }
    if (actionCat !== "PASS") {
      correctionReps.push(
        "Clarify your [ACTION] section — list concrete steps instead of vague intentions."
      );
    }
    if (correctionReps.length === 0) {
      correctionReps.push(
        "Run this sentence against a real scenario and adjust any phrase that could be misread by a human or an AI."
      );
    }
    while (correctionReps.length < 3) {
      correctionReps.push(
        "Cut every vague word (like 'stuff' or 'things') and replace it with a specific noun or action."
      );
    }

    const reportText =
      "Flame Language Assessment Report — Curriculum One\n\n" +
      `Submitted Flame Sentence:\n${input}\n\n` +
      `Overall Status: ${overall}\n\n` +
      "Categories:\n" +
      `- Intent Clarity: ${intentCat}\n` +
      `- Context Specificity: ${contextCat}\n` +
      `- Boundary Strength: ${boundaryCat}\n` +
      `- Action Precision: ${actionCat}\n\n` +
      "Hard Truth:\n" +
      hardTruth +
      "\n\n" +
      "Correction Reps:\n" +
      `1. ${correctionReps[0]}\n` +
      `2. ${correctionReps[1]}\n` +
      `3. ${correctionReps[2]}\n\n` +
      `Final Status: ${finalStatus}`;

    return { text: reportText, overall };
  }

  if (runAssessmentBtn) {
    runAssessmentBtn.addEventListener("click", () => {
      if (!assessmentInput || !assessmentReportEl) return;
      const raw = assessmentInput.value;
      const result = buildAssessmentReport(raw);
      lastAssessmentReport = result.text;
      assessmentReportEl.textContent = result.text;
      if (copyReportStatus) copyReportStatus.textContent = "";
      if (assessmentTtsStatus) assessmentTtsStatus.textContent = "";
    });
  }

  if (copyReportBtn) {
    copyReportBtn.addEventListener("click", () => {
      if (!lastAssessmentReport) {
        if (copyReportStatus) {
          copyReportStatus.textContent =
            "Run an assessment first. The dojo copies reports, not empty pages.";
        }
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(lastAssessmentReport)
          .then(() => {
            if (copyReportStatus) {
              copyReportStatus.textContent =
                "Assessment report copied to clipboard for instructor review.";
            }
          })
          .catch(() => {
            if (copyReportStatus) {
              copyReportStatus.textContent =
                "Unable to access clipboard. Select and copy the report manually.";
            }
          });
      } else if (copyReportStatus) {
        copyReportStatus.textContent =
          "Clipboard not supported. Select and copy the report manually.";
      }
    });
  }

  if (assessmentTtsBtn) {
    assessmentTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(assessmentTtsStatus);
        return;
      }
      if (!lastAssessmentReport) {
        if (assessmentTtsStatus) {
          assessmentTtsStatus.textContent =
            "Run an assessment first. The dojo reads reports after they exist.";
        }
        return;
      }
      speak(lastAssessmentReport);
      if (assessmentTtsStatus) {
        assessmentTtsStatus.textContent = "Reading assessment report...";
      }
    });
  }

  if (!tts.supported && assessmentTtsStatus) {
    assessmentTtsStatus.textContent =
      "Voice mode is not available on this device or browser.";
  }
});// app.js
// Flame Division Academy — Flame Language Trainer Dojo (Curriculum One)

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // TTS CORE
  // =========================
  const tts = {
    supported:
      "speechSynthesis" in window &&
      typeof window.SpeechSynthesisUtterance !== "undefined",
    synth: "speechSynthesis" in window ? window.speechSynthesis : null,
    currentUtterance: null,
  };

  function speak(text) {
    if (!tts.supported || !text) return;
    try {
      if (tts.currentUtterance) {
        tts.synth.cancel();
        tts.currentUtterance = null;
      }
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        tts.currentUtterance = null;
      };
      utterance.onerror = () => {
        tts.currentUtterance = null;
      };
      tts.currentUtterance = utterance;
      tts.synth.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  }

  function showTtsUnavailable(statusElement) {
    if (!statusElement) return;
    statusElement.textContent =
      "Voice mode is not available on this device or browser.";
  }

  // =========================
  // MODE SWITCHING
  // =========================
  const modeTabs = Array.from(document.querySelectorAll(".mode-tab"));
  const modePanels = Array.from(document.querySelectorAll(".mode-panel"));

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-target");
      if (!targetId) return;

      modeTabs.forEach((t) => t.classList.remove("active"));
      modePanels.forEach((panel) => panel.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // =========================
  // FOUNDATION TTS
  // =========================
  const foundationTextEl = document.getElementById("foundation-text");
  const foundationTtsBtn = document.getElementById("btn-foundation-tts");
  const foundationTtsStatus = document.getElementById("foundation-tts-status");

  if (foundationTtsBtn) {
    foundationTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(foundationTtsStatus);
        return;
      }
      const text = foundationTextEl ? foundationTextEl.innerText : "";
      speak(text);
      if (foundationTtsStatus) {
        foundationTtsStatus.textContent = "Reading foundation lesson...";
      }
    });
  }

  if (!tts.supported && foundationTtsStatus) {
    foundationTtsStatus.textContent =
      "Voice mode is not available on this device or browser.";
  }

  // =========================
  // SYMBOL TRAINER
  // =========================
  const symbolDisplay = document.getElementById("symbol-display");
  const symbolLabel = document.getElementById("symbol-label");
  const symbolPrompt = document.getElementById("symbol-prompt");
  const symbolOptionsContainer = document.getElementById("symbol-options");
  const symbolFeedback = document.getElementById("symbol-feedback");
  const symbolScoreEl = document.getElementById("symbol-score");
  const symbolNextBtn = document.getElementById("btn-symbol-next");
  const symbolTtsBtn = document.getElementById("btn-symbol-tts");
  const symbolTtsStatus = document.getElementById("symbol-tts-status");

  const symbolCards = [
    {
      symbol: "🔥",
      label: "[INTENT]",
      role: "Intent / Goal",
      prompt:
        "🔥 marks structured intent — the focused signal of what you are actually trying to do.",
      options: [
        "Intent / Goal",
        "Boundary / Rule",
        "Context / Situation",
        "Action / Execution",
      ],
    },
    {
      symbol: "🧠",
      label: "[CONTEXT]",
      role: "Context / Situation",
      prompt:
        "🧠 represents context — who this applies to, and where the situation is happening.",
      options: [
        "Boundary / Rule",
        "Context / Situation",
        "Action / Execution",
        "Intent / Goal",
      ],
    },
    {
      symbol: "🛡️",
      label: "[BOUNDARY]",
      role: "Boundary / Rule",
      prompt:
        "🛡️ represents boundaries — the rules, ethics, and red lines that must not be crossed.",
      options: [
        "Action / Execution",
        "Context / Situation",
        "Boundary / Rule",
        "Intent / Goal",
      ],
    },
    {
      symbol: "⚙️",
      label: "[ACTION]",
      role: "Action / Execution",
      prompt:
        "⚙️ represents action — the steps you will actually take to carry out the intent safely.",
      options: [
        "Action / Execution",
        "Boundary / Rule",
        "Context / Situation",
        "Intent / Goal",
      ],
    },
  ];

  let symbolIndex = 0;
  let symbolCorrect = 0;
  let symbolAttempts = 0;

  function updateSymbolScore() {
    if (symbolScoreEl) {
      symbolScoreEl.textContent = `Score: ${symbolCorrect} / ${symbolAttempts}`;
    }
  }

  function disableSymbolOptions() {
    const buttons =
      symbolOptionsContainer &&
      symbolOptionsContainer.querySelectorAll(".symbol-option-btn");
    if (!buttons) return;
    buttons.forEach((btn) => {
      btn.classList.add("disabled");
      btn.disabled = true;
    });
  }

  function renderSymbolCard() {
    const card = symbolCards[symbolIndex];
    if (!card || !symbolDisplay || !symbolLabel || !symbolPrompt) return;

    symbolDisplay.textContent = card.symbol;
    symbolLabel.textContent = card.label;
    symbolPrompt.textContent = "What does this symbol represent in Flame training?";

    if (symbolFeedback) {
      symbolFeedback.textContent = "Select the correct role.";
      symbolFeedback.style.color = "";
    }

    if (symbolOptionsContainer) {
      symbolOptionsContainer.innerHTML = "";
      card.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "symbol-option-btn";
        btn.textContent = opt;

        btn.addEventListener("click", () => {
          if (btn.classList.contains("disabled")) return;

          symbolAttempts += 1;
          let correct = opt === card.role;
          if (correct) {
            symbolCorrect += 1;
            btn.classList.add("correct");
            if (symbolFeedback) {
              symbolFeedback.textContent =
                "Correct. Lock in that mapping and move to the next card when ready.";
              symbolFeedback.style.color = "#9af3c3";
            }
          } else {
            btn.classList.add("incorrect");
            if (symbolFeedback) {
              symbolFeedback.textContent = `Incorrect. Correct mapping: ${card.role}.`;
              symbolFeedback.style.color = "#ff9cae";
            }
            // Highlight correct option
            const buttons =
              symbolOptionsContainer.querySelectorAll(".symbol-option-btn");
            buttons.forEach((b) => {
              if (b.textContent === card.role) {
                b.classList.add("correct");
              }
            });
          }
          updateSymbolScore();
          disableSymbolOptions();
        });

        symbolOptionsContainer.appendChild(btn);
      });
    }
  }

  if (symbolNextBtn) {
    symbolNextBtn.addEventListener("click", () => {
      symbolIndex = (symbolIndex + 1) % symbolCards.length;
      renderSymbolCard();
    });
  }

  if (symbolTtsBtn) {
    symbolTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(symbolTtsStatus);
        return;
      }
      const card = symbolCards[symbolIndex];
      if (!card) return;
      const text = `${card.symbol} ${card.label}. ${card.prompt}`;
      speak(text);
      if (symbolTtsStatus) {
        symbolTtsStatus.textContent = "Reading current symbol card...";
      }
    });
  }

  if (!tts.supported && symbolTtsStatus) {
    symbolTtsStatus.textContent =
      "Voice mode is not available on this device or browser.";
  }

  renderSymbolCard();
  updateSymbolScore();

  // =========================
  // SENTENCE FORGE
  // =========================
  const plainInput = document.getElementById("plain-input");
  const structureBtn = document.getElementById("btn-structure");
  const flameOutput = document.getElementById("flame-output");
  const sentenceWarning = document.getElementById("sentence-warning");
  const sentenceTtsBtn = document.getElementById("btn-sentence-tts");
  const sentenceTtsStatus = document.getElementById("sentence-tts-status");
  const sentenceCopyBtn = document.getElementById("btn-sentence-copy");
  const sentenceCopyStatus = document.getElementById("sentence-copy-status");

  function buildStructuredSentence(raw) {
    const input = (raw || "").trim();
    if (!input) return "";

    // Simple truncation to keep intent concise
    let shortIntent = input;
    if (shortIntent.length > 140) {
      shortIntent = shortIntent.slice(0, 137) + "...";
    }

    const structured = `[INTENT] ${shortIntent} — [CONTEXT] Clearly state who this applies to and the environment you are operating in. — [BOUNDARY] No harm, no misuse, no manipulation, and full respect for ethical and legal limits. — [ACTION] Describe the concrete steps you will take to execute this safely and responsibly.`;
    return structured;
  }

  if (structureBtn) {
    structureBtn.addEventListener("click", () => {
      if (!plainInput || !flameOutput) return;
      const raw = plainInput.value.trim();
      if (!raw) {
        if (sentenceWarning) {
          sentenceWarning.textContent =
            "Write a plain sentence first. The dojo cannot structure a blank signal.";
        }
        return;
      }
      if (sentenceWarning) {
        sentenceWarning.textContent = "";
      }
      const structured = buildStructuredSentence(raw);
      flameOutput.readOnly = false;
      flameOutput.value = structured;
      flameOutput.readOnly = true;
    });
  }

  if (sentenceTtsBtn) {
    sentenceTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(sentenceTtsStatus);
        return;
      }
      if (!flameOutput || !flameOutput.value.trim()) {
        if (sentenceTtsStatus) {
          sentenceTtsStatus.textContent =
            "Nothing to read yet. Forge a structured sentence first.";
        }
        return;
      }
      speak(flameOutput.value);
      if (sentenceTtsStatus) {
        sentenceTtsStatus.textContent = "Reading structured Flame sentence...";
      }
    });
  }

  if (!tts.supported && sentenceTtsStatus) {
    sentenceTtsStatus.textContent =
      "Voice mode is not available on this device or browser.";
  }

  if (sentenceCopyBtn) {
    sentenceCopyBtn.addEventListener("click", () => {
      if (!flameOutput || !flameOutput.value.trim()) {
        if (sentenceCopyStatus) {
          sentenceCopyStatus.textContent =
            "Nothing to copy. Forge a structured sentence first.";
        }
        return;
      }
      const text = flameOutput.value;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => {
            if (sentenceCopyStatus) {
              sentenceCopyStatus.textContent =
                "Structured sentence copied to clipboard.";
            }
          })
          .catch(() => {
            if (sentenceCopyStatus) {
              sentenceCopyStatus.textContent =
                "Unable to access clipboard. Select and copy manually.";
            }
          });
      } else {
        if (sentenceCopyStatus) {
          sentenceCopyStatus.textContent =
            "Clipboard not supported. Select and copy manually.";
        }
      }
    });
  }

  // =========================
  // ASSESSMENT DOJO
  // =========================
  const assessmentInput = document.getElementById("assessment-input");
  const runAssessmentBtn = document.getElementById("btn-run-assessment");
  const assessmentReportEl = document.getElementById("assessment-report");
  const copyReportBtn = document.getElementById("btn-copy-report");
  const copyReportStatus = document.getElementById("copy-report-status");
  const assessmentTtsBtn = document.getElementById("btn-assessment-tts");
  const assessmentTtsStatus = document.getElementById("assessment-tts-status");

  let lastAssessmentReport = "";

  const vagueWords = ["stuff", "things", "maybe", "kinda", "sort of", "sorta"];

  function countVagueWords(text) {
    if (!text) return 0;
    const lower = text.toLowerCase();
    let count = 0;
    vagueWords.forEach((w) => {
      const regex = new RegExp(`\\b${w.replace(" ", "\\s+")}\\b`, "g");
      const matches = lower.match(regex);
      if (matches) {
        count += matches.length;
      }
    });
    return count;
  }

  function extractSegment(full, tag, nextTagPositions) {
    const tagIndex = full.indexOf(tag);
    if (tagIndex === -1) return "";
    const start = tagIndex + tag.length;

    let end = full.length;
    nextTagPositions.forEach((pos) => {
      if (pos !== -1 && pos > start && pos < end) {
        end = pos;
      }
    });

    return full.slice(start, end).trim();
  }

  function categoryFromSegment(seg) {
    if (!seg || seg.length < 5) return "FAIL";
    const vagueCount = countVagueWords(seg);
    if (seg.length < 20 || vagueCount > 0) return "BORDERLINE";
    return "PASS";
  }

  function buildAssessmentReport(inputRaw) {
    const input = (inputRaw || "").trim();
    if (!input) {
      return {
        text:
          "Flame Language Assessment Report — Curriculum One\n\n" +
          "Overall Status: Not Ready\n\n" +
          "Hard Truth:\n" +
          "You submitted an empty signal. The dojo cannot assess what does not exist.\n\n" +
          "Correction Reps:\n" +
          "1. Write one complete Flame sentence using all four tags.\n" +
          "2. Make sure each section has at least one clear phrase.\n" +
          "3. Remove filler words like 'stuff' or 'things'.\n\n" +
          "Final Status: REJECTED – REVISE AND RESUBMIT",
        overall: "Not Ready",
      };
    }

    const positions = {
      intent: input.indexOf("[INTENT]"),
      context: input.indexOf("[CONTEXT]"),
      boundary: input.indexOf("[BOUNDARY]"),
      action: input.indexOf("[ACTION]"),
    };

    const allPositions = [
      positions.intent,
      positions.context,
      positions.boundary,
      positions.action,
    ];

    const intentSeg = extractSegment(input, "[INTENT]", allPositions);
    const contextSeg = extractSegment(input, "[CONTEXT]", allPositions);
    const boundarySeg = extractSegment(input, "[BOUNDARY]", allPositions);
    const actionSeg = extractSegment(input, "[ACTION]", allPositions);

    const hasAllTags =
      positions.intent !== -1 &&
      positions.context !== -1 &&
      positions.boundary !== -1 &&
      positions.action !== -1;

    const intentCat = categoryFromSegment(intentSeg);
    const contextCat = categoryFromSegment(contextSeg);
    const boundaryCat = categoryFromSegment(boundarySeg);
    const actionCat = categoryFromSegment(actionSeg);

    const totalVague =
      countVagueWords(intentSeg) +
      countVagueWords(contextSeg) +
      countVagueWords(boundarySeg) +
      countVagueWords(actionSeg);

    const categories = [intentCat, contextCat, boundaryCat, actionCat];
    const failCount = categories.filter((c) => c === "FAIL").length;
    const borderlineCount = categories.filter((c) => c === "BORDERLINE").length;

    let overall = "Borderline";
    let finalStatus = "PASS – CONTINUE TRAINING";
    let hardTruth = "";

    if (!hasAllTags || failCount >= 2) {
      overall = "Not Ready";
      finalStatus = "REJECTED – REVISE AND RESUBMIT";
      hardTruth =
        "Your sentence is missing critical structure. Every Flame sentence must include [INTENT], [CONTEXT], [BOUNDARY], and [ACTION] with real content, not placeholders.";
    } else if (
      hasAllTags &&
      failCount === 0 &&
      borderlineCount === 0 &&
      totalVague === 0
    ) {
      overall = "Strong";
      finalStatus = "PASS – CONTINUE TRAINING";
      hardTruth =
        "You are showing strong structural discipline. The next level is precision: refine each phrase until there is zero ambiguity.";
    } else {
      overall = "Borderline";
      finalStatus = "PASS – CONTINUE TRAINING";
      hardTruth =
        "You have the frame, but parts of your sentence are still vague or underpowered. The dojo requires sharper context and boundaries.";
    }

    const correctionReps = [];

    if (intentCat !== "PASS") {
      correctionReps.push(
        "Tighten your [INTENT] section — state one clear outcome, not a soft desire."
      );
    }
    if (contextCat !== "PASS") {
      correctionReps.push(
        "Upgrade your [CONTEXT] section — name who this applies to and where it operates."
      );
    }
    if (boundaryCat !== "PASS") {
      correctionReps.push(
        "Strengthen your [BOUNDARY] section — define what you will NOT allow, especially around harm and misuse."
      );
    }
    if (actionCat !== "PASS") {
      correctionReps.push(
        "Clarify your [ACTION] section — list concrete steps instead of vague intentions."
      );
    }
    if (correctionReps.length === 0) {
      correctionReps.push(
        "Run this sentence against a real scenario and adjust any phrase that could be misread by a human or an AI."
      );
    }
    while (correctionReps.length < 3) {
      correctionReps.push(
        "Cut every vague word (like 'stuff' or 'things') and replace it with a specific noun or action."
      );
    }

    const reportText =
      "Flame Language Assessment Report — Curriculum One\n\n" +
      `Submitted Flame Sentence:\n${input}\n\n` +
      `Overall Status: ${overall}\n\n` +
      "Categories:\n" +
      `- Intent Clarity: ${intentCat}\n` +
      `- Context Specificity: ${contextCat}\n` +
      `- Boundary Strength: ${boundaryCat}\n` +
      `- Action Precision: ${actionCat}\n\n` +
      "Hard Truth:\n" +
      hardTruth +
      "\n\n" +
      "Correction Reps:\n" +
      `1. ${correctionReps[0]}\n` +
      `2. ${correctionReps[1]}\n` +
      `3. ${correctionReps[2]}\n\n` +
      `Final Status: ${finalStatus}`;

    return { text: reportText, overall };
  }

  if (runAssessmentBtn) {
    runAssessmentBtn.addEventListener("click", () => {
      if (!assessmentInput || !assessmentReportEl) return;
      const raw = assessmentInput.value;
      const result = buildAssessmentReport(raw);
      lastAssessmentReport = result.text;
      assessmentReportEl.textContent = result.text;
      if (copyReportStatus) copyReportStatus.textContent = "";
      if (assessmentTtsStatus) assessmentTtsStatus.textContent = "";
    });
  }

  if (copyReportBtn) {
    copyReportBtn.addEventListener("click", () => {
      if (!lastAssessmentReport) {
        if (copyReportStatus) {
          copyReportStatus.textContent =
            "Run an assessment first. The dojo copies reports, not empty pages.";
        }
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(lastAssessmentReport)
          .then(() => {
            if (copyReportStatus) {
              copyReportStatus.textContent =
                "Assessment report copied to clipboard for instructor review.";
            }
          })
          .catch(() => {
            if (copyReportStatus) {
              copyReportStatus.textContent =
                "Unable to access clipboard. Select and copy the report manually.";
            }
          });
      } else if (copyReportStatus) {
        copyReportStatus.textContent =
          "Clipboard not supported. Select and copy the report manually.";
      }
    });
  }

  if (assessmentTtsBtn) {
    assessmentTtsBtn.addEventListener("click", () => {
      if (!tts.supported) {
        showTtsUnavailable(assessmentTtsStatus);
        return;
      }
      if (!lastAssessmentReport) {
        if (assessmentTtsStatus) {
          assessmentTtsStatus.textContent =
            "Run an assessment first. The dojo reads reports after they exist.";
        }
        return;
      }
      speak(lastAssessmentReport);
      if (assessmentTtsStatus) {
        assessmentTtsStatus.textContent = "Reading assessment report...";
      }
    });
  }

  if (!tts.supported && assessmentTtsStatus) {
    assessmentTtsStatus.textContent =
      "Voice mode is not available on this device or browser.";
  }
});
