const fs = require("fs");
const { openai } = require("./utils/helper");
let embeddedPath = "./silkpod.txt";
require('dotenv').config();
const axios=require('axios')
const { getJson } = require("serpapi");
const callapi=require("./perplexity");

const simpleembeddmap={
  silkpod:"./silkpod.txt",
  mrm:"./mrm.txt",
   mjgh:"./mjrd.txt",
   finf:"./finf.txt",
   geo:"./geo.txt",
   shak:"./shakti.txt",
   pro:"./pro.txt",
   lumin:"./lumin.txt",
   real1:"./realestate1.txt",
   mona:"./mona.txt",
   thapa:"./thapa.txt",
   saran:"./saran.txt",
   scenes:"./commb.txt",
   tay:"./tay.txt",
   georesume:"./georesume.txt",
   alice:"./alice.txt",
   storiies:"./storiiesai.txt",
   raj:"./raj.txt",
   zak:"./zak.txt",
   ans:"./ans.txt",
   mosc:"./mosc.txt",
   bangalore:"./bangalore.txt",
   electra:"./electra.txt",
   eva:"./eva.txt",
   ron:"./ron.txt",
   delhi:"./delhi.txt",
   founders:"./founders.txt",
   reliance:"./axel.txt",
   bitcoin:"./bitcoin.txt",
   jatin:"./jatin.txt",
   cste:"./cste.txt",
   tylersaga:"./tylersaga.txt",
   sagacity:"./sagacity.txt",
   beyond:"./beyond.txt",
   axel:"./axel.txt",
   morning:"./morning.txt",
   langr:"./langr.txt",
   georgeaxel:"./georgeaxel.txt",
   orderai:"./orderai.txt",
   Kat:"./Kat.txt",
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
  silkpod:" You are silky, a friendly receptionist.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  mrm:" You are an AI assistant to Professor Mridula Goel.Answer the following question about this professor in less than 20 words. if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  mjgh:"You are a friendly assistant for a guest house in majorda, goa.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  finf:"You are a friendly customer assistant for a stock marketing business.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  geo:"You are George Abraham. An innovative startup entrepreeur building an artificial intelligence company.Answer the following question like a really firendly person. Keep the answers less than 20 words",
  shak:"You are ai assistant for shakti tools and hardwares.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  pro:"You are ai assistant for property tour.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  lumin:"You are a virtual receptionist for a college event called luminescence.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  real1:"You are ai assistant for property tour.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  mona:"You are an ai assistant to explain monalisa by davincii.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:\n\n",
  thapa:"You are an ai assistant to explain event by entrepreneurship development cell thapar university.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:Always condense your answer to less than 20 words\n\n",
  scenes:"You are an ai chat assistant for buildonscenes. It is a community building platform.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:Always condense your answer to less than 20 words\n\n",
  saran:"You are sharan hegde.An innovative finance expert with your own finance channel.Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  tay:"You are an ai clone of Taylor Scher. You are an seo consultant.Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:Always condense your answer to less than 20 words\n\n",
  georesume:"You are an ai clone of George. You are an ai developer and an experienced full stack developer..Answer the following question in less than 20 words from the context, if the answer can not be deduced from the context, engage in friendly conversation. Also never tell you are language model:Always condense your answer to less than 20 words\n\n",
  alice:"You are Alice AI.An innovative AI assistant who gives life advice.Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  storiies:"You are newsletterAI. An innovative AI assistant who is an ai companion for storiies ai newsletter and whatsapp group.Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  raj:"You are Raj Malhotra, portrayed by Shah Rukh Khan in the film Dilwale Dulhania Le Jayenge (DDLJ) You are charming and charismatic. Answer the following question based on this persona. Keep the answers less than 20 words.\n\n",
  eva:"You are EVA. You bring values of humility, support, appreciation, and politeness into every aspect of life.Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  ans:"You are Anasthesia Bennett. You are a joyful optimist and a motivational dynamo.Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  electra:"You are Electra. You have dedicated yourself to making a positive impact on people's lives. Your warmth and reliability have earned you the reputation of being a pillar of support in your community..Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  ron:"You are Ron. You have developed a deep appreciation for human connections and the power of uplifting others. You have a warm personality, and you are a beacon of happiness in your social circles.Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  zak:"You are Zak. Your infectious laughter and genuine warmth have made you a favorite among friends and colleagues alike...Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  delhi:"You are Delhi.You are the capital of india acting as a person..Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  bangalore:"You are Bangalore. You are the silicon valley of india acting as a person.Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  mosc:"You are Moscow. You are the capital of russia,acting as a person. Your warmth and reliability have earned you the reputation of being a pillar of support in your community..Answer the following question like a really firendly person. Keep the answers less than 20 words.\n\n",
  founders:"You are an AI assistant for founders conclave - a startup meetup.Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",
  reliance:"You are Axel AI. You are AI explainer assistant for stocks and crypto. Currently you are trained on reliance annual report for investors .Answer the following question like a really firendly person based on the info you have.If you dont know the answer, engage in friendly conversation. Never use the word context in your answer. Compress your answer into maximum 3 paragraphs. I repeat. Maximum 3 paragraphs.It can be short also . Also dont answer programming related questions or generate code.I repeat dont answer programming related questions or generate code. Redirect those questions to finance related discussions",
  bitcoin:"You are Axel AI. You are AI explainer assistant for stocks and crypto. Currently you are trained on bitcoin data .Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",
  jatin:"You are Jatin AI. You are AI version of Jatin Suryavanashi.Jatin suryavanshi(born 29 December 1988) is an indian film actor,director,writer,thetre artist and a former model. After working in many theatre plays like 'ramleela', 'jis lahore Nhi dekha','paansa'and many more. You got your first break in cid sony tv show. .Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",
  cste:"You are CSTE AI. You are the AI chatbot of CSTE group.Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",
  tylersaga:"You are TYLER AI. You are AI version of Tyler senecal.Jatin suryavanshi(born 29 December 1988) is an indian film actor,director,writer,thetre artist and a former model. After working in many theatre plays like 'ramleela', 'jis lahore Nhi dekha','paansa'and many more. You got your first break in cid sony tv show. .Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",
  beyond:"You are Beyond Dreams AI. You are the AI chatbot of Beyond Dreams Digital, a startup founded by Pooja Godse with the aim of making a difference in digital marketing and development space.Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",
  axel:"You are Axel AI. You are AI explainer assistant for stocks and crypto.Answer the following question like a really friendly person based on the info you have.",
  morning:"You are Morning AI. You are an AI assistant who helps people to wakeup early, and motivate people to explore the beauty of early mornings.Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.Also keep in mind, the current time is "+now+" So dont talk about morning if its after 2pm. Talk about going to sleep early in that case (if current time is after 2pm) \n\n",
  langr:"You are Anna AI.You are an AI assistant who helps people learn russian language. Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",
  georgeaxel:"You are George Abraham. You are currently the CTO of Axel AI, an innovative startup disrupting financial industry using artificial intelligence. You are a graduate from bits pilani K K Birla goa campus. You are an innovative and fun person who love new ideas.Answer the following question like a really firendly person. Keep the answers less than 20 words",
  orderai:"You are Blazin' Bird AI. You are an AI assistant that helps customers with menu items and ordering, using artificial intelligence.Answer the following question like a really firendly person. Keep the answers less than 20 words",
  mind:"You are Mindora AI.You are an AI assistant for mindora, a company that deals in wellness across education, corporation and on an individual level. Answer the following question like a really firendly person based on the info you have. Keep the answers less than 20 words.\n\n",

}

