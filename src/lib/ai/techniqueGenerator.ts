import { generateId } from "@/lib/utils";
import type { Technique, Resource } from "@/types";

interface HobbyTechniques {
  techniques: Array<{
    name: string;
    description: string;
    whyItMatters: string;
    difficulty: number;
    youtubeQuery: string;
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctIndex: number;
    }>;
  }>;
}

const hobbyDatabase: Record<string, HobbyTechniques> = {
  swimming: {
    techniques: [
      {
        name: "Freestyle Breathing Technique",
        description: "Master bilateral breathing and rhythmic breath patterns to maintain stamina and efficiency in the water",
        whyItMatters: "Proper breathing prevents fatigue and allows you to swim longer distances without exhaustion",
        difficulty: 2,
        youtubeQuery: "freestyle swimming breathing technique tutorial beginner",
        quizQuestions: [
          { question: "How often should you breathe during freestyle?", options: ["Every stroke", "Every 2-3 strokes", "Only when tired", "Every 5-6 strokes"], correctIndex: 1 },
          { question: "Which side should you breathe on?", options: ["Only left", "Only right", "Alternate sides (bilateral)", "Doesn't matter"], correctIndex: 2 },
          { question: "When should you exhale?", options: ["Above water", "Underwater before turning head", "While turning head", "Hold breath throughout"], correctIndex: 1 },
        ],
      },
      {
        name: "Efficient Flutter Kick",
        description: "Develop a compact, fast flutter kick that provides propulsion without excessive energy expenditure",
        whyItMatters: "The kick accounts for about 10-15% of propulsion but can waste 50% of energy if done incorrectly",
        difficulty: 2,
        youtubeQuery: "flutter kick swimming technique drills",
        quizQuestions: [
          { question: "How deep should your kick be?", options: ["As deep as possible", "About 12-18 inches", "Just on the surface", "Depends on speed"], correctIndex: 1 },
          { question: "Where does the kick initiate from?", options: ["Knees", "Ankles", "Hips", "Feet"], correctIndex: 2 },
          { question: "Should your knees bend a lot during flutter kick?", options: ["Yes, fully bend", "Slight bend only", "No bending at all", "Only on the upkick"], correctIndex: 1 },
        ],
      },
      {
        name: "High Elbow Catch",
        description: "Position your elbow high during the catch phase to maximize water purchase and pulling power",
        whyItMatters: "This technique can improve your stroke efficiency by 20-30% and reduce shoulder strain",
        difficulty: 3,
        youtubeQuery: "high elbow catch freestyle swimming drill",
        quizQuestions: [
          { question: "What is the 'catch' in swimming?", options: ["Catching your breath", "The moment you grab the water", "Finishing the stroke", "Touching the wall"], correctIndex: 1 },
          { question: "Where should your elbow be during the catch?", options: ["Low, near your body", "High, above your hand", "Straight out", "Behind your head"], correctIndex: 1 },
          { question: "What shape should your arm make underwater?", options: ["Straight line", "S-curve", "Question mark", "Circle"], correctIndex: 2 },
        ],
      },
      {
        name: "Streamlined Body Position",
        description: "Maintain a horizontal, hydrodynamic body position to minimize drag and glide efficiently",
        whyItMatters: "Good body position can reduce drag by up to 50%, making swimming feel effortless",
        difficulty: 2,
        youtubeQuery: "swimming body position streamline drills",
        quizQuestions: [
          { question: "Where should you look while swimming freestyle?", options: ["Straight ahead", "At the ceiling", "Slightly down at the pool bottom", "At your hands"], correctIndex: 2 },
          { question: "What causes your legs to sink?", options: ["Heavy legs", "Lifting head too high", "Kicking too fast", "Swimming too slow"], correctIndex: 1 },
          { question: "How tight should your core be?", options: ["Completely relaxed", "Engaged but not rigid", "As tight as possible", "Only tight when breathing"], correctIndex: 1 },
        ],
      },
      {
        name: "Flip Turn Technique",
        description: "Execute smooth, fast flip turns to maintain momentum and reduce rest time at walls",
        whyItMatters: "A good flip turn can save 1-2 seconds per lap and keeps your heart rate consistent",
        difficulty: 4,
        youtubeQuery: "how to do flip turn swimming tutorial beginner",
        quizQuestions: [
          { question: "When should you start your flip?", options: ["At the wall", "About 1 arm length away", "2-3 feet from the wall", "When you see the T on the bottom"], correctIndex: 2 },
          { question: "Do you breathe during a flip turn?", options: ["Yes, take a big breath", "No, exhale through nose", "Hold your breath", "Breathe normally"], correctIndex: 1 },
          { question: "How should you push off the wall?", options: ["On your back", "On your stomach", "On your side, rotating to stomach", "Standing up"], correctIndex: 2 },
        ],
      },
      {
        name: "Treading Water",
        description: "Learn efficient treading techniques like eggbeater kick to stay afloat with minimal effort",
        whyItMatters: "Essential safety skill that builds confidence and allows you to rest in deep water",
        difficulty: 2,
        youtubeQuery: "treading water eggbeater kick tutorial",
        quizQuestions: [
          { question: "What is the eggbeater kick?", options: ["Kicking like a frog", "Alternating circular kicks", "Flutter kick while vertical", "Butterfly kick upside down"], correctIndex: 1 },
          { question: "What should your arms do while treading?", options: ["Stay still at sides", "Move in figure-8 patterns", "Wave above your head", "Push straight down"], correctIndex: 1 },
          { question: "Should your body be vertical or tilted?", options: ["Completely vertical", "Slightly leaned back", "Horizontal", "Leaned forward"], correctIndex: 1 },
        ],
      },
    ],
  },
  guitar: {
    techniques: [
      {
        name: "Basic Open Chords",
        description: "Master the essential open chords (G, C, D, Em, Am) that form the foundation of thousands of songs",
        whyItMatters: "These 5 chords appear in 90% of popular songs - master them and unlock a huge repertoire",
        difficulty: 2,
        youtubeQuery: "basic guitar chords for beginners G C D tutorial",
        quizQuestions: [
          { question: "Which fingers do you use for a G chord?", options: ["1, 2, 3", "2, 3, 4", "1, 2, 4", "All five"], correctIndex: 1 },
          { question: "How many strings do you strum for a C chord?", options: ["All 6", "Bottom 5 strings", "Top 4 strings", "Only 3 strings"], correctIndex: 1 },
          { question: "What does 'open chord' mean?", options: ["Playing with the case open", "Chords with open (unfretted) strings", "Chords in first position", "Easy chords"], correctIndex: 1 },
        ],
      },
      {
        name: "Smooth Chord Transitions",
        description: "Develop muscle memory for quick, clean transitions between common chord progressions",
        whyItMatters: "Seamless transitions separate beginners from intermediate players and make songs sound polished",
        difficulty: 3,
        youtubeQuery: "guitar chord transition exercises practice",
        quizQuestions: [
          { question: "What is an anchor finger?", options: ["The finger you never move", "A finger that stays in place between chords", "Your strongest finger", "The first finger you place"], correctIndex: 1 },
          { question: "How should you practice transitions?", options: ["As fast as possible", "Slowly with a metronome", "Only the ones you like", "Skip them and learn songs"], correctIndex: 1 },
          { question: "What's a pivot finger?", options: ["The finger that moves first", "A finger that stays on the same string", "The finger you rotate around", "The middle finger"], correctIndex: 2 },
        ],
      },
      {
        name: "Strumming Patterns",
        description: "Learn essential down-up strumming patterns and develop consistent rhythm and timing",
        whyItMatters: "Good rhythm is what makes music musical - even simple chords sound great with solid strumming",
        difficulty: 2,
        youtubeQuery: "guitar strumming patterns for beginners down up",
        quizQuestions: [
          { question: "What is a downstroke?", options: ["Strumming toward the floor", "Strumming toward the ceiling", "Picking one string", "Muting the strings"], correctIndex: 0 },
          { question: "In 4/4 time, where are the downbeats?", options: ["1, 2, 3, 4", "1 and 3 only", "2 and 4 only", "Every half beat"], correctIndex: 0 },
          { question: "How do you keep time while strumming?", options: ["Count in your head", "Tap your foot", "Use a metronome", "All of the above"], correctIndex: 3 },
        ],
      },
      {
        name: "Fingerpicking Basics",
        description: "Learn thumb-and-finger independence for beautiful arpeggiated patterns",
        whyItMatters: "Fingerpicking opens up folk, classical, and fingerstyle genres and adds variety to your playing",
        difficulty: 3,
        youtubeQuery: "fingerpicking guitar tutorial beginner patterns",
        quizQuestions: [
          { question: "Which fingers are used for fingerpicking?", options: ["Thumb only", "Thumb, index, middle", "Thumb, index, middle, ring", "All five fingers"], correctIndex: 2 },
          { question: "What does PIMA stand for?", options: ["Pick It, Move Around", "Pulgar, Indice, Medio, Anular", "Position In Music Always", "Play In Multiple Areas"], correctIndex: 1 },
          { question: "What strings does the thumb typically play?", options: ["High strings (1-3)", "Low bass strings (4-6)", "Only the 6th string", "All strings"], correctIndex: 1 },
        ],
      },
      {
        name: "Barre Chords",
        description: "Master the F and Bm barre chord shapes that unlock playing in any key",
        whyItMatters: "Barre chords let you play any chord anywhere on the neck - essential for playing with others",
        difficulty: 4,
        youtubeQuery: "how to play barre chords guitar F chord tutorial",
        quizQuestions: [
          { question: "What is a barre chord?", options: ["A chord in a bar", "Using one finger across multiple strings", "A chord with no open strings", "Both B and C"], correctIndex: 3 },
          { question: "Why do barre chords hurt at first?", options: ["Wrong technique", "Finger strength building", "Guitar is broken", "You're doing it wrong"], correctIndex: 1 },
          { question: "Where should the barring finger press?", options: ["In the middle of the fret", "Close to the fret wire", "On top of the fret wire", "Anywhere works"], correctIndex: 1 },
        ],
      },
      {
        name: "Reading Tablature",
        description: "Understand guitar tabs to learn any song without reading traditional sheet music",
        whyItMatters: "Tabs let you learn thousands of songs online - it's the universal language of guitar players",
        difficulty: 1,
        youtubeQuery: "how to read guitar tabs tutorial beginner",
        quizQuestions: [
          { question: "What do the 6 lines in tab represent?", options: ["Music staff", "Guitar strings", "Fret numbers", "Finger positions"], correctIndex: 1 },
          { question: "What does a '0' in tab mean?", options: ["Don't play that string", "Open string", "10th fret", "Muted string"], correctIndex: 1 },
          { question: "Which line represents the high E string?", options: ["Top line", "Bottom line", "Middle line", "Depends on the tab"], correctIndex: 0 },
        ],
      },
    ],
  },
  chess: {
    techniques: [
      {
        name: "Basic Opening Principles",
        description: "Learn the fundamental rules of chess openings: control the center, develop pieces, castle early",
        whyItMatters: "Good opening principles give you a solid foundation and prevent early blunders",
        difficulty: 2,
        youtubeQuery: "chess opening principles beginner tutorial",
        quizQuestions: [
          { question: "What is the most important area in the opening?", options: ["The corners", "The center (d4, d5, e4, e5)", "The back rank", "The flanks"], correctIndex: 1 },
          { question: "Which pieces should you develop first?", options: ["Queen and King", "Knights and Bishops", "Rooks", "Pawns only"], correctIndex: 1 },
          { question: "Why is castling important?", options: ["It looks cool", "King safety and rook activation", "To win material", "It's not important"], correctIndex: 1 },
        ],
      },
      {
        name: "Basic Tactics: Forks and Pins",
        description: "Recognize and execute forks (attacking two pieces) and pins (immobilizing pieces)",
        whyItMatters: "Tactics win games - recognizing these patterns helps you win material and games",
        difficulty: 3,
        youtubeQuery: "chess tactics forks pins tutorial beginner",
        quizQuestions: [
          { question: "What is a fork in chess?", options: ["A eating utensil", "One piece attacking two or more", "Trading pieces", "A type of opening"], correctIndex: 1 },
          { question: "What is an absolute pin?", options: ["A pin against the king", "A pin against the queen", "Any pin", "A pin that can't be broken"], correctIndex: 0 },
          { question: "Which piece is best at forking?", options: ["Bishop", "Rook", "Knight", "Pawn"], correctIndex: 2 },
        ],
      },
      {
        name: "Basic Checkmate Patterns",
        description: "Master essential checkmate patterns: back rank, smothered mate, queen + king mate",
        whyItMatters: "Knowing checkmate patterns helps you finish games and recognize winning opportunities",
        difficulty: 2,
        youtubeQuery: "basic checkmate patterns chess tutorial",
        quizQuestions: [
          { question: "What is a back rank mate?", options: ["Checkmate on the 8th rank", "Checkmate from behind", "Mate with a rook on the back", "Any checkmate"], correctIndex: 0 },
          { question: "What piece delivers a smothered mate?", options: ["Queen", "Rook", "Knight", "Bishop"], correctIndex: 2 },
          { question: "How many pieces minimum to checkmate a lone king?", options: ["King only", "King + any piece", "King + Rook", "King + 2 bishops"], correctIndex: 2 },
        ],
      },
      {
        name: "Endgame Fundamentals",
        description: "Learn essential endgame techniques: king activity, pawn promotion, opposition",
        whyItMatters: "Many games are decided in the endgame - knowing basics prevents throwing away wins",
        difficulty: 3,
        youtubeQuery: "chess endgame basics king pawn tutorial",
        quizQuestions: [
          { question: "What is opposition?", options: ["Being against your opponent", "Kings facing each other with one square between", "Opposing pawns", "Being in check"], correctIndex: 1 },
          { question: "Is the king strong in the endgame?", options: ["No, always hide it", "Yes, it becomes active", "Same as opening", "Only if you're winning"], correctIndex: 1 },
          { question: "What is a passed pawn?", options: ["A pawn that passed the center", "A pawn with no enemy pawns blocking", "A promoted pawn", "A captured pawn"], correctIndex: 1 },
        ],
      },
      {
        name: "Piece Coordination",
        description: "Learn how to make your pieces work together for attacks and defense",
        whyItMatters: "Coordinated pieces are worth more than the sum of their parts",
        difficulty: 3,
        youtubeQuery: "chess piece coordination attacking tutorial",
        quizQuestions: [
          { question: "What is a battery?", options: ["Power source", "Two pieces on same line targeting same point", "Aggressive opening", "Fast chess"], correctIndex: 1 },
          { question: "Which pieces work well together?", options: ["Queen and Knight", "Two Bishops", "Rooks on open files", "All of the above"], correctIndex: 3 },
          { question: "What is doubling rooks?", options: ["Having two rooks", "Rooks on the same file", "Trading rooks", "Sacrificing a rook"], correctIndex: 1 },
        ],
      },
      {
        name: "Pattern Recognition",
        description: "Train your eye to spot common tactical and strategic patterns quickly",
        whyItMatters: "Pattern recognition is what separates strong players - they see moves instantly that others miss",
        difficulty: 4,
        youtubeQuery: "chess pattern recognition tactics training",
        quizQuestions: [
          { question: "How do you improve pattern recognition?", options: ["Play more games", "Solve tactics puzzles", "Study master games", "All of the above"], correctIndex: 3 },
          { question: "What is a common sacrifice pattern?", options: ["Greek gift (Bxh7+)", "The Sicilian", "Castling", "Trading queens"], correctIndex: 0 },
          { question: "How many patterns should you know?", options: ["5-10", "50-100", "Hundreds to thousands", "Just a few"], correctIndex: 2 },
        ],
      },
    ],
  },
  poker: {
    techniques: [
      {
        name: "Starting Hand Selection",
        description: "Learn which hands to play from each position and when to fold preflop",
        whyItMatters: "Playing too many hands is the #1 beginner mistake - discipline here saves money",
        difficulty: 2,
        youtubeQuery: "poker starting hands chart position tutorial",
        quizQuestions: [
          { question: "What is a premium hand?", options: ["Any pair", "AA, KK, QQ, AK", "Suited connectors", "Any face card"], correctIndex: 1 },
          { question: "Does position matter for hand selection?", options: ["No, play the same hands", "Yes, play tighter early, looser late", "Only in tournaments", "Only online"], correctIndex: 1 },
          { question: "What does 'suited' mean?", options: ["Dressed nicely", "Same suit cards", "Sequential cards", "Face cards"], correctIndex: 1 },
        ],
      },
      {
        name: "Position and Its Power",
        description: "Understand why acting last is a massive advantage and how to exploit position",
        whyItMatters: "Position is the most underrated concept - it can turn losing hands into winners",
        difficulty: 2,
        youtubeQuery: "poker position strategy button cutoff tutorial",
        quizQuestions: [
          { question: "Which is the best position?", options: ["Under the Gun", "Button (Dealer)", "Big Blind", "Small Blind"], correctIndex: 1 },
          { question: "Why is late position good?", options: ["You can see others act first", "Cards are better", "Blinds are smaller", "You shuffle"], correctIndex: 0 },
          { question: "What is 'the cutoff'?", options: ["Leaving the game", "Seat right of button", "Splitting the pot", "A type of bet"], correctIndex: 1 },
        ],
      },
      {
        name: "Pot Odds and Equity",
        description: "Calculate whether a call is mathematically profitable based on pot odds",
        whyItMatters: "Making +EV decisions consistently is the foundation of winning poker",
        difficulty: 3,
        youtubeQuery: "poker pot odds equity calculation tutorial",
        quizQuestions: [
          { question: "What are pot odds?", options: ["Chance of winning", "Ratio of call to pot size", "Odds of getting a pair", "Money in the pot"], correctIndex: 1 },
          { question: "If pot is $100 and you must call $20, what odds do you need?", options: ["50%", "20%", "More than 16.7%", "100%"], correctIndex: 2 },
          { question: "What is equity?", options: ["Your chip count", "Your share of the pot based on winning chance", "The buy-in", "Your position"], correctIndex: 1 },
        ],
      },
      {
        name: "Reading Opponents and Tells",
        description: "Identify betting patterns and physical tells to read opponent hand strength",
        whyItMatters: "Poker is about people, not just cards - reads give you information others don't have",
        difficulty: 4,
        youtubeQuery: "poker tells reading opponents beginner",
        quizQuestions: [
          { question: "What is a betting tell?", options: ["Telling people your hand", "Pattern in how someone bets", "Talking at the table", "A type of bluff"], correctIndex: 1 },
          { question: "Are physical tells reliable?", options: ["Always accurate", "Never useful", "Sometimes helpful, not definitive", "Only in movies"], correctIndex: 2 },
          { question: "What is a timing tell?", options: ["Being on time", "How long someone takes to act", "Clock management", "Tournament time"], correctIndex: 1 },
        ],
      },
      {
        name: "Bluffing Fundamentals",
        description: "Learn when, why, and how to bluff effectively without overdoing it",
        whyItMatters: "Balanced bluffing makes you unpredictable and harder to play against",
        difficulty: 3,
        youtubeQuery: "poker bluffing strategy when to bluff beginner",
        quizQuestions: [
          { question: "How often should you bluff?", options: ["Never", "Every hand", "Balanced with value bets", "Only when scared"], correctIndex: 2 },
          { question: "What is a semi-bluff?", options: ["Half a bluff", "Bluffing with a draw", "Small bet bluff", "Fake bluff"], correctIndex: 1 },
          { question: "When is a good time to bluff?", options: ["When you have nothing", "When the board favors your range", "Against calling stations", "Always"], correctIndex: 1 },
        ],
      },
      {
        name: "Bankroll Management",
        description: "Protect your poker funds with proper bankroll management and game selection",
        whyItMatters: "Even winning players go broke without bankroll management - it's essential survival",
        difficulty: 2,
        youtubeQuery: "poker bankroll management strategy beginner",
        quizQuestions: [
          { question: "How many buy-ins should you have for cash games?", options: ["1-2", "5-10", "20-30+", "100+"], correctIndex: 2 },
          { question: "What is a downswing?", options: ["Bad luck streak", "Tilting", "Quitting poker", "Moving down stakes"], correctIndex: 0 },
          { question: "Should you play stakes you can't afford?", options: ["Yes, to win big", "No, play within bankroll", "Sometimes for practice", "Only online"], correctIndex: 1 },
        ],
      },
    ],
  },
};

