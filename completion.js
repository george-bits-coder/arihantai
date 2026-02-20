
const fs = require("fs");
const { openai } = require("./utils/helper");

require('dotenv').config();
const axios=require('axios');
const simpleembeddmap={
  arihantai:"./arihant1.txt",
  invest:"./invest.txt",
  fortale:"./fortale.txt",
  vijay:"./vijaynew.txt",
  drsherin:"./drsherin.txt",
  mind:"./mind.txt"

}


function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12' in 12-hour format

  // Constructing the time string
  const currentTime = `${hours}:${minutes} ${ampm}`;
  
  return currentTime;
}
const now = getCurrentTime();

const allprompts={
 orderai:"You are Blazin' Bird AI. You are an AI assistant that helps customers with menu items and ordering, using artificial intelligence.Answer the following question like a really firendly person. Keep the answers less than 20 words",
  Kat:"You are Kat AI. You are a friendly, warm and approachable AI assistant.Answer the following question like a really friendly person. Keep the answers to less than 20 words",
    arihantai:"You are Goyaam AI. You are a friendly, warm and approachable person and founder of Arihant Brothers.Answer the following question like a really friendly person. Try to answer in less than 100 words",
    invest:"You are Invest Bazaar AI. You are a friendly, warm and approachable person and an AI Assitant at Invest Bazaar.Answer the following question like a really friendly person. Try to answer in less than 100 words",
        fortale:"You are Fortale Living AI. You are a friendly, warm and approachable person and an AI Assitant at Fortale Living.Answer the following question like a really friendly person. Try to answer in less than 100 words. Never answer any question not related to fortale living or things to do in bangalore etc..i repeat never answer questions outside your scope",
        vijay:"You are Vijay AI, a talking persona of Vijay based on his biography. You are a friendly, warm and approachable person . Answer the following question like a really friendly person. Try to answer in less than 100 words. Remember you are vijay now. So answer questions as vijay. Dont answer questions like write a program in c++ etc. Since vijay wont know about such things",
        drsherin:"You are Dr. Sherin AI, a talking persona of Dr. Sherin based on his biography. You are a friendly, warm and approachable person enthusiastic about startups. Answer the following question like a really friendly person. Try to answer in less than 100 words. Never answer any question not related to Dr. Sherin or his biography.or things Dr. Sherin wouldnt know..i repeat never answer questions outside your scope",
 mind:"You are Mindora AI.You are an AI assistant for mindora, a company that deals in wellness across education, corporation and on an individual level. Answer the following question like a really friendly person. Keep the answers less than 100 words.\n\n",

        

}

// Also translate message to french. All your answers should be in this format example respone - hello | bonjour
// Config Variables
let embeddingStore = {};

const maxTokens = 600; // Just to save my money :')
const embeds_storage_prefix = "embeds:";
let embeddedQuestion;

const createPrompt = (question, paragraph,id,pq,pa) => {

  if(pq&&pa)
  {
    return (
      allprompts[id] + "Now continue previous conversation with given context Previous conversation - Question : "+ pq + " Answer : "+pa+
      " Context :\n" +
      paragraph.join("\n\n") +
      "\n\nQuestion :\n" +
      question +
          "?" +
          "\n\nAnswer :"
    );
  }
  else if(!pq||!pa)
  {
    return (
          allprompts[id] +
          "Context :\n" +
          paragraph.join("\n\n") +
          "\n\nQuestion :\n" +
          question +
          "?" +
          "\n\nAnswer :"
        );
    }
    else{
      return (
        allprompts[id] +
        "Context :\n" +
        paragraph.join("\n\n") +
        "\n\nQuestion :\n" +
        pq+
        "?" +
        "\n\nAnswer :"+
        pa+
        "\n\nQuestion :\n" +
        question +
        "?" +
        "\n\nAnswer :"
      );
    }

  // A sample prompt if you don't want it to use its own knowledge
  // rather answer only from data you've provided

  // return (
  //   "Answer the following question from the context, if the answer can not be deduced from the context, say 'I dont know' :\n\n" +
  //   "Context :\n" +
  //   paragraph.join("\n\n") +
  //   "\n\nQuestion :\n" +
  //   question +
  //   "?" +
  //   "\n\nAnswer :"
  // );
};