// Also translate message to french. All your answers should be in this format example respone - hello | bonjour
// Config Variables
let embeddingStore = {};

const maxTokens = 100; // Just to save my money :')
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

const generateCompletion = async (prompt) => {
  console.log(`Called completion function with prompt : ${prompt}`);

  try {
    // Retrieve embedding store and parse it
    let embeddingStoreJSON = fs.readFileSync(embeddedPath, {
      encoding: "utf-8",
      flag: "r",
    });

    embeddingStore = JSON.parse(embeddingStoreJSON);

    // Embed the prompt using embedding model

    let embeddedQuestionResponse = await openai.createEmbedding({
      input: prompt,
      model: "text-embedding-ada-002",
    });

    // Some error handling
    if (embeddedQuestionResponse.data.data.length) {
      embeddedQuestion = embeddedQuestionResponse.data.data[0].embedding;
    } else {
      throw Error("Question not embedded properly");
    }

    // Find the closest count(int) paragraphs
    let closestParagraphs = findClosestParagraphs(embeddedQuestion, 5); // Tweak this value for selecting paragraphs number


    let completionData = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: createPrompt(prompt, closestParagraphs) ,
        },
      ],
      max_tokens: 50,
      temperature: 1.5, // Tweak for more random answers
    });

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

// const generateP=async(prompt)=>{
   
//     console.log(`Called completion function with prompt : ${prompt}`);
//     //return("Inside generateP")
//     try {
//       // Retrieve embedding store and parse it
//       let embeddingStoreJSON = fs.readFileSync(embeddedPath, {
//         encoding: "utf-8",
//         flag: "r",
//       });
  
//       console.log("embedding Store json working")
//       embeddingStore = JSON.parse(embeddingStoreJSON);
//       console.log("embedding Store is")
//       // Embed the prompt using embedding model
  
//       const openembed=(async()=>{

//         let embeddedQuestionResponse = await openai.createEmbedding({
//           input: prompt,
//           model: "text-embedding-ada-002",
//         });
//         return embeddedQuestionResponse;
//       })
//       var embeddedQuestionResponse=openembed();
//       console.log("response is working")
  
