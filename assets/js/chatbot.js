(function () {
  var sessionStorageKey = "emde_chatbot_session_id";
  var historyStorageKey = "emde_chatbot_history";
  var maxHistoryItems = 30;

  var root = document.getElementById("emde-chatbot");
  if (!root) {
    return;
  }

  var endpoint =
    root.getAttribute("data-endpoint") ||
    "https://chain-empirical-egomaniac.ngrok-free.dev/webhook/electrobol-chat";

  var toggleButton = document.getElementById("emde-chatbot-toggle");
  var panel = document.getElementById("emde-chatbot-panel");
  var closeButton = document.getElementById("emde-chatbot-close");
  var messages = document.getElementById("emde-chatbot-messages");
  var form = document.getElementById("emde-chatbot-form");
  var input = document.getElementById("emde-chatbot-input");
  var sendButton = document.getElementById("emde-chatbot-send");

  var history = loadHistory();
  var sessionId = getSessionId();

  renderHistory();

  toggleButton.addEventListener("click", function () {
    var willOpen = panel.hasAttribute("hidden");
    panel.toggleAttribute("hidden");
    toggleButton.setAttribute("aria-expanded", willOpen ? "true" : "false");
    if (willOpen) {
      input.focus();
      scrollMessagesToBottom();
    }
  });

  closeButton.addEventListener("click", function () {
    panel.setAttribute("hidden", "hidden");
    toggleButton.setAttribute("aria-expanded", "false");
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var message = input.value.trim();
    if (!message) {
      return;
    }

    input.value = "";
    pushMessage("user", message);
    setComposerDisabled(true);

    var typingNode = createMessageNode("bot", "Escribiendo...");
    typingNode.classList.add("emde-chatbot__message--typing");
    messages.appendChild(typingNode);
    scrollMessagesToBottom();

    sendToApi(message)
      .then(function (botReply) {
        typingNode.remove();
        pushMessage("bot", botReply || "No recibí respuesta del asistente.");
      })
      .catch(function () {
        typingNode.remove();
        pushMessage(
          "bot",
          "No pude conectarme con el asistente en este momento. Intenta de nuevo en unos segundos."
        );
      })
      .finally(function () {
        setComposerDisabled(false);
        input.focus();
      });
  });

  function sendToApi(message) {
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sessionId: sessionId,
        message: message
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("API error");
        }
        return response
          .json()
          .catch(function () {
            return "";
          });
      })
      .then(function (data) {
        return normalizeBotReply(data);
      });
  }

  function normalizeBotReply(payload) {
    if (typeof payload === "string") {
      return payload;
    }

    if (Array.isArray(payload)) {
      var parts = payload
        .map(function (item) {
          return normalizeBotReply(item);
        })
        .filter(Boolean);
      return parts.join("\n");
    }

    if (payload && typeof payload === "object") {
      var fields = ["reply", "response", "message", "text", "answer", "output"];
      for (var i = 0; i < fields.length; i += 1) {
        var value = payload[fields[i]];
        if (typeof value === "string" && value.trim()) {
          return value;
        }
      }

      if (payload.data) {
        return normalizeBotReply(payload.data);
      }

      try {
        return JSON.stringify(payload);
      } catch (error) {
        return "";
      }
    }

    return "";
  }

  function pushMessage(role, text) {
    var safeText = String(text || "").trim();
    if (!safeText) {
      return;
    }

    history.push({ role: role, text: safeText });
    if (history.length > maxHistoryItems) {
      history = history.slice(history.length - maxHistoryItems);
    }
    saveHistory();

    messages.appendChild(createMessageNode(role, safeText));
    scrollMessagesToBottom();
  }

  function createMessageNode(role, text) {
    var item = document.createElement("div");
    item.className =
      "emde-chatbot__message " +
      (role === "user"
        ? "emde-chatbot__message--user"
        : "emde-chatbot__message--bot");
    item.textContent = text;
    return item;
  }

  function renderHistory() {
    messages.innerHTML = "";

    if (!history.length) {
      messages.appendChild(
        createMessageNode(
          "bot",
          "Hola, soy tu asistente virtual. Estoy listo para ayudarte."
        )
      );
      return;
    }

    history.forEach(function (item) {
      messages.appendChild(createMessageNode(item.role, item.text));
    });
    scrollMessagesToBottom();
  }

  function setComposerDisabled(disabled) {
    input.disabled = disabled;
    sendButton.disabled = disabled;
  }

  function scrollMessagesToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function getSessionId() {
    var currentId = localStorage.getItem(sessionStorageKey);
    if (currentId) {
      return currentId;
    }

    var generated = createSessionId();
    localStorage.setItem(sessionStorageKey, generated);
    return generated;
  }

  function createSessionId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "session-" + window.crypto.randomUUID();
    }
    return "session-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);
  }

  function loadHistory() {
    try {
      var raw = localStorage.getItem(historyStorageKey);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(history));
    } catch (error) {
      // Ignore storage quota and private mode errors.
    }
  }
})();