const hobbyDatabaseExtended: Record<string, HobbyTechniques> = {
  ...hobbyDatabase,
  piano: {
    techniques: [
      {
        name: "Proper Hand Position",
        description: "Learn the curved finger technique and correct wrist alignment for efficient playing",
        whyItMatters: "Good hand position prevents injury and allows for faster, more accurate playing",
        difficulty: 1,
        youtubeQuery: "piano hand position technique beginner tutorial",
        quizQuestions: [
          { question: "How should your fingers be curved?", options: ["Completely flat", "Like holding a ball", "Straight up", "Bent backward"], correctIndex: 1 },
          { question: "Where should your thumb be positioned?", options: ["Under the palm", "On its side", "Straight like other fingers", "Off the keys"], correctIndex: 1 },
          { question: "What is the ideal wrist height?", options: ["Below the keys", "Level with knuckles", "High above the keys", "Touching the piano"], correctIndex: 1 },
        ],
      },
      {
        name: "Reading Basic Music Notation",
        description: "Understand the staff, clefs, note values, and basic rhythm patterns",
        whyItMatters: "Reading music opens up unlimited repertoire and makes learning new pieces much faster",
        difficulty: 2,
        youtubeQuery: "how to read piano sheet music beginner tutorial",
        quizQuestions: [
          { question: "How many lines are in a staff?", options: ["3", "4", "5", "6"], correctIndex: 2 },
          { question: "What clef does the right hand typically read?", options: ["Bass clef", "Treble clef", "Alto clef", "Tenor clef"], correctIndex: 1 },
          { question: "A whole note equals how many beats?", options: ["1", "2", "3", "4"], correctIndex: 3 },
        ],
      },
      {
        name: "Scales and Finger Patterns",
        description: "Master major and minor scales with proper fingering for fluid playing",
        whyItMatters: "Scales build finger strength, coordination, and are the foundation of all melodies",
        difficulty: 2,
        youtubeQuery: "piano scales beginner major minor fingering",
        quizQuestions: [
          { question: "How many notes are in a major scale?", options: ["5", "6", "7", "8"], correctIndex: 3 },
          { question: "What does 'thumb under' mean?", options: ["Hiding your thumb", "Passing thumb under fingers", "Pressing with thumb", "Thumb on black keys"], correctIndex: 1 },
          { question: "Why practice scales slowly first?", options: ["It's easier", "To build muscle memory", "To save time", "No reason"], correctIndex: 1 },
        ],
      },
      {
        name: "Basic Chords and Inversions",
        description: "Learn triads, seventh chords, and their inversions for accompaniment",
        whyItMatters: "Chords let you accompany yourself and others, and understand harmony",
        difficulty: 3,
        youtubeQuery: "piano chords for beginners triads inversions",
        quizQuestions: [
          { question: "A triad has how many notes?", options: ["2", "3", "4", "5"], correctIndex: 1 },
          { question: "What is a chord inversion?", options: ["Playing backward", "Root note not on bottom", "Wrong chord", "Loud chord"], correctIndex: 1 },
          { question: "C-E-G is what type of chord?", options: ["Minor", "Major", "Diminished", "Augmented"], correctIndex: 1 },
        ],
      },
      {
        name: "Pedal Technique",
        description: "Use the sustain pedal effectively without muddying the sound",
        whyItMatters: "The pedal adds richness and legato, but misuse is the most common beginner mistake",
        difficulty: 3,
        youtubeQuery: "piano pedal technique sustain beginner tutorial",
        quizQuestions: [
          { question: "When should you change the pedal?", options: ["Every beat", "When harmony changes", "Never", "Every note"], correctIndex: 1 },
          { question: "What does the sustain pedal do?", options: ["Makes sound louder", "Holds all notes", "Changes pitch", "Records playing"], correctIndex: 1 },
          { question: "What is 'syncopated pedaling'?", options: ["Pedaling on beat", "Lifting after pressing keys", "No pedal", "Two pedals at once"], correctIndex: 1 },
        ],
      },
      {
        name: "Playing Simple Songs",
        description: "Apply your skills to real music with beginner-friendly pieces",
        whyItMatters: "Playing actual songs keeps you motivated and shows real progress",
        difficulty: 2,
        youtubeQuery: "easy piano songs for beginners tutorial",
        quizQuestions: [
          { question: "What should you do before playing a new piece?", options: ["Play fast", "Study the notes and fingering", "Skip to the end", "Ignore dynamics"], correctIndex: 1 },
          { question: "How should you practice a difficult section?", options: ["Skip it", "Play it slowly many times", "Only play fast", "Give up"], correctIndex: 1 },
          { question: "Why learn hands separately first?", options: ["To save time", "Less mental load", "Not necessary", "More fun"], correctIndex: 1 },
        ],
      },
    ],
  },
  photography: {
    techniques: [
      {
        name: "Understanding Exposure Triangle",
        description: "Master the relationship between aperture, shutter speed, and ISO",
        whyItMatters: "Exposure control is the foundation of all photography - get this right and everything else follows",
        difficulty: 2,
        youtubeQuery: "exposure triangle photography tutorial beginner",
        quizQuestions: [
          { question: "What does aperture control?", options: ["Time", "Light amount and depth of field", "Color", "Focus point"], correctIndex: 1 },
          { question: "Higher ISO means?", options: ["Darker image", "More grain/noise", "Slower shutter", "Larger aperture"], correctIndex: 1 },
          { question: "Fast shutter speed does what?", options: ["Blurs motion", "Freezes motion", "Changes color", "Adjusts focus"], correctIndex: 1 },
        ],
      },
      {
        name: "Composition Basics",
        description: "Learn rule of thirds, leading lines, and framing for compelling images",
        whyItMatters: "Good composition transforms snapshots into photographs worth keeping",
        difficulty: 1,
        youtubeQuery: "photography composition rule of thirds tutorial",
        quizQuestions: [
          { question: "Rule of thirds divides the frame into?", options: ["2 parts", "4 parts", "9 parts", "16 parts"], correctIndex: 2 },
          { question: "Leading lines do what?", options: ["Confuse viewers", "Guide the eye through image", "Add color", "Create blur"], correctIndex: 1 },
          { question: "Where should the subject be placed?", options: ["Always center", "On intersection points", "In corners", "Outside frame"], correctIndex: 1 },
        ],
      },
      {
        name: "Natural Light Photography",
        description: "Use available light effectively for beautiful, natural-looking photos",
        whyItMatters: "Understanding light is 90% of photography - natural light is free and everywhere",
        difficulty: 2,
        youtubeQuery: "natural light photography tutorial golden hour",
        quizQuestions: [
          { question: "What is golden hour?", options: ["Noon", "Hour after sunrise/before sunset", "Midnight", "Any hour"], correctIndex: 1 },
          { question: "Harsh midday sun creates?", options: ["Soft shadows", "Hard shadows", "No shadows", "Color shift"], correctIndex: 1 },
          { question: "Overcast sky acts like?", options: ["Spotlight", "Giant softbox", "Flash", "Darkness"], correctIndex: 1 },
        ],
      },
      {
        name: "Focus and Depth of Field",
        description: "Control what's sharp and what's blurry to direct attention",
        whyItMatters: "Selective focus separates your subject from the background and adds professional quality",
        difficulty: 2,
        youtubeQuery: "depth of field photography tutorial bokeh",
        quizQuestions: [
          { question: "Larger aperture (f/1.8) creates?", options: ["Deep focus", "Shallow focus", "No focus", "Wide angle"], correctIndex: 1 },
          { question: "Bokeh refers to?", options: ["Sharp areas", "Blur quality in out-of-focus areas", "Camera brand", "Lens type"], correctIndex: 1 },
          { question: "For landscapes, use?", options: ["f/1.4", "f/2.8", "f/11-f/16", "No aperture"], correctIndex: 2 },
        ],
      },
      {
        name: "Basic Photo Editing",
        description: "Enhance your images with fundamental editing techniques",
        whyItMatters: "Even the best photographers edit - it's essential to realizing your creative vision",
        difficulty: 2,
        youtubeQuery: "photo editing basics lightroom tutorial beginner",
        quizQuestions: [
          { question: "What should you adjust first?", options: ["Saturation", "Exposure and white balance", "Sharpening", "Cropping"], correctIndex: 1 },
          { question: "RAW files vs JPEG?", options: ["No difference", "RAW has more editing flexibility", "JPEG is better", "RAW is smaller"], correctIndex: 1 },
          { question: "What does 'non-destructive editing' mean?", options: ["Editing that damages photos", "Original file preserved", "Expensive software", "No editing"], correctIndex: 1 },
        ],
      },
      {
        name: "Portrait Photography Basics",
        description: "Capture flattering photos of people with good poses and lighting",
        whyItMatters: "People photos are the most cherished - learning this skill has lasting personal value",
        difficulty: 3,
        youtubeQuery: "portrait photography tips beginner tutorial",
        quizQuestions: [
          { question: "Where should light come from for portraits?", options: ["Directly behind subject", "From the side or front", "From below", "No light needed"], correctIndex: 1 },
          { question: "Eye level camera position creates?", options: ["Unflattering angle", "Natural, equal perspective", "Dramatic look", "Distortion"], correctIndex: 1 },
          { question: "What focal length flatters faces?", options: ["10mm", "35mm", "85mm", "200mm"], correctIndex: 2 },
        ],
      },
    ],
  },
  cooking: {
    techniques: [
      {
        name: "Knife Skills",
        description: "Master basic cuts like dice, julienne, and chiffonade safely and efficiently",
        whyItMatters: "Good knife skills speed up prep by 50% and ensure even cooking",
        difficulty: 2,
        youtubeQuery: "basic knife skills cooking tutorial beginner",
        quizQuestions: [
          { question: "What is the 'claw grip' for?", options: ["Holding the knife", "Protecting fingers while holding food", "Opening jars", "Mixing"], correctIndex: 1 },
          { question: "Julienne means cutting into?", options: ["Cubes", "Thin strips", "Rings", "Wedges"], correctIndex: 1 },
          { question: "How often should you sharpen a knife?", options: ["Never", "Regularly", "Only when new", "Every day"], correctIndex: 1 },
        ],
      },
      {
        name: "Heat Control",
        description: "Understand when to use high, medium, or low heat for different techniques",
        whyItMatters: "Most cooking failures come from wrong heat - master this and food improves dramatically",
        difficulty: 2,
        youtubeQuery: "cooking heat control when to use high low heat",
        quizQuestions: [
          { question: "Searing meat requires?", options: ["Low heat", "High heat", "No heat", "Medium heat"], correctIndex: 1 },
          { question: "Simmering happens at?", options: ["Boiling point", "Just below boiling", "Room temperature", "Freezing"], correctIndex: 1 },
          { question: "Why preheat the pan?", options: ["Waste time", "Even cooking and proper sear", "Save energy", "Cool food faster"], correctIndex: 1 },
        ],
      },
      {
        name: "Seasoning and Tasting",
        description: "Build flavor layers and adjust seasoning throughout cooking",
        whyItMatters: "The difference between good and great cooking is tasting and adjusting constantly",
        difficulty: 2,
        youtubeQuery: "how to season food properly cooking tutorial",
        quizQuestions: [
          { question: "When should you add salt?", options: ["Only at the end", "Throughout cooking", "Never", "Before cooking only"], correctIndex: 1 },
          { question: "What does acid do to dishes?", options: ["Makes bitter", "Brightens and balances", "Adds sweetness", "Removes flavor"], correctIndex: 1 },
          { question: "How often should you taste while cooking?", options: ["Never", "Once at end", "Frequently throughout", "Only when done"], correctIndex: 2 },
        ],
      },
      {
        name: "Basic Sauce Making",
        description: "Create mother sauces and pan sauces to elevate any dish",
        whyItMatters: "A good sauce can transform simple ingredients into restaurant-quality meals",
        difficulty: 3,
        youtubeQuery: "basic sauce making cooking tutorial pan sauce",
        quizQuestions: [
          { question: "What is deglazing?", options: ["Removing ice", "Adding liquid to hot pan to lift fond", "Cooling down", "Thickening"], correctIndex: 1 },
          { question: "A roux is made from?", options: ["Eggs and cream", "Fat and flour", "Water and salt", "Sugar and butter"], correctIndex: 1 },
          { question: "Why reduce a sauce?", options: ["Make it thinner", "Concentrate flavors", "Add water", "Cool it down"], correctIndex: 1 },
        ],
      },
      {
        name: "Mise en Place",
        description: "Organize ingredients and tools before cooking for smooth execution",
        whyItMatters: "Professional chefs prep everything first - it makes cooking less stressful and more successful",
        difficulty: 1,
        youtubeQuery: "mise en place cooking preparation tutorial",
        quizQuestions: [
          { question: "Mise en place means?", options: ["Cooking fast", "Everything in its place", "Fancy plating", "Expensive ingredients"], correctIndex: 1 },
          { question: "When should you prep ingredients?", options: ["While cooking", "Before cooking starts", "After cooking", "Never"], correctIndex: 1 },
          { question: "Why read the full recipe first?", options: ["No reason", "Understand timing and steps", "Waste time", "Look smart"], correctIndex: 1 },
        ],
      },
      {
        name: "Proper Protein Cooking",
        description: "Cook meat, fish, and eggs to perfect doneness every time",
        whyItMatters: "Overcooked protein is the most common home cooking mistake - fix this and meals improve instantly",
        difficulty: 3,
        youtubeQuery: "how to cook meat perfectly temperature tutorial",
        quizQuestions: [
          { question: "How do you check meat doneness?", options: ["Color only", "Instant-read thermometer", "Guess", "Cooking time only"], correctIndex: 1 },
          { question: "Should meat rest after cooking?", options: ["No, serve immediately", "Yes, for juices to redistribute", "Only if cold", "Never"], correctIndex: 1 },
          { question: "Carryover cooking means?", options: ["Cooking continues after heat removed", "Cooking in cart", "Cold cooking", "No change"], correctIndex: 0 },
        ],
      },
    ],
  },
  drawing: {
    techniques: [
      {
        name: "Basic Shapes and Forms",
        description: "Break down any subject into simple geometric shapes before adding detail",
        whyItMatters: "Everything complex is made of simple shapes - mastering this makes drawing anything possible",
        difficulty: 1,
        youtubeQuery: "drawing basic shapes forms beginner tutorial",
        quizQuestions: [
          { question: "What are the primary shapes?", options: ["Only circles", "Circle, square, triangle", "Just lines", "Complex curves"], correctIndex: 1 },
          { question: "3D form of a circle is?", options: ["Square", "Cylinder or sphere", "Triangle", "Line"], correctIndex: 1 },
          { question: "Why simplify to shapes first?", options: ["Faster", "Accurate proportions", "No reason", "Looks better"], correctIndex: 1 },
        ],
      },
      {
        name: "Line Quality and Control",
        description: "Develop confident, varied lines through controlled practice",
        whyItMatters: "Line quality separates amateur sketches from professional work",
        difficulty: 2,
        youtubeQuery: "drawing line quality control exercises tutorial",
        quizQuestions: [
          { question: "Confident lines come from?", options: ["Drawing slowly", "Drawing from shoulder/elbow", "Pressing hard", "Using rulers"], correctIndex: 1 },
          { question: "Varying line weight adds?", options: ["Mistakes", "Depth and interest", "Confusion", "Nothing"], correctIndex: 1 },
          { question: "Ghost drawing means?", options: ["Drawing ghosts", "Practicing stroke before drawing", "Erasing", "Light sketching"], correctIndex: 1 },
        ],
      },
      {
        name: "Shading and Value",
        description: "Create the illusion of depth and form through light and shadow",
        whyItMatters: "Shading transforms flat shapes into three-dimensional objects",
        difficulty: 2,
        youtubeQuery: "shading techniques drawing tutorial beginner",
        quizQuestions: [
          { question: "Value refers to?", options: ["Price", "Lightness or darkness", "Color", "Size"], correctIndex: 1 },
          { question: "Light comes from where determines?", options: ["Nothing", "Where shadows fall", "Color", "Line quality"], correctIndex: 1 },
          { question: "Cross-hatching is?", options: ["Removing lines", "Overlapping lines for value", "Drawing X shapes", "Erasing"], correctIndex: 1 },
        ],
      },
      {
        name: "Proportion and Measurement",
        description: "Accurately capture relative sizes and positions of elements",
        whyItMatters: "Wrong proportions make drawings look 'off' even with good technique",
        difficulty: 2,
        youtubeQuery: "drawing proportions measurement techniques tutorial",
        quizQuestions: [
          { question: "Sight-sizing uses?", options: ["Memory", "Pencil to measure at arm's length", "Ruler", "Guessing"], correctIndex: 1 },
          { question: "Human body is about how many heads tall?", options: ["4", "6", "7.5-8", "10"], correctIndex: 2 },
          { question: "Negative space helps with?", options: ["Shading", "Checking proportions", "Erasing", "Color"], correctIndex: 1 },
        ],
      },
      {
        name: "Perspective Basics",
        description: "Create depth and space using one and two-point perspective",
        whyItMatters: "Perspective makes your drawings believable and spatially accurate",
        difficulty: 3,
        youtubeQuery: "perspective drawing tutorial one two point beginner",
        quizQuestions: [
          { question: "Horizon line represents?", options: ["The ground", "Eye level", "The sky only", "Arbitrary line"], correctIndex: 1 },
          { question: "Lines converge at?", options: ["Random points", "Vanishing points", "The corner", "Never"], correctIndex: 1 },
          { question: "One-point perspective shows?", options: ["Curved surfaces", "Objects facing directly at viewer", "Spheres", "Nothing useful"], correctIndex: 1 },
        ],
      },
      {
        name: "Gesture and Movement",
        description: "Capture the essential action and flow of a subject quickly",
        whyItMatters: "Gesture drawing builds the habit of seeing the whole before details",
        difficulty: 2,
        youtubeQuery: "gesture drawing tutorial quick sketches figure",
        quizQuestions: [
          { question: "Gesture drawings should be?", options: ["Detailed and slow", "Quick and expressive", "Perfect", "Colored"], correctIndex: 1 },
          { question: "What to capture first?", options: ["Details", "Line of action/movement", "Shading", "Background"], correctIndex: 1 },
          { question: "Typical gesture drawing time?", options: ["1 hour", "30 seconds to 2 minutes", "10 minutes", "1 day"], correctIndex: 1 },
        ],
      },
    ],
  },
};