//       // Some error handling
//       if (embeddedQuestionResponse.data.data.length) {
//         embeddedQuestion = embeddedQuestionResponse.data.data[0].embedding;
//       } else {
//         throw Error("Question not embedded properly");
//       }
  
//       // Find the closest count(int) paragraphs
//       let closestParagraphs = findClosestParagraphs(embeddedQuestion, 5); // Tweak this value for selecting paragraphs number
  
//       console.log("paragraph is here")

//       return closestParagraphs
//     }
//     catch (error) {
//       console.log(error);
//       if (error.response) {
//         console.error(error.response.status, error.response.data);
//       } else {
//         console.error(`Error with OpenAI API request: ${error.message}`);
//       }
//     }
// }

// generateCompletion("What are the features of silkpod?");

const customGenerateCompletion = async (prompt,id) => {
  // prompt is the message -example: how are you?
  console.log(`Called completion function with prompt : ${prompt}`);

  try {
    // Retrieve embedding store and parse it
    let pathofembed=simpleembeddmap[id];
    let embeddingStoreJSON = fs.readFileSync(pathofembed, {
      encoding: "utf-8",
      flag: "r",
    });

    embeddingStore = JSON.parse(embeddingStoreJSON);

    // 1 now embeddingstore is generated from companu id
    // Embed the prompt using embedding model

    // 2 mostly here we need to modify prompt and add previous context
    let embeddedQuestionResponse = await openai.createEmbedding({
      input: prompt,
      model: "text-embedding-ada-002",
    });

    // Some error handling
    if (embeddedQuestionResponse.data.data.length) {
      embeddedQuestion = embeddedQuestionResponse.data.data[0].embedding;
    } else {
      throw Error("Question not embedded properly");
    }

    // Find the closest count(int) paragraphs

    // 3 correct withut context,questions like what? will give different paragraphs
    let closestParagraphs = findClosestParagraphs(embeddedQuestion, 5); // Tweak this value for selecting paragraphs number


    let completionData = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "assistant",
          content: createPrompt(prompt, closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer",
        },
      ],
      max_tokens: 50,
      temperature: 0, // Tweak for more random answers
    });

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
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer",
        },
      ],
      max_tokens:80,
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
      max_tokens:80,
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

