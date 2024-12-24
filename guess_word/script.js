const words = {
      animals: [
        "elephant", "tiger", "giraffe", "kangaroo", "dolphin", "panda", "flamingo", 
        "cheetah", "hippopotamus", "rhinoceros", "zebra", "crocodile", "walrus", 
        "armadillo", "platypus", "otter", "hedgehog", "albatross", "jellyfish", 
        "woodpecker", "alligator", "bison", "lemur", "chinchilla", "goose", 
        "parrot", "falcon", "buffalo", "peacock", "pelican", "raven", "otter", 
        "mandrill", "vulture", "swan", "beetle", "jaguar", "bobcat", "lynx", 
        "piranha", "scorpion", "starfish", "pufferfish", "tarantula", "camel", 
        "mole", "raccoon", "moose", "bat", "rabbit", "armadillo", "skunk", 
        "beaver", "heron", "crow", "eagle", "goat", "sheep", "yak", "wolf"
      ],
      countries: [
        "germany", "canada", "argentina", "brazil", "japan", "italy", "france", 
        "portugal", "australia", "indonesia", "russia", "norway", "mexico", "sweden", 
        "poland", "ireland", "belgium", "finland", "austria", "philippines", "china", 
        "india", "unitedstates", "southkorea", "southafrica", "colombia", "spain", 
        "switzerland", "denmark", "hungary", "netherlands", "nigeria", "ukraine", 
        "algeria", "egpyt", "malaysia", "thailand", "chile", "peru", "newzealand", 
        "norway", "pakistan", "turkey", "poland", "morocco", "finland", "iran"
      ],
      fruits: [
        "pineapple", "strawberry", "blueberry", "watermelon", "pomegranate", "mango", 
        "banana", "kiwi", "coconut", "avocado", "dragonfruit", "lychee", "fig", 
        "papaya", "guava", "pear", "blackberry", "peach", "raspberry", "apricot", 
        "orange", "apple", "cherry", "plum", "grapefruit", "lemon", "lime", "melon", 
        "nectarine", "tangerine", "cantaloupe", "elderberry", "gooseberry", "passionfruit", 
        "longan", "soursop", "mulberry", "jackfruit", "starfruit", "loquat", "fig", 
        "grape", "mandarin", "date", "carambola", "kumquat", "pomelo", "custardapple"
      ],
      professions: [
        "engineer", "doctor", "teacher", "artist", "scientist", "architect", "musician", 
        "actor", "pilot", "chef", "nurse", "lawyer", "plumber", "carpenter", 
        "electrician", "mechanic", "photographer", "journalist", "firefighter", "dentist", 
        "nanny", "teacher", "farmer", "surgeon", "scientist", "technician", 
        "therapist", "carpenter", "barista", "optometrist", "nurse", "waiter", "manager", 
        "developer", "designer", "veterinarian", "journalist", "policeman", "fisherman", 
        "astronaut", "stockbroker", "translator", "receptionist", "researcher", "pilot", 
        "taxi", "lawyer", "investor", "banker", "consultant"
      ],
      sports: [
        "basketball", "cricket", "badminton", "football", "tennis", "volleyball", 
        "baseball", "rugby", "hockey", "golf", "swimming", "cycling", "skating", 
        "archery", "boxing", "skiing", "surfing", "wrestling", "karate", "judo", 
        "trackandfield", "mma", "lawnbowls", "hurdles", "icehockey", "americanfootball", 
        "chess", "pingpong", "skateboarding", "squash", "lacun", "motorcross", "yoga", 
        "fencing", "sailing", "wakesurf", "kitesurfing", "snowboarding", "bouldering"
      ]
    };

    let selectedWord = "";
    let selectedCategory = "";
    let guessedLetters = [];
    let wrongGuesses = 0;
    const maxWrongGuesses = 6;

    const wordContainer = document.getElementById("word-container");
    const lettersContainer = document.getElementById("letters-container");
    const status = document.getElementById("status");
    const categoryName = document.getElementById("category-name");
    const canvas = document.getElementById("hangman");
    const ctx = canvas.getContext("2d");

    // Start the game with random word
    function startGame() {
      guessedLetters = [];
      wrongGuesses = 0;

      // Randomly pick a category and word
      const categories = Object.keys(words);
      selectedCategory = categories[Math.floor(Math.random() * categories.length)];
      selectedWord = words[selectedCategory][Math.floor(Math.random() * words[selectedCategory].length)];

      categoryName.textContent = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      wordContainer.innerHTML = "_ ".repeat(selectedWord.length);
      status.textContent = "";
      lettersContainer.innerHTML = "";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw initial hangman base
      drawHangmanBase();

      // Create alphabet buttons
      for (let i = 65; i <= 90; i++) {
        const letterButton = document.createElement("div");
        letterButton.className = "letter";
        letterButton.textContent = String.fromCharCode(i);
        letterButton.addEventListener("click", () => handleGuess(letterButton.textContent.toLowerCase()));
        lettersContainer.appendChild(letterButton);
      }
    }

    function handleGuess(letter) {
      if (guessedLetters.includes(letter) || wrongGuesses >= maxWrongGuesses) return;

      guessedLetters.push(letter);

      if (selectedWord.includes(letter)) {
        updateWordDisplay();
        if (isWordGuessed()) {
          status.textContent = "🎉 Congratulations! You guessed the word!";
          disableAllLetters();
        }
      } else {
        wrongGuesses++;
        drawHangman(wrongGuesses);

        if (wrongGuesses >= maxWrongGuesses) {
          status.textContent = `💀 Game Over! The word was "${selectedWord}".`;
          disableAllLetters();
        }
      }
    }

    function updateWordDisplay() {
      let displayWord = "";
      for (const letter of selectedWord) {
        if (guessedLetters.includes(letter)) {
          displayWord += letter + " ";
        } else {
          displayWord += "_ ";
        }
      }
      wordContainer.textContent = displayWord.trim();
    }

    function isWordGuessed() {
      return selectedWord.split("").every(letter => guessedLetters.includes(letter));
    }

    function disableAllLetters() {
      const letterButtons = document.querySelectorAll(".letter");
      letterButtons.forEach(button => (button.style.pointerEvents = "none"));
    }

    function drawHangmanBase() {
      ctx.beginPath();
      ctx.moveTo(50, 280);
      ctx.lineTo(250, 280);
      ctx.moveTo(100, 280);
      ctx.lineTo(100, 50);
      ctx.lineTo(200, 50);
      ctx.lineTo(200, 80);
      ctx.stroke();
    }

    function drawHangman(stage) {
      switch (stage) {
        case 1: ctx.arc(200, 100, 20, 0, Math.PI * 2); ctx.stroke(); break; // Head
        case 2: ctx.moveTo(200, 120); ctx.lineTo(200, 200); ctx.stroke(); break; // Body
        case 3: ctx.moveTo(200, 140); ctx.lineTo(170, 170); ctx.stroke(); break; // Left arm
        case 4: ctx.moveTo(200, 140); ctx.lineTo(230, 170); ctx.stroke(); break; // Right arm
        case 5: ctx.moveTo(200, 200); ctx.lineTo(170, 250); ctx.stroke(); break; // Left leg
        case 6: ctx.moveTo(200, 200); ctx.lineTo(230, 250); ctx.stroke(); break; // Right leg
      }
    }

    // Start the game when the page loads
    startGame();