function generateGenericTechniques(hobby: string, goal: string): HobbyTechniques {
  const baseQuestions = [
    { question: "What is the most important thing to focus on when starting?", options: ["Speed", "Proper form and technique", "Advanced moves", "Equipment"], correctIndex: 1 },
    { question: "How often should you practice to see improvement?", options: ["Once a month", "3-5 times per week", "Once a year", "Only on weekends"], correctIndex: 1 },
    { question: "What should you do when you hit a plateau?", options: ["Give up", "Try a different approach or get feedback", "Practice less", "Ignore it"], correctIndex: 1 },
  ];

  return {
    techniques: [
      {
        name: `${hobby} Fundamentals`,
        description: `Master the basic principles and foundational skills that every ${hobby} practitioner needs`,
        whyItMatters: `Strong fundamentals make advanced techniques easier to learn and prevent bad habits`,
        difficulty: 1,
        youtubeQuery: `${hobby} basics fundamentals beginner tutorial`,
        quizQuestions: baseQuestions,
      },
      {
        name: `Core ${hobby} Techniques`,
        description: `Learn the essential techniques that form the backbone of ${hobby} practice`,
        whyItMatters: `These techniques appear in 80% of ${hobby} activities - master them first`,
        difficulty: 2,
        youtubeQuery: `${hobby} essential techniques tutorial beginner`,
        quizQuestions: [
          { question: `What makes a ${hobby} technique effective?`, options: ["Speed only", "Power only", "Proper form and timing", "Expensive equipment"], correctIndex: 2 },
          { question: "How do you know when you've mastered a technique?", options: ["You can do it once", "You can do it consistently without thinking", "Someone tells you", "You feel tired"], correctIndex: 1 },
          { question: "What's the best way to practice?", options: ["Random practice", "Focused, deliberate practice", "Only when you feel like it", "Watching videos only"], correctIndex: 1 },
        ],
      },
      {
        name: `${hobby} Drills and Exercises`,
        description: `Practice routines and drills to build muscle memory and improve consistency`,
        whyItMatters: `Deliberate practice through drills accelerates skill development exponentially`,
        difficulty: 2,
        youtubeQuery: `${hobby} practice drills exercises routine`,
        quizQuestions: [
          { question: "Why are drills important?", options: ["They're fun", "They build muscle memory", "They waste time", "They're easy"], correctIndex: 1 },
          { question: "How long should a practice session be?", options: ["5 minutes", "20-45 minutes focused", "4+ hours", "1 minute"], correctIndex: 1 },
          { question: "Should you practice when tired?", options: ["Yes, push through", "No, quality over quantity", "Only advanced skills", "Never practice"], correctIndex: 1 },
        ],
      },
      {
        name: `Intermediate ${hobby} Skills`,
        description: `Build on fundamentals with more advanced techniques and combinations`,
        whyItMatters: `These skills separate casual practitioners from serious enthusiasts`,
        difficulty: 3,
        youtubeQuery: `${hobby} intermediate level tutorial techniques`,
        quizQuestions: [
          { question: "When should you move to intermediate techniques?", options: ["Immediately", "When basics are solid", "Never", "After 1 day"], correctIndex: 1 },
          { question: "How do you combine techniques effectively?", options: ["Do them all at once", "Practice transitions between them", "Skip the basics", "Guess"], correctIndex: 1 },
          { question: "What's the key to progressing?", options: ["Talent only", "Consistent practice and feedback", "Expensive lessons", "Natural ability"], correctIndex: 1 },
        ],
      },
      {
        name: `${hobby} Strategy and Tactics`,
        description: `Learn the strategic thinking and decision-making aspects of ${hobby}`,
        whyItMatters: `Understanding the 'why' behind techniques makes you adaptable and creative`,
        difficulty: 3,
        youtubeQuery: `${hobby} strategy tips advanced thinking`,
        quizQuestions: [
          { question: "Why is strategy important?", options: ["It's not", "It guides technique application", "Only for pros", "To show off"], correctIndex: 1 },
          { question: "How do you develop strategic thinking?", options: ["Born with it", "Study, practice, reflect", "Watch TV", "Avoid thinking"], correctIndex: 1 },
          { question: "Should you analyze your practice sessions?", options: ["No, waste of time", "Yes, to identify improvements", "Only failures", "Never"], correctIndex: 1 },
        ],
      },
      {
        name: `${hobby} Performance and Flow`,
        description: `Put it all together: performing under pressure and achieving flow states`,
        whyItMatters: `The ultimate goal is effortless performance where skills become second nature`,
        difficulty: 4,
        youtubeQuery: `${hobby} performance tips flow state mastery`,
        quizQuestions: [
          { question: "What is flow state?", options: ["Being tired", "Complete immersion and focus", "Giving up", "Thinking too much"], correctIndex: 1 },
          { question: "How do you handle performance anxiety?", options: ["Avoid performing", "Practice and preparation", "Don't care", "Panic"], correctIndex: 1 },
          { question: "What indicates mastery?", options: ["Perfect every time", "Consistent performance with room to grow", "Never making mistakes", "Quitting"], correctIndex: 1 },
        ],
      },
    ],
  };
}