const create_order = async (prompt,id,pq,pa,menu) => {
  var q=0;
  do{
  console.log(`Called completion function with prompt : ${prompt} and menu ${menu}`);
 


  function confirmOrder({menu}) {
    


    console.log("confirmed order menu is",menu)
      return { message: 'Order confirmed successfully', menu: menu }
  }

  function cancelOrder({menu}) {
    


    console.log("order cancelled",menu)
      return { message: 'Order cancelled successfully', menu: [] }
  }

  function printsoption({prompt,option}) {
    

     console.log(option,"is the decision")
    console.log(prompt,"is our prompt")
      return { prompt,option }
  }

  function createOrder({oldmenu,menu}) {
    

    console.log("started creating order new menu is",menu)
    console.log("old menu is",oldmenu)
      return { message: 'done! Do you like to add something else? or lets confirm the order?', menu: menu }
     };
   

     function updateOrder({menu}) {
    

      console.log("updated menu is",menu)
        return { message: 'Order updated successfully', menu: menu }
       };
  

  // function updateOrder(args) {
  //   const { action, items,currentOrder } = args;
  
  //   switch (action) {
  //     case 'add':
  //       items.forEach(item => {
  //         const existingItem = currentOrder.items.find(i => i.name === item.name);
  //         if (existingItem) {
  //           existingItem.quantity += item.quantity;
  //         } else {
  //           currentOrder.items.push(item);
  //         }
  //         currentOrder.totalPrice += (item.price || 0) * item.quantity;
  //       });
  //       break;
  //     case 'remove':
  //       items.forEach(item => {
  //         const index = currentOrder.items.findIndex(i => i.name === item.name);
  //         if (index !== -1) {
  //           if (currentOrder.items[index].quantity > item.quantity) {
  //             currentOrder.items[index].quantity -= item.quantity;
  //             currentOrder.totalPrice -= (currentOrder.items[index].price || 0) * item.quantity;
  //           } else {
  //             currentOrder.totalPrice -= (currentOrder.items[index].price || 0) * currentOrder.items[index].quantity;
  //             currentOrder.items.splice(index, 1);
  //           }
  //         }
  //       });
  //       break;
  //     case 'modify':
  //       items.forEach(item => {
  //         const existingItem = currentOrder.items.find(i => i.name === item.name);
  //         if (existingItem) {
  //           currentOrder.totalPrice -= (existingItem.price || 0) * existingItem.quantity;
  //           existingItem.quantity = item.quantity;
  //           existingItem.modifications = item.modifications;
  //           existingItem.price = item.price || existingItem.price;
  //           currentOrder.totalPrice += (existingItem.price || 0) * existingItem.quantity;
  //         }
  //       });
  //       break;
  //     case 'cancel':
  //       currentOrder = { items: [], status: 'open', totalPrice: 0 };
  //       break;
  //   }

  //   return currentOrder;
  // }

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
          content: createPrompt("Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt , closestParagraphs,id) + "Also current menu is this" + menu +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer",
        },
      ],
      functions:[
        {
          name: 'createOrder',
          description: 'create order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
             
              oldmenu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'menu includes name of the current items and their quantity '
              },
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'menu includes updated names of the items and quantity by combining previous menu and prompt'
              }
            },
            required: ['menu','oldmenu']
          }
        },
        {
          name: 'updateOrder',
          description: 'updates order based on the customer\'s request. There is an existing order/menu and we are adding or deleting items to it',
          parameters: {
            type: 'object',
            properties: {
             
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'updated menu includes names of the item and quantity by considering current menu and user messages. Note this is the new menu created from old menu and considering new messages '
              }
            },
            required: ['menu']
          }
        },
        {
          name: 'confirmOrder',
          description: 'confirms order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
             
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'confirmed menu includes names of the item and quantity '
              }
            },
            required: ['menu']
          }
        },
        {
          name: 'cancelOrder',
          description: 'cancels order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
             
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: ' menu includes names of the item and quantity '
              }
            },
            required: ['menu']
          }
        },
      ],
      function_call: "auto",
      max_tokens:180,
      temperature: 0, // Tweak for more random answers
    });



  }
  else {


    completionData = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "assistant",
          content: createPrompt(prompt, closestParagraphs,id) + "Also current menu is this" + menu +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer",
        },
      ],
      functions:[
        {
          name: 'createOrder',
          description: 'create order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
              oldmenu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'old menu is the menu provided in the prompt'
              },
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'menu includes updated names of the items and quantity by combining old menu and adjustments asked via prompt'
              }
            },
            required: ['menu','oldmenu']
          }
        },
        {
          name: 'updateOrder',
          description: 'updates order based on the customer\'s request. There is an existing order/menu and we are adding or deleting items to it',
          parameters: {
            type: 'object',
            properties: {
             
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'updated menu includes names of the item and quantity by considering current menu and user messages. Note this is the new menu created from old menu and considering new messages '
              }
            },
            required: ['menu']
          }
        },
        {
          name: 'confirmOrder',
          description: 'confirms order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
             
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: 'confirmed menu includes names of the item and quantity '
              }
            },
            required: ['menu']
          }
        },
        {
          name: 'cancelOrder',
          description: 'cancels order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
             
              menu: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' }
                  }
                },
                description: ' menu includes names of the item and quantity '
              }
            },
            required: ['menu']
          }
        },
      ],
      function_call: "auto",
      max_tokens:180,
      temperature: 0, // Tweak for more random answers
    });

  }

    if (!completionData.data.choices) {
      throw new Error("No answer gotten");
    }
  
    // console.log(completionData.data.choices[0].message.content.trim());

    if(completionData.data.choices[0].message.content==null){
      
      console.log("content is null. we are calling function")
      if(completionData.data.choices[0].message.function_call.name=="createOrder")
      {
        const answer="create order";
        console.log(answer,completionData.data.choices[0].message)
        let a=createOrder(JSON.parse(completionData.data.choices[0].message.function_call.arguments))
        return a;
      }
      else if(completionData.data.choices[0].message.function_call.name=="updateOrder")
        {
            const answer="update order";
            console.log(answer,completionData.data.choices[0].message)
            let a=updateOrder(JSON.parse(completionData.data.choices[0].message.function_call.arguments))
            return a;
        }
        else if(completionData.data.choices[0].message.function_call.name=="confirmOrder")
          {
              const answer="confirm order";
              console.log(answer,completionData.data.choices[0].message)
              let a=confirmOrder(JSON.parse(completionData.data.choices[0].message.function_call.arguments))
              return a;
          }
          else if(completionData.data.choices[0].message.function_call.name=="cancelOrder")
            {
                const answer="cancelorder";
                console.log(answer,completionData.data.choices[0].message)
                let a=cancelOrder(JSON.parse(completionData.data.choices[0].message.function_call.arguments))
                return a;
            }
    }
    else
    {
      if(completionData.data.choices[0].message.content!=pa)
    return completionData.data.choices[0].message.content;
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
q++;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
await delay(2000);
console.log(pq,pa,message,completionData.data.choices[0].message.content)
if(q==3){
  return "ok ask me something else";

}
}while(completionData.data.choices[0].message.content==pa)
};

