const QUESTIONS = {
  "18-24": {
    main_questions: {
      q1: {
        id: "q1",
        category: "Dreams",
        question:
          "What does your dream wedding look like — describe the very first image that comes to your mind?",
        type: "mcq",
        options: {
          A: "An outdoor garden ceremony with fairy lights & flowers everywhere",
          B: "A grand ballroom with chandeliers and a big celebration",
          C: "An intimate beach wedding with just close family & friends",
          D: "A quirky, themed wedding that's totally unique to us",
        },
      },
      q2: {
        id: "q2",
        category: "Love Language",
        question: "How do you most naturally show love?",
        type: "mcq",
        options: {
          A: "Words of affirmation — I say it out loud, often",
          B: "Acts of service — I show up and get things done",
          C: "Quality time — I give my full, undivided presence",
          D: "Physical touch or thoughtful gifts",
        },
      },
      q3: {
        id: "q3",
        category: "Firsts",
        question:
          'What memory from your relationship made you think, "this is the one I want to marry"?',
        type: "mcq",
        options: {
          A: "A quiet, ordinary moment that felt extraordinary",
          B: "When they supported me through something really hard",
          C: "A spontaneous adventure we went on together",
          D: "The way they looked at me and I just knew",
        },
      },
      q4: {
        id: "q4",
        category: "Planning",
        question:
          "Big celebration or intimate gathering — which feels more authentically you as a couple?",
        type: "mcq",
        options: {
          A: "Grand celebration — the more, the merrier",
          B: "Intimate gathering — only people who truly matter",
          C: "Medium-sized — a good mix of both worlds",
          D: "Elopement — just us and a witness",
        },
      },
      q5: {
        id: "q5",
        category: "Vision",
        question:
          "If your wedding had a color palette that reflected your relationship, what would you choose?",
        type: "mcq",
        options: {
          A: "Soft blush, ivory & gold — warm and romantic",
          B: "Vibrant marigold, fuchsia & teal — bold and joyful",
          C: "Sage green, terracotta & cream — earthy and grounded",
          D: "Deep burgundy, navy & silver — rich and timeless",
        },
      },
      q6: {
        id: "q6",
        category: "Family",
        question:
          "Whose wedding traditions from your family feel meaningful to carry into your own ceremony?",
        type: "mcq",
        options: {
          A: "My parents' — their wedding is my biggest inspiration",
          B: "A mix from both our families equally",
          C: "Mostly cultural or religious traditions we both value",
          D: "We'd rather create our own new traditions",
        },
      },
      q7: {
        id: "q7",
        category: "Vows",
        question:
          "Would you prefer to write your own vows, or use traditional ones?",
        type: "mcq",
        options: {
          A: "Fully written by us — personal and heartfelt",
          B: "Traditional vows — timeless and sacred",
          C: "Traditional base with a personal touch added",
          D: "Something completely unconventional and unique",
        },
      },
      q8: {
        id: "q8",
        category: "Future",
        question:
          "Where do you see your life together in five years — city, home, career, adventures?",
        type: "mcq",
        options: {
          A: "Settled in a cosy home, building our careers together",
          B: "Travelling and exploring the world freely",
          C: "Growing our family and putting down roots",
          D: "Building something of our own — a business or big dream",
        },
      },
    },
    bonus_questions: {
      b1: {
        id: "b1",
        category: "Budget",
        question:
          "What's the one element of your wedding you'd happily splurge on, no matter the cost?",
        type: "text",
      },
      b2: {
        id: "b2",
        category: "Music",
        question: "If your marriage were a movie genre, it would be…",
        type: "mcq",
        options: {
          A: "Romantic comedy — always laughing",
          B: "Epic adventure — never boring",
          C: "Heartfelt drama — deep & meaningful",
          D: "Feel-good musical — full of joy",
        },
      },
      b3: {
        id: "b3",
        category: "Connection",
        question:
          "What's one habit or ritual you want to create together as a married couple from day one?",
        type: "mcq",
        options: {
          A: "A morning routine we share every day",
          B: "A weekly date night, no matter what",
          C: "An annual trip just for the two of us",
          D: "A small nightly check-in before bed",
        },
      },
    },
  },
  "24-30": {
    main_questions: {
      q1: {
        id: "q1",
        category: "Identity",
        question:
          "How has your relationship shaped who you've become over the years you've been together?",
        type: "mcq",
        options: {
          A: "I've grown more confident and secure in myself",
          B: "I've become more patient, open, and empathetic",
          C: "I've found clarity about what truly matters in life",
          D: "I've become braver — we push each other to grow",
        },
      },
      q2: {
        id: "q2",
        category: "Love Language",
        question:
          "In your busiest seasons, how do you and your partner still make each other feel seen and prioritized?",
        type: "mcq",
        options: {
          A: "Leaving sweet notes or sending thoughtful texts",
          B: "Protecting at least one evening a week just for us",
          C: "Taking over each other's tasks without being asked",
          D: "A hug, a hand-hold — small physical reassurances",
        },
      },
      q3: {
        id: "q3",
        category: "Values",
        question:
          "What shared values do you want your marriage — and your wedding day — to reflect?",
        type: "mcq",
        options: {
          A: "Family first — togetherness above everything",
          B: "Adventure & growth — always evolving together",
          C: "Authenticity — being fully ourselves, always",
          D: "Gratitude & joy — celebrating life constantly",
        },
      },
      q4: {
        id: "q4",
        category: "Aesthetics",
        question: "What venue setting speaks to you for your wedding?",
        type: "mcq",
        options: {
          A: "A lush garden or open countryside",
          B: "An elegant ballroom or heritage venue",
          C: "A rooftop with city views at sunset",
          D: "A beachside or lakeside open-air setting",
        },
      },
      q5: {
        id: "q5",
        category: "Career & Life",
        question:
          "How do you plan to balance career ambitions with building your married life together?",
        type: "mcq",
        options: {
          A: "We actively cheer each other's careers on",
          B: "We've set clear boundaries around work & home time",
          C: "We're building something together professionally too",
          D: "We take it season by season and adapt as we go",
        },
      },
      q6: {
        id: "q6",
        category: "Conflict",
        question:
          "What's one area where you and your partner have learned to navigate disagreement with grace?",
        type: "mcq",
        options: {
          A: "Money and financial decisions",
          B: "Family expectations and boundaries",
          C: "Time management and priorities",
          D: "Big life decisions like moving or career changes",
        },
      },
      q7: {
        id: "q7",
        category: "Guest Experience",
        question: "What do you most want your guests to feel at your wedding?",
        type: "mcq",
        options: {
          A: "Pure romance — swept away by the love in the air",
          B: "Pure fun — dancing, laughing, celebrating all night",
          C: "Warmth & belonging — like one big family",
          D: "Moved & inspired — by our story and our vows",
        },
      },
      q8: {
        id: "q8",
        category: "Finances",
        question:
          "What was the most important conversation you had around your wedding budget?",
        type: "mcq",
        options: {
          A: "Deciding what we'd fund ourselves vs. accept help for",
          B: "Agreeing on where to splurge and where to save",
          C: "Aligning on guest list size to control costs",
          D: "Choosing experiences over things as our priority",
        },
      },
    },
    bonus_questions: {
      b1: {
        id: "b1",
        category: "Compatibility",
        question:
          "Describe your perfect Sunday morning as a married couple in one sentence.",
        type: "text",
      },
      b2: {
        id: "b2",
        category: "Milestone",
        question:
          "What chapter of your relationship are you closing as you step into marriage, and what are you opening?",
        type: "mcq",
        options: {
          A: "Closing the 'figuring it out' phase — opening stability",
          B: "Closing independence — opening true partnership",
          C: "Closing uncertainty — opening intentional commitment",
          D: "Closing dating life — opening a shared forever",
        },
      },
      b3: {
        id: "b3",
        category: "Marriage",
        question:
          "What does a thriving marriage look like to you in ten years?",
        type: "mcq",
        options: {
          A: "Still laughing daily and choosing each other consciously",
          B: "A home full of family, warmth, and shared memories",
          C: "Two people who've grown individually but stayed deeply connected",
          D: "A partnership that's adventurous, ambitious, and alive",
        },
      },
    },
  },
  "30-40": {
    main_questions: {
      q1: {
        id: "q1",
        category: "Wisdom",
        question:
          "What have past experiences — relationships, growth, or loss — taught you about what you truly need in a partner?",
        type: "mcq",
        options: {
          A: "Emotional safety — someone who makes me feel secure",
          B: "Deep respect — for who I am and what I value",
          C: "Shared vision — aligned on what life should look like",
          D: "Consistent presence — someone who truly shows up",
        },
      },
      q2: {
        id: "q2",
        category: "Love Language",
        question:
          "How has the way you give and receive love evolved over the years?",
        type: "mcq",
        options: {
          A: "I need less grand gestures, more steady consistency",
          B: "I've learned to ask for what I need instead of hinting",
          C: "Quality time means everything more than it used to",
          D: "I give love more freely now — with fewer conditions",
        },
      },
      q3: {
        id: "q3",
        category: "Authenticity",
        question:
          "What parts of a traditional wedding feel meaningful to keep, and what would you happily leave behind?",
        type: "mcq",
        options: {
          A: "Keep the ceremony rituals, ditch the performative extras",
          B: "Keep the celebration, skip anything that feels forced",
          C: "Keep family traditions, leave out anything that isn't us",
          D: "Redesign almost everything to reflect who we actually are",
        },
      },
      q4: {
        id: "q4",
        category: "Family",
        question:
          "If children are part of your family picture, how does your wedding planning account for them?",
        type: "mcq",
        options: {
          A: "They're in the ceremony — flower girls, ring bearers, involved",
          B: "They're guests — celebrated but not in the spotlight",
          C: "Child-free wedding, family celebrated in other ways",
          D: "We're building toward family — it shapes our whole vision",
        },
      },
      q5: {
        id: "q5",
        category: "Priorities",
        question:
          "With full lives already built, what are the top things that truly matter to you for your wedding day?",
        type: "mcq",
        options: {
          A: "The ceremony — the vows and the meaning behind them",
          B: "The people — surrounded by everyone we love",
          C: "The experience — a day that feels magical and personal",
          D: "The simplicity — no stress, just joy and presence",
        },
      },
      q6: {
        id: "q6",
        category: "Partnership",
        question:
          "How do you divide decision-making in your relationship — who leads what?",
        type: "mcq",
        options: {
          A: "We each have domains we naturally own and trust each other",
          B: "We decide everything together — full consensus always",
          C: "Whoever cares more about the decision leads it",
          D: "We're still figuring out our rhythm — it's a work in progress",
        },
      },
      q7: {
        id: "q7",
        category: "Community",
        question:
          "Who are the people who've shown up for you through life — and how do you want to honor them on this day?",
        type: "mcq",
        options: {
          A: "Give them a role — speeches, readings, walking me down",
          B: "Reserve front-row seats and make personal toasts",
          C: "A private thank-you moment or handwritten note on the day",
          D: "Just having them present is the greatest honour",
        },
      },
      q8: {
        id: "q8",
        category: "Design",
        question:
          "Describe the aesthetic mood of your wedding — what fits you?",
        type: "mcq",
        options: {
          A: "Timeless elegance — classic, refined, forever beautiful",
          B: "Rustic warmth — natural, cosy, deeply personal",
          C: "Modern & minimal — clean lines, intentional details",
          D: "Wildly personal — full of details only we would choose",
        },
      },
    },
    bonus_questions: {
      b1: {
        id: "b1",
        category: "Compatibility",
        question:
          "Describe your perfect Sunday morning as a married couple in one sentence.",
        type: "text",
      },
      b2: {
        id: "b2",
        category: "Meaning",
        question:
          "Is there a ritual, reading, or moment you want woven into your ceremony that carries deep personal meaning?",
        type: "mcq",
        options: {
          A: "A candle lighting or unity ritual",
          B: "A reading from a book or poem that defines us",
          C: "A moment of silence to honour those we've lost",
          D: "A personal surprise — a song, a letter, a gesture",
        },
      },
      b3: {
        id: "b3",
        category: "Legacy",
        question:
          "What do you want your marriage to model for the people around you?",
        type: "mcq",
        options: {
          A: "That love is a daily, active, chosen thing",
          B: "That two whole people can build something even greater",
          C: "That commitment and joy are not opposites",
          D: "That a strong partnership is the foundation of everything",
        },
      },
    },
  },
  "40-60": {
    main_questions: {
      q1: {
        id: "q1",
        category: "Gratitude",
        question:
          "What chapters of your life led you to this person, and what are you most grateful for in that journey?",
        type: "mcq",
        options: {
          A: "The hard seasons that taught me what I truly value",
          B: "The people and experiences that shaped my heart",
          C: "The patience I built by waiting for the right person",
          D: "Every twist — because it all led me here",
        },
      },
      q2: {
        id: "q2",
        category: "Love Language",
        question:
          "After years of living fully, what does feeling truly loved and cherished mean to you now?",
        type: "mcq",
        options: {
          A: "Being truly seen — known and accepted completely",
          B: "Consistent presence — someone who just shows up",
          C: "Deep conversation — being understood at my core",
          D: "Peaceful companionship — comfort without words",
        },
      },
      q3: {
        id: "q3",
        category: "Intentionality",
        question:
          "What does choosing marriage at this stage of life say about who you've become?",
        type: "mcq",
        options: {
          A: "That I know exactly who I am and what I want",
          B: "That love at any age is worth fully committing to",
          C: "That I've healed enough to open my heart completely",
          D: "That this person is worth building everything around",
        },
      },
      q4: {
        id: "q4",
        category: "Blended Families",
        question:
          "If children, stepchildren, or grandchildren are part of your world, how do you plan to involve and celebrate them?",
        type: "mcq",
        options: {
          A: "A dedicated role in the ceremony that honours them",
          B: "A special family unity ritual during the celebration",
          C: "A private family moment before or after the wedding",
          D: "Their presence alone is celebration enough",
        },
      },
      q5: {
        id: "q5",
        category: "Simplicity",
        question:
          "What does an ideal celebration look like when you strip away all expectation?",
        type: "mcq",
        options: {
          A: "A beautiful intimate dinner with the people I love most",
          B: "A destination celebration — somewhere meaningful to us",
          C: "A relaxed garden gathering, full of laughter and ease",
          D: "Something entirely private — just us and our commitment",
        },
      },
      q6: {
        id: "q6",
        category: "Healing",
        question:
          "Is there something in your past you've had to forgive — yourself or others — that has made this love more precious?",
        type: "mcq",
        options: {
          A: "A past relationship that taught me what I didn't want",
          B: "A version of myself I had to leave behind to grow",
          C: "A loss that reshaped how I hold the people I love",
          D: "A season of loneliness that made connection sacred",
        },
      },
      q7: {
        id: "q7",
        category: "Ceremony",
        question:
          "What elements of your ceremony feel sacred and non-negotiable?",
        type: "mcq",
        options: {
          A: "The vows — personal, honest, and deeply felt",
          B: "The witnesses — the right people present for this moment",
          C: "A spiritual or cultural ritual that anchors the ceremony",
          D: "The simplicity — nothing performative, only what's real",
        },
      },
      q8: {
        id: "q8",
        category: "Witnesses",
        question:
          "Who are the people who have witnessed your love story and need to be present to make it complete?",
        type: "mcq",
        options: {
          A: "My closest lifelong friends — the ones who've seen everything",
          B: "My children or family — their blessing means everything",
          C: "A small, carefully chosen circle of those who truly know us",
          D: "Just us — our love story is ours alone",
        },
      },
    },
    bonus_questions: {
      b1: {
        id: "b1",
        category: "Compatibility",
        question:
          "Describe your perfect Sunday morning as a married couple in one sentence.",
        type: "text",
      },
      b2: {
        id: "b2",
        category: "Wisdom to Share",
        question:
          "What's the most important thing you've learned about love that you'd want your wedding day to embody?",
        type: "mcq",
        options: {
          A: "That love is a choice made again every single day",
          B: "That true love is calm, steady, and deeply safe",
          C: "That vulnerability is the bravest and most beautiful act",
          D: "That love grows most in the ordinary, everyday moments",
        },
      },
      b3: {
        id: "b3",
        category: "New Beginnings",
        question:
          "What does this marriage open up for you that you haven't yet had?",
        type: "mcq",
        options: {
          A: "A sense of home I've always longed for",
          B: "A partner to build the next chapter fully with",
          C: "Permission to be completely, unapologetically myself",
          D: "Peace — the deep kind that comes from true belonging",
        },
      },
    },
  },
};

module.exports = { QUESTIONS };