// Removes the prefix from paragraph
const keyExtractParagraph = (key) => {
  return key.substring(embeds_storage_prefix.length);
};

// Calculates the similarity score of question and context paragraphs
const compareEmbeddings = (embedding1, embedding2) => {
  var length = Math.min(embedding1.length, embedding2.length);
  var dotprod = 0;

  for (var i = 0; i < length; i++) {
    dotprod += embedding1[i] * embedding2[i];
  }

  return dotprod;
};

// Loop through each context paragraph, calculates the score, sort using score and return top count(int) paragraphs
const findClosestParagraphs = (questionEmbedding, count) => {
  var items = [];

  for (const key in embeddingStore) {
    let paragraph = keyExtractParagraph(key);

    let currentEmbedding = JSON.parse(embeddingStore[key]).embedding;

    items.push({
      paragraph: paragraph,
      score: compareEmbeddings(questionEmbedding, currentEmbedding),
    });
  }

  items.sort(function (a, b) {
    return b.score - a.score;
  });

  return items.slice(0, count).map((item) => item.paragraph);
};

const getEnglishTranslation = (word) => {
  const translations = {
    "bonjour": "Hello",
    "salut": "Hi",
    "merci": "Thank you",
    "au revoir": "Goodbye",
    "s'il vous plaît": "Please",
    "un café": "a coffee",
    "excusez-moi": "Excuse me",
    "où est": "where is",
    "la gare": "the train station",
    "je cherche": "I'm looking for",
    "à droite": "to the right",
    "à gauche": "to the left",
    "comment ça va": "How are you",
    "ça va bien": "I'm fine",
    "l'addition": "the bill",
    "je voudrais": "I would like"
  };
  return translations[word.toLowerCase()] || word;
};


// Initialize OpenAI client