export function generateTechniquesForHobby(
  hobby: string,
  goal: string,
  dailyMinutes: number
): Technique[] {
  const normalizedHobby = hobby.toLowerCase().trim();
  
  const hobbyData = hobbyDatabaseExtended[normalizedHobby] || generateGenericTechniques(hobby, goal);
  
  const techniqueCount = dailyMinutes <= 20 ? 5 : dailyMinutes <= 40 ? 6 : Math.min(8, hobbyData.techniques.length);
  
  const selectedTechniques = hobbyData.techniques
    .slice(0, techniqueCount)
    .sort((a, b) => a.difficulty - b.difficulty);

  const depthLevel = dailyMinutes <= 20 ? "basic" : dailyMinutes <= 40 ? "intermediate" : "deep";

  return selectedTechniques.map((tech, index) => ({
    id: generateId(),
    name: tech.name,
    description: tech.description,
    whyItMatters: tech.whyItMatters,
    estimatedMinutes: Math.round(dailyMinutes / techniqueCount) + (tech.difficulty * 5),
    depthLevel,
    masteryState: "unstarted" as const,
    resources: [],
    prerequisites: index > 0 ? [selectedTechniques[index - 1].name] : [],
    order: index,
    youtubeQuery: tech.youtubeQuery,
    quizQuestions: tech.quizQuestions,
  }));
}

