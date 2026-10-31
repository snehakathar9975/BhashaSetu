
const input = document.getElementById("userInput");
const chat = document.getElementById("chatArea");
const statusText = document.getElementById("status");

let lastAnswer = "";

const knowledge = [
  {
    keywords: ["किसान", "शेतकरी", "pm kisan"],
    answer: "पीएम किसान सन्मान निधी योजनेअंतर्गत पात्र शेतकऱ्यांना दरवर्षी सहा हजार रुपये तीन हप्त्यांत दिले जातात. पात्रता आणि अधिक माहितीसाठी pmkisan.gov.in या अधिकृत संकेतस्थळाला भेट द्या."
  },
  {
    keywords: ["आयुष्मान", "आरोग्य", "उपचार", "health"],
    answer: "आयुष्मान भारत पीएम-जय योजनेअंतर्गत पात्र लाभार्थ्यांना नियमानुसार रुग्णालयीन उपचारांसाठी आरोग्य संरक्षण मिळते. पात्रता तपासण्यासाठी beneficiary.nha.gov.in या अधिकृत पोर्टलला भेट द्या."
  },
  {
    keywords: ["शिष्यवृत्ती", "शिक्षण", "scholarship"],
    answer: "महाराष्ट्रातील विविध शिष्यवृत्तींसाठी महाडीबीटी पोर्टलवर माहिती आणि अर्ज उपलब्ध आहेत. पात्रता, आवश्यक कागदपत्रे आणि अर्जाच्या तारखांसाठी mahadbt.maharashtra.gov.in तपासा."
  },
  {
    keywords: ["आधार", "aadhaar", "aadhar"],
    answer: "आधार कार्ड संबंधित सेवांसाठी myaadhaar.uidai.gov.in या अधिकृत संकेतस्थळाला भेट द्या. काही माहिती बदलण्यासाठी आधार सेवा केंद्रात जाणे आवश्यक असू शकते."
  },
  {
    keywords: ["नमस्कार", "हॅलो", "hello", "hi"],
    answer: "नमस्कार! मी भाषासेतू आहे. तुम्हाला पीएम किसान, आरोग्य योजना, शिष्यवृत्ती किंवा आधार सेवांबद्दल माहिती हवी आहे का?"
  }
];

function getAnswer(question) {
  const text = question.toLowerCase();

  for (const item of knowledge) {
    if (item.keywords.some(word => text.includes(word))) {
      return item.answer;
    }
  }

  return "तुमचा प्रश्न मिळाला आहे. या डेमोमध्ये पीएम किसान, आरोग्य योजना, शिष्यवृत्ती आणि आधार सेवा यांची माहिती उपलब्ध आहे. कृपया यापैकी एक विषय निवडा.";
}

function addMessage(message, sender) {
  const div = document.createElement("div");
  div.className = "message " + (
    sender === "user" ? "user-message" : "bot-message"
  );
  div.textContent = message;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendQuestion() {
  const question = input.value.trim();
  if (!question) {
    statusText.textContent = "कृपया प्रश्न लिहा किंवा बोला.";
    return;
  }

  addMessage(question, "user");
  input.value = "";

  lastAnswer = getAnswer(question);
  addMessage(lastAnswer, "bot");

  statusText.textContent = "उत्तर तयार आहे.";
  speakMarathi(lastAnswer);
}

function speakMarathi(text) {
  if (!("speechSynthesis" in window)) {
    statusText.textContent = "या ब्राउझरमध्ये आवाज सुविधा उपलब्ध नाही.";
    return;
  }

  speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "mr-IN";
  speech.rate = 0.9;
  speech.pitch = 1;

  const voices = speechSynthesis.getVoices();
  const marathiVoice = voices.find(v =>
    v.lang.toLowerCase().startsWith("mr")
  );

  if (marathiVoice) {
    speech.voice = marathiVoice;
  } else {
    statusText.textContent =
      "मराठी आवाज उपलब्ध नसल्यास उच्चार वेगळे असू शकतात.";
  }

  speechSynthesis.speak(speech);
}

function startListening() {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    statusText.textContent =
      "या ब्राउझरमध्ये माइक ओळख उपलब्ध नाही. प्रश्न टाइप करा.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "mr-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    statusText.textContent = "🎤 ऐकत आहे... मराठीत बोला.";
  };

  recognition.onresult = event => {
    input.value = event.results[0][0].transcript;
    statusText.textContent = "तुमचा प्रश्न ओळखला गेला.";
    sendQuestion();
  };

  recognition.onerror = event => {
    statusText.textContent =
      "माइक त्रुटी: " + event.error +
      ". कृपया परवानगी तपासा.";
  };

  try {
    recognition.start();
  } catch (error) {
    statusText.textContent = "माइक सुरू करता आला नाही.";
  }
}

document.getElementById("sendBtn")
  .addEventListener("click", sendQuestion);

document.getElementById("micBtn")
  .addEventListener("click", startListening);

document.getElementById("speakBtn")
  .addEventListener("click", () => {
    if (lastAnswer) speakMarathi(lastAnswer);
  });

document.getElementById("stopBtn")
  .addEventListener("click", () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  });

document.getElementById("clearBtn")
  .addEventListener("click", () => {
    chat.innerHTML = "";
    lastAnswer = "";
    addMessage(
      "नमस्कार! मी भाषासेतू आहे. तुम्हाला कशी मदत करू?",
      "bot"
    );
    statusText.textContent = "चॅट साफ करण्यात आला.";
  });

input.addEventListener("keydown", event => {
  if (event.key === "Enter") sendQuestion();
});

document.querySelectorAll(".scheme-card").forEach(card => {
  card.addEventListener("click", () => {
    input.value = card.dataset.question;
    document.getElementById("assistant")
      .scrollIntoView({ behavior: "smooth" });
    sendQuestion();
  });
});