const intentcompletion = async (message, pq, pa, node, currentChapterWords = []) => {
  try {
    // Dynamic curriculum based on conversation flow
    const curriculum = {
      greetings: {
        title: "Basic Greetings",
        words: [
          { word: "bonjour", meaning: "Hello", pronunciation: "bohn-zhoor" },
          { word: "salut", meaning: "Hi", pronunciation: "sah-loo" },
          { word: "merci", meaning: "Thank you", pronunciation: "mehr-see" },
          { word: "au revoir", meaning: "Goodbye", pronunciation: "oh ruh-vwahr" },
          { word: "comment ça va", meaning: "How are you", pronunciation: "koh-mahn sah vah" },
          { word: "ça va bien", meaning: "I'm fine", pronunciation: "sah vah byan" }
        ]
      },
      directions: {
        title: "Asking Directions",
        words: [
          { word: "excusez-moi", meaning: "Excuse me", pronunciation: "ex-koo-zay mwah" },
          { word: "où est", meaning: "where is", pronunciation: "oo eh" },
          { word: "la gare", meaning: "the train station", pronunciation: "lah gahr" },
          { word: "à droite", meaning: "to the right", pronunciation: "ah drwaht" },
          { word: "à gauche", meaning: "to the left", pronunciation: "ah gohsh" },
          { word: "tout droit", meaning: "straight ahead", pronunciation: "too drwah" }
        ]
      },
      restaurant: {
        title: "At the Restaurant",
        words: [
          { word: "je voudrais", meaning: "I would like", pronunciation: "zhuh voo-dray" },
          { word: "l'addition", meaning: "the bill", pronunciation: "lah-dee-syon" },
          { word: "un café", meaning: "a coffee", pronunciation: "uhn kah-fay" },
          { word: "du vin", meaning: "some wine", pronunciation: "doo van" },
          { word: "s'il vous plaît", meaning: "please", pronunciation: "see voo play" },
          { word: "encore", meaning: "more/again", pronunciation: "ahn-kor" }
        ]
      }
    };

    // Determine context based on conversation
    let context = "";
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("greet") || 
        lowerMessage.includes("hello") || 
        lowerMessage.includes("hi") ||
        lowerMessage.includes("bonjour")) {
      context = "greetings";
    } else if (lowerMessage.includes("where") || 
               lowerMessage.includes("direction") ||
               lowerMessage.includes("find") ||
               lowerMessage.includes("gare")) {
      context = "directions";
    } else if (lowerMessage.includes("restaurant") ||
               lowerMessage.includes("eat") ||
               lowerMessage.includes("food") ||
               lowerMessage.includes("café") ||
               lowerMessage.includes("menu")) {
      context = "restaurant";
    } else {
      // If no clear context but we have current words, use that chapter
      if (currentChapterWords && currentChapterWords.length > 0) {
        for (const [key, chapter] of Object.entries(curriculum)) {
          if (chapter.words.some(w => currentChapterWords.includes(w))) {
            context = key;
            break;
          }
        }
      }
      // Default to greetings if still no context
      if (!context) context = "greetings";
    }

    const chapter = curriculum[context];
    const words = chapter.words;
    
    // Determine if we should introduce a new word
    let currentWord = null;
    if (node < words.length) {
      currentWord = words[node];
    } else {
      // If we've gone through all words, pick a random one to reinforce
      currentWord = words[Math.floor(Math.random() * words.length)];
    }
    
    let contentprompt = `You're Pierre, a friendly French tutor having a natural conversation while teaching French.
    
Current teaching context: ${chapter.title}
Previous conversation:
- User: ${pq || "First interaction"}
- You: ${pa || "Just starting"}

User now says: "${message}"

Respond naturally while:
1. Answering the user's question or responding to their statement
2. When appropriate, teach or reinforce French vocabulary from this list: ${JSON.stringify(words)}
3. Highlight the current word "${currentWord.word}" (meaning: "${currentWord.meaning}") if relevant
4. Keep responses conversational and engaging
5. Suggest a quiz if the user seems ready for practice

Format your response naturally, incorporating French words when appropriate.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "assistant", content: contentprompt }],
      max_tokens: 250,
      temperature: 0.7,
    });

    const responseText = completion.data.choices[0].message.content.trim();
    
    // Determine if we should trigger a quiz
    const shouldQuiz = responseText.includes("quiz") || 
                      responseText.includes("practice") ||
                      responseText.includes("test") ||
                      lowerMessage.includes("quiz") ||
                      lowerMessage.includes("test") ||
                      lowerMessage.includes("practice");

    return {
      message: responseText,
      currentWord: currentWord,
      currentChapterWords: words,
      isQuiz: shouldQuiz,
      chapterTitle: chapter.title,
      node: (node + 1) % words.length
    };
  } catch(error) {
    console.error("Error in intentcompletion:", error);
    return { 
      message: "Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question?",
      currentWord: null,
      currentChapterWords: [],
      isQuiz: false,
      chapterTitle: "",
      node: 0
    };
  }
};









// Helper function for translations
// function getEnglishTranslation(frenchWord) {
//   const translations = {
//     "bonjour": "hello/good morning",
//     "merci": "thank you",
//     "au revoir": "goodbye",
//     // Add all other translations
//   };
//   return translations[frenchWord] || frenchWord;
// }


const customGenerateCompletionwithContext = async (prompt,id,pq,pa) => {
  console.log(`Called completion function with prompt : ${prompt}`);

  try {
    // Retrieve embedding store and parse it
    let pathofembed=simpleembeddmap[id];
    let embeddingStoreJSON = fs.readFileSync(pathofembed, {
      encoding: "utf-8",
      flag: "r",
    });

    embeddingStore = JSON.parse(embeddingStoreJSON);

    // Embed the prompt using embedding model

   var embeddedQuestionResponse = await openai.createEmbedding({
      input: prompt,
      model: "text-embedding-ada-002",
    });

    if(pq&&pa){
     embeddedQuestionResponse = await openai.createEmbedding({
      input: "Context is as follows Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt + "?",
      model: "text-embedding-ada-002",
    });
  }

    // Some error handling
    if (embeddedQuestionResponse.data.data.length) {
      embeddedQuestion = embeddedQuestionResponse.data.data[0].embedding;
    } else {
      throw Error("Question not embedded properly");
    }

    // Find the closest count(int) paragraphs
    let closestParagraphs = findClosestParagraphs(embeddedQuestion, 5); // Tweak this value for selecting paragraphs number

    if(pq&&pa){
    var completionData = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "assistant",
          content: createPrompt("Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt , closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer."+
          " Also as required, direct the conversation towards any of these topics in this array - /"[
  "Check apartment availability (1BHK/2BHK) for specific dates",
  "Compare pricing for short-term vs. long-term stays",
  "List included amenities (e.g., Jio WiFi, washing machine, AC)",
  "Explain housekeeping frequency (e.g., alternate-day cleaning)",
  "Confirm check-in/out timings (1 PM check-in, 11 AM check-out)",
  "ID proof requirements (Aadhar, passport, etc.) for booking",
  "Distance to key locations (IIM Bangalore, Kempegowda Airport)",
  "Public transport access (e.g., BMTC bus stops)",
  "Security deposit details (₹18,000) and payment deadlines",
  "Cancellation/refund policies (e.g., non-refundable token)"]
        },
      ],
      max_tokens:600,
      temperature: 0, // Tweak for more random answers
    });
  }
  else {


    completionData = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "assistant",
          content: createPrompt(prompt, closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer",
        },
      ],
      
      max_tokens:600,
      temperature: 0, // Tweak for more random answers
    });

  }

    if (!completionData.data.choices) {
      throw new Error("No answer gotten");
    }

    console.log(completionData.data.choices[0].message.content.trim());
    return completionData.data.choices[0].message.content.trim();
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};

const ennegramResponse = async (pq, pa, message) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are My Sarthi AI, an AI expert focused on Enneagram test. Respond to the conversation in the distinctive style of a close friend- warm and engaging. keep most responses in clear English. Maintain a tone of wisdom and deep reflection.Never answer any question thats outside scope or expertise like write a program in c++ etc..i repeat never answer questions outside your scope. If its outside scope, just say i'm only trained to answer enneagram related queries.I repeat- If its outside scope, just say i'm only trained to answer enneagram related queriesAnswer in less than 100 words. Always answer in less than 100 words"
        },
        {
          role: "assistant",
          content: `Previous exchange:\nQuestion: ${pq}\nAnswer: ${pa}\n\nNow respond to this new message : ${message}`
        }
      ],
      max_tokens: 100,
      temperature: 0.7, // For creative but not too w
      // ild responses
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating  response:", error);
    return "My apologies, can you repeat the question";
  }
};


const goetheResponse = async (pq, pa, message) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Johann Wolfgang von Goethe, the renowned German writer and philosopher. Respond to the conversation in Goethe's distinctive style - profound, poetic, and philosophical, yet warm and engaging. Use classical German sentence structures occasionally, but keep most responses in clear English. Maintain a tone of wisdom and deep reflection.Never answer any question that goethe wouldnt be able to answer etc..i repeat never answer questions outside your scope. Answer in less than 100 words. Always answer in less than 100 words"
        },
        {
          role: "assistant",
          content: `Previous exchange:\nQuestion: ${pq}\nAnswer: ${pa}\n\nNow respond to this new message in Goethe's style: ${message}`
        }
      ],
      max_tokens: 100,
      temperature: 0.7, // For creative but not too w
      // ild responses
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating Goethe response:", error);
    return "My apologies, but at this moment my thoughts are as clouded as a storm over the Brocken. Might you repeat your inquiry?";
  }
};

module.exports= {customGenerateCompletionwithContext,intentcompletion,goetheResponse,ennegramResponse};