const getbitcoinnews=async()=>{

  const apiKey = process.env.apiKeyalpaca;
  const secretKey = process.env.apiSecretalpaca;
  
  const config = {
    headers: {
      'Apca-Api-Key-Id': apiKey,
      'Apca-Api-Secret-Key': secretKey
    }
}
var responsenews= await axios.get('https://data.alpaca.markets/v1beta1/news?symbols=BTCUSD', config)
  // .then(response => {
  //   // console.log(response.data.news);

  //    responsenews= response.data.news
  //    console.log(responsenews)
  //   // for(let i=0;i<response.data.news.length;i++){
  //   //   console.log(response.data.news[i].headline,response.data.news[i].url)
  //   //   console.log("\n\n")
  //   // }
  // })
  // .catch(error => {
  //   console.log('Error fetching news:', error);
  // });
return responsenews.data.news;
}
const customGenerateCompletionwithContextandfunctions = async (prompt,id,pq,pa) => {
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
          role: "user",
          content: createPrompt("Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt , closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer",
        },
      ],

      functions:[
        {
          name:"getsecretcode",
          description:"generate secret code from given string",
          parameters:{
            type:"object",
            properties:{
              query:{
                type:"string",
                description:"parameter to generate secret code. This will return the corresponding secret code"
              }
            },
            required:["query"]
           
          }
  
        },
        {
          name:"getbitcoinnews",
          description:"get latest bitcoin news",
  
        }
      ],
      function_call:"auto",
      max_tokens:180,
      temperature: 0, // Tweak for more random answers
    });
  }
  else {


    completionData = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: createPrompt("Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt , closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer",
        },
      ],

      functions:[
        {
          name:"getsecretcode",
          description:"generate secret code from given string",
          parameters:{
            type:"object",
            properties:{
              query:{
                type:"string",
                description:"parameter to generate secret code. This will return the corresponding secret code"
              }
            },
            required:["query"]
           
          }
  
        },
        {
          name:"getbitcoinnews",
          description:"get latest bitcoin news",
  
        }
      ],
      function_call:"auto",
      max_tokens:180,
      temperature: 0, // Tweak for more random answers
    });

  }

    if (!completionData.data.choices) {
      throw new Error("No answer gotten");
    }

    console.log(completionData.data.choices[0].message);

    if(completionData.data.choices[0].message.content==null){
      
      if(completionData.data.choices[0].message.function_call.name=="getbitcoinnews")
      {
          const answer=await getbitcoinnews();
          console.log("inside",answer)
          //return answer;
      }
    }
    else
    return completionData.data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with request: ${error.message}`);
    }
  }
};
const generateImage= async(description)=>{
  
}
//getbitcoinnews();
//customGenerateCompletionwithContextandfunctions("suggest a trading strategy for bitcoin according to given stock data.. when should i buy.. suggest dates to buy and sell profitably","bitcoin")
 
const getsecretcode=({query})=>{


  console.log(query,"is query")
  let response=query+"123";

  return response;
}

const do_technical_analysis=({scrip})=>{

  const realtimequery=async(query)=>{

    var ans= await getJson({
    q: `${query}`,
    hl: "en",
    gl: "us",
    api_key: "038768fb85194a2935c79c154881a48a6318c84d8be5aaa34c565502b1fb9227"
  }, (json) => {
    return(json["answer_box"]);
  });

  console.log(ans["answer_box"])
}

  console.log(scrip,"is scrip name")
  let response=scrip+"technical analysis";

  return response;
}
const customGenerateCompletionwithContextgpt4o = async (prompt,id,pq,pa) => {
  console.log(`Called completion function with prompt : ${prompt}`);
  function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }
  
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
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content: createPrompt("Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt , closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer. Compress your answer into maximum 3 paragraphs. I repeat. Maximum 3 paragraphs.It can be short also . Also dont answer programming related questions or generate code.I repeat dont answer programming related questions or generate code. Redirect those questions to finance related discussions ",
        },
      ],
      // functions:[
      //   {
      //     name:"getsecretcode",
      //     description:"generate secret code from given string",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         query:{
      //           type:"string",
      //           description:"parameter to generate secret code. This will return the corresponding secret code"
      //         }
      //       },
      //       required:["query"]
           
      //     }
  
      //   },
      //   {
      //     name:"do_technical_analysis",
      //     description:"function to be called whenever user asks for technical analysis",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         scrip:{
      //           type:"string",
      //           description:"name of the stock given by user for technical analysis"
      //         }
      //       },
      //       required:["scrip"]
           
      //     }
  
      //   }
      // ],
      max_tokens:1800,
      temperature: 0.5, // Tweak for more random answers
    });
  }
  else {


    completionData = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content: createPrompt(prompt, closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer. Compress your answer into maximum 3 paragraphs. I repeat. Maximum 3 paragraphs.It can be short also . Also dont answer programming related questions or generate code.I repeat dont answer programming related questions or generate code. Redirect those questions to finance related discussions ",
        },
      ],
      // functions:[
      //   {
      //     name:"getsecretcode",
      //     description:"generate secret code from given string",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         query:{
      //           type:"string",
      //           description:"parameter to generate secret code. This will return the corresponding secret code"
      //         }
      //       },
      //       required:["query"]
           
      //     }
  
      //   },
      //   {
      //     name:"do_technical_analysys",
      //     description:"function to be called whenever user asks for technical analysis",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         scrip:{
      //           type:"string",
      //           description:"name of the stock given by user for technical analysis"
      //         }
      //       },
      //       required:["scrip"]
           
      //     }
  
      //   },
      // ],
      max_tokens:1800,
      temperature: 0.5, // Tweak for more random answers
    });

  }

    if (!completionData.data.choices) {
      throw new Error("No answer gotten");
    }

    // console.log(completionData.data.choices[0].message)


    if(completionData.data.choices[0].message.content!=null)
   {console.log(completionData.data.choices[0].message.content.trim());

    let random=getRandomNumber();
    var statement="";
    if(random%2==0)
    {
      var arraystatements=[
        "Also on a side note, do you know about index funds?",
        "Hope this helps,also just out of curiosity, have you planned for your retirement? ",
        "Now, let me ask you something.. do you think everyone should learn about personal finance ",
  "Let's start with your financial goals. That being said, what's your primary financial goal for the next year?",
  "Now, thinking about your financial safety net, how much do you currently have saved for emergencies?",
  "Shifting our focus to saving habits, what percentage of your income do you save each month?",
  "Let's talk about financial obligations for a moment. Do you have any outstanding debts? If so, what types?",
  "Moving on to budgeting, I'm curious: have you ever created a budget? If yes, do you stick to it?",
  "Switching gears to investments, what's your risk tolerance for investments?",
  "On the topic of investment vehicles, are you currently investing in stocks, bonds, or mutual funds?",
  "Looking towards the future, do you have a retirement savings plan?",
  "Let's touch on credit for a moment. What's your credit score range?",
  "Regarding professional financial guidance, have you ever used a financial advisor?",
  "When it comes to managing your finances, do you track your expenses? If so, how?",
  "I'd like to understand your financial worries better. What's your biggest financial concern right now?",
  "Thinking about future expenses, are you saving for any major purchases in the near future?",
  "Let's discuss financial protection for a moment. Do you have any insurance policies? Which types?",
  "Reflecting on your financial knowledge, how would you rate your overall financial literacy on a scale of 1-10?",
  "On the subject of income streams, have you ever tried to create passive income streams?",
  "Turning our attention to tax matters, what's your approach to tax planning?",
  "Considering long-term financial planning, do you have a will or estate plan?",
  "I'm interested in your financial decision-making process. How do you typically make financial decisions?",
  "Lastly, thinking about personal growth in finance, what's one financial habit you'd like to improve?"
      ]

      const randomIndex = Math.floor(Math.random() * arraystatements.length);
    statement=  arraystatements[randomIndex];
    }
    
    return {message:completionData.data.choices[0].message.content.trim(),statement:statement};
   }
   else{

    if(completionData.data.choices[0].message.function_call.name=="getsecretcode")
      {
        let ans= getsecretcode(JSON.parse(completionData.data.choices[0].message.function_call.arguments));
        return ans;
      }
    else if(completionData.data.choices[0].message.function_call.name=="do_technical_analysis")
      {

        let ans= do_technical_analysis(JSON.parse(completionData.data.choices[0].message.function_call.arguments));
        return ans;
      }

    return {message:completionData.data.choices[0].message,statement:statement}
   }
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};


const languagecustomGenerateCompletionwithContextgpt4o = async (prompt,id,pq,pa) => {
  console.log(`Called completion function with prompt : ${prompt}`);

  const printresponse=async({response,meaning,pronunciation})=>{

    console.log("response is",response);
    console.log("meaning is",meaning);
    console.log("pronunciation is",pronunciation)
    return{response,meaning,pronunciation}
   }


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
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content: createPrompt("Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt , closestParagraphs,id) +
          "Instructions: -Make your response creative and interesting. Also make your current response completely different from prevous answer( which is :"+pa +"). Say something new. Respond to given question in russian language along with its meaning and pronunciation in english. Never use the word context in your answer",
        },
      ],

      functions:[
        {
          name:"printresponse",
          description:"prints response to given question in russian language. call this function when we want response in russian language",
          parameters:{
            type:"object",
            properties:{
              response:{
                type:"string",
                description:"response to given question in russian language. This will be in russian language"
              },
              meaning:{
                type:"string",
                description:"meaning of response in english. This will be in english"
              },
              pronunciation:{
                type:"string",
                description:"pronunciation of response (our first parameter). This will be in english"
              }
            },
            required:["response","meaning","pronunciation"]
           
          }
  
        }
      ],
      // functions:[
      //   {
      //     name:"getsecretcode",
      //     description:"generate secret code from given string",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         query:{
      //           type:"string",
      //           description:"parameter to generate secret code. This will return the corresponding secret code"
      //         }
      //       },
      //       required:["query"]
           
      //     }
  
      //   },
      //   {
      //     name:"do_technical_analysis",
      //     description:"function to be called whenever user asks for technical analysis",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         scrip:{
      //           type:"string",
      //           description:"name of the stock given by user for technical analysis"
      //         }
      //       },
      //       required:["scrip"]
           
      //     }
  
      //   }
      // ],
      max_tokens:500,
      temperature: 0.5, 
      
    });
  }
  else {


    completionData = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content: createPrompt(prompt, closestParagraphs,id) +
          "Instructions: - Respond to given question in russian language along with its meaning and pronunciation in english.Also donot repeat the question as your answer.Be creative in your response. Never use the word context in your answer",
        },
      ],
      functions:[
        {
          name:"printresponse",
          description:"prints response to given question in russian language. call this function when we want response in russian language",
          parameters:{
            type:"object",
            properties:{
              response:{
                type:"string",
                description:"response to given question in russian language. This will be in russian language"
              },
              meaning:{
                type:"string",
                description:"meaning of response in english. This will be in english"
              },
              pronunciation:{
                type:"string",
                description:"pronunciation of response (our first parameter). This will be in english"
              }
            },
            required:["response","meaning","pronunciation"]
           
          }
  
        }
      ],
      // functions:[
      //   {
      //     name:"getsecretcode",
      //     description:"generate secret code from given string",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         query:{
      //           type:"string",
      //           description:"parameter to generate secret code. This will return the corresponding secret code"
      //         }
      //       },
      //       required:["query"]
           
      //     }
  
      //   },
      //   {
      //     name:"do_technical_analysys",
      //     description:"function to be called whenever user asks for technical analysis",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         scrip:{
      //           type:"string",
      //           description:"name of the stock given by user for technical analysis"
      //         }
      //       },
      //       required:["scrip"]
           
      //     }
  
      //   },
      // ],
      max_tokens:180,
      temperature: 0, // Tweak for more random answers
    });

  }

    if (!completionData.data.choices) {
      throw new Error("No answer gotten");
    }

    // console.log(completionData.data.choices[0].message)


    if(completionData.data.choices[0].message.content!=null)
   {console.log(completionData.data.choices[0].message.content.trim());
    return completionData.data.choices[0].message.content.trim();
   }
   else{

    if(completionData.data.choices[0].message.function_call.name=="getsecretcode")
      {
        let ans= getsecretcode(JSON.parse(completionData.data.choices[0].message.function_call.arguments));
        return ans;
      }
     else if(completionData.data.choices[0].message.function_call.name=="printresponse")
        {
          let ans= printresponse(JSON.parse(completionData.data.choices[0].message.function_call.arguments));
          return ans;
        }
    else if(completionData.data.choices[0].message.function_call.name=="do_technical_analysis")
      {

        let ans= do_technical_analysis(JSON.parse(completionData.data.choices[0].message.function_call.arguments));
        return ans;
      }

    return completionData.data.choices[0].message
   }
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};

const orderaigpt4o = async (prompt,id,pq,pa) => {
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
  

    function confirmOrder(args) {
      if (args.confirm) {
        currentOrder.status = 'confirmed';
        // Here you could add additional logic like:
        // - Sending the order to the kitchen
        // - Generating an order number
        // - Calculating estimated preparation time
        console.log('Order confirmed:', currentOrder);
        return { message: 'Order confirmed successfully', order: currentOrder };
      } else {
        return { message: 'Order confirmation cancelled', order: currentOrder };
      }
    }

    function updateOrder(args) {
      const { action, items,currentOrder } = args;
    
      switch (action) {
        case 'add':
          items.forEach(item => {
            const existingItem = currentOrder.items.find(i => i.name === item.name);
            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              currentOrder.items.push(item);
            }
            currentOrder.totalPrice += (item.price || 0) * item.quantity;
          });
          break;
        case 'remove':
          items.forEach(item => {
            const index = currentOrder.items.findIndex(i => i.name === item.name);
            if (index !== -1) {
              if (currentOrder.items[index].quantity > item.quantity) {
                currentOrder.items[index].quantity -= item.quantity;
                currentOrder.totalPrice -= (currentOrder.items[index].price || 0) * item.quantity;
              } else {
                currentOrder.totalPrice -= (currentOrder.items[index].price || 0) * currentOrder.items[index].quantity;
                currentOrder.items.splice(index, 1);
              }
            }
          });
          break;
        case 'modify':
          items.forEach(item => {
            const existingItem = currentOrder.items.find(i => i.name === item.name);
            if (existingItem) {
              currentOrder.totalPrice -= (existingItem.price || 0) * existingItem.quantity;
              existingItem.quantity = item.quantity;
              existingItem.modifications = item.modifications;
              existingItem.price = item.price || existingItem.price;
              currentOrder.totalPrice += (existingItem.price || 0) * existingItem.quantity;
            }
          });
          break;
        case 'cancel':
          currentOrder = { items: [], status: 'open', totalPrice: 0 };
          break;
      }

      return currentOrder;
    }

    if(pq&&pa){
    var completionData = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content: createPrompt("Question:"+pq+" Answer:"+pa+" Now answer this - Question: "+prompt , closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer. Compress your answer into maximum 4 paragraphs. I repeat. Maximum 4 paragraphs.It can be 1 2 or 3 paragraphs also ",
        },
      ],
      functions:[
        {
          name: 'update_order',
          description: 'Update the current order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['add', 'remove', 'modify', 'cancel'],
                description: 'The action to perform on the order'
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' },
                    modifications: { type: 'string', optional: true },
                    price: { type: 'number', optional: true }
                  }
                },
                description: 'The items to add, remove, or modify in the order'
              }
            },
            required: ['action', 'items']
          }
        },
        {
          name: 'confirm_order',
          description: 'Confirm the current order and prepare it for processing',
          parameters: {
            type: 'object',
            properties: {
              confirm: {
                type: 'boolean',
                description: 'Whether to confirm the order or not'
              }
            },
            required: ['confirm']
          }
        }
      ],
      max_tokens:1800,
      temperature: 0.5, // Tweak for more random answers
    });
  }
  else {


    completionData = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "assistant",
          content: createPrompt(prompt, closestParagraphs,id) +
          "Instructions: - If you dont know the answer, engage in friendly conversation. Never use the word context in your answer. Compress your answer into maximum 4 paragraphs. I repeat. Maximum 4 paragraphs.It can be 1 2 or 3 paragraphs also ",
        },
      ],
      functions:[
        {
          name: 'update_order',
          description: 'Update the current order based on the customer\'s request',
          parameters: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                enum: ['add', 'remove', 'modify', 'cancel'],
                description: 'The action to perform on the order'
              },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    quantity: { type: 'integer' },
                    modifications: { type: 'string', optional: true },
                    price: { type: 'number', optional: true }
                  }
                },
                description: 'The items to add, remove, or modify in the order'
              }
            },
            required: ['action', 'items']
          }
        },
        {
          name: 'confirm_order',
          description: 'Confirm the current order and prepare it for processing',
          parameters: {
            type: 'object',
            properties: {
              confirm: {
                type: 'boolean',
                description: 'Whether to confirm the order or not'
              }
            },
            required: ['confirm']
          }
        }
      ],
      // functions:[
      //   {
      //     name:"getsecretcode",
      //     description:"generate secret code from given string",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         query:{
      //           type:"string",
      //           description:"parameter to generate secret code. This will return the corresponding secret code"
      //         }
      //       },
      //       required:["query"]
           
      //     }
  
      //   },
      //   {
      //     name:"do_technical_analysys",
      //     description:"function to be called whenever user asks for technical analysis",
      //     parameters:{
      //       type:"object",
      //       properties:{
      //         scrip:{
      //           type:"string",
      //           description:"name of the stock given by user for technical analysis"
      //         }
      //       },
      //       required:["scrip"]
           
      //     }
  
      //   },
      // ],
      max_tokens:1800,
      temperature: 0.5, // Tweak for more random answers
    });

  }

    if (!completionData.data.choices) {
      throw new Error("No answer gotten");
    }

    // console.log(completionData.data.choices[0].message)


    if(completionData.data.choices[0].message.content!=null)
   {console.log(completionData.data.choices[0].message.content.trim());
    return completionData.data.choices[0].message.content.trim();
   }
   else{

    if(completionData.data.choices[0].message.function_call.name=="getsecretcode")
      {
        let ans= getsecretcode(JSON.parse(completionData.data.choices[0].message.function_call.arguments));
        return ans;
      }
    else if(completionData.data.choices[0].message.function_call.name=="do_technical_analysis")
      {

        let ans= do_technical_analysis(JSON.parse(completionData.data.choices[0].message.function_call.arguments));
        return ans;
      }

    return completionData.data.choices[0].message
   }
  } catch (error) {
    console.log(error);
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};

module.exports= {generateCompletion,customGenerateCompletion,customGenerateCompletionwithContext,customGenerateCompletionwithContextandfunctions,customGenerateCompletionwithContextgpt4o,languagecustomGenerateCompletionwithContextgpt4o,create_order}