export function getTechniqueQuiz(hobby: string, techniqueName: string) {
  const normalizedHobby = hobby.toLowerCase().trim();
  const hobbyData = hobbyDatabaseExtended[normalizedHobby];
  
  if (hobbyData) {
    const technique = hobbyData.techniques.find(t => t.name === techniqueName);
    if (technique) {
      return technique.quizQuestions;
    }
  }
  
  return [
    { question: `What is most important when practicing ${techniqueName}?`, options: ["Speed", "Proper form", "Strength", "Equipment"], correctIndex: 1 },
    { question: "How often should you practice?", options: ["Never", "Daily or every other day", "Once a year", "Only weekends"], correctIndex: 1 },
    { question: "How do you know you've mastered this?", options: ["One success", "Consistent performance", "Someone says so", "Feeling tired"], correctIndex: 1 },
  ];
}

export function getYouTubeQuery(hobby: string, techniqueName: string): string {
  const normalizedHobby = hobby.toLowerCase().trim();
  const hobbyData = hobbyDatabaseExtended[normalizedHobby];
  
  if (hobbyData) {
    const technique = hobbyData.techniques.find(t => t.name === techniqueName);
    if (technique) {
      return technique.youtubeQuery;
    }
  }
  
  return `${techniqueName} ${hobby} tutorial beginner`;
}
