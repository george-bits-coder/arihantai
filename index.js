const express = require('express');
const { customGenerateCompletionwithContext,intentcompletion,goetheResponse,ennegramResponse} =require('./completion');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors()); // Add this line
const {arihantdetails}=require("./arihant.js")
const {enneagramdetails}=require("./enneagram.js")
const {fortaledetails}=require("./fortale.js")
const { openai } = require("./utils/helper");

// Parse JSON bodies (needed for POST requests)
app.use(express.json()); 
app.get('/hi', (req, res) => {
  res.json({ message: "Hello!" });
});



app.post('/arihantcontext', async(req,res)=>{


  console.log(req.body,"request hello")
    const {message,pq,pa}=req.body;
    console.log("message inside api is",message)
    // res.json({message:message})
    let company="arihantai";
    const context = await arihantdetails(message);
   const response=await customGenerateCompletionwithContext(message,company,pq,pa);
   
  console.log(response,"is response")

  if(response){

      
      res.json({message:response})
}
 })



const feedbackQuestions = [
  {
    id: 1,
    question: "How satisfied are you with our product/service?",
    type: "scale",
    options: ["Very unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very satisfied"],
    followUp: {
      condition: ["Very unsatisfied", "Unsatisfied"],
      question: "What specifically disappointed you about our product/service?"
    }
  },
  {
    id: 2,
    question: "What features do you value the most in our product?",
    type: "text",
    maxLength: 200
  },
  {
    id: 3,
    question: "How likely are you to recommend us to others?",
    type: "scale",
    options: ["Not likely", "Slightly likely", "Likely", "Very likely", "Extremely likely"]
  },
  {
    id: 4,
    question: "What could we improve to better meet your needs?",
    type: "text",
    maxLength: 300
  },
  {
    id: 5,
    question: "Any additional comments or feedback?",
    type: "text",
    optional: true
  }
];

app.post('/feedbackai', async (req, res) => {
  try {
    const { currentQuestionId, userResponse, conversationHistory } = req.body;
    
    // Get current question
    const currentQuestion = feedbackQuestions.find(q => q.id === currentQuestionId);
    if (!currentQuestion) {
      throw new Error('Question not found');
    }
    
    // Generate AI response based on user's answer
    const aiResponse = await generateAIResponse(currentQuestion, userResponse, conversationHistory);
    
    // Determine next question
    let nextQuestion = null;
    let isComplete = false;
    
    // Check if current question has follow-up based on response
    if (currentQuestion.followUp && 
        currentQuestion.followUp.condition.includes(userResponse)) {
      nextQuestion = {
        id: currentQuestion.id + 0.1, // Use decimal for follow-ups
        question: currentQuestion.followUp.question,
        type: "text",
        isFollowUp: true
      };
    } else {
      // Get next main question
      const currentIndex = feedbackQuestions.findIndex(q => q.id === currentQuestionId);
      if (currentIndex < feedbackQuestions.length - 1) {
        nextQuestion = feedbackQuestions[currentIndex + 1];
      } else {
        isComplete = true;
      }
    }
    
    res.json({
      aiResponse,
      nextQuestion: isComplete ? null : nextQuestion,
      isComplete
    });
    
  } catch (error) {
    console.error("Error in /feedbackai:", error);
    res.status(500).json({
      aiResponse: "I encountered an issue processing your feedback. Please try again.",
      nextQuestion: null,
      isComplete: false
    });
  }
});

async function generateAIResponse(question, userResponse, conversationHistory) {
  try {
    let prompt = `You're analyzing feedback responses for a company. Provide a thoughtful, empathetic response to the user's feedback before moving to the next question.
    
Current Question: ${question.question}
User Response: "${userResponse}"

Guidelines:
1. Acknowledge their response
2. If positive, express appreciation
3. If negative, show empathy and understanding
4. Keep response brief (1-2 sentences)
5. Transition naturally to next question if applicable

Response:`;
    
    if (conversationHistory && conversationHistory.length > 0) {
      prompt += `\n\nConversation Context:\n${conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`
      ).join('\n')}`;
    }
    
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });
    
    return completion.choices[0].message.content.trim();
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Thank you for sharing that feedback. Let's continue.";
  }
}


app.post('/intentai', async(req, res) => {
  try {
    const { message, pq, pa, node } = req.body;
    console.log("Received request:", { message, pq, pa, node });
    
    const response = await intentcompletion(message, pq, pa, node);
    const currentChapter = response.chapterTitle;
    const currentWords = response.currentChapterWords || []; // Get all words for current chapter
    
    console.log("Response from intentcompletion:", response);
    
    res.json({
      message: response.message,
      currentWord: response.currentWord,
      isQuiz: response.isQuiz,
      chapterTitle: currentChapter,
      currentChapterWords: currentWords, // Send all words for the chapter
      node: node + 1
    });
  } catch (error) {
    console.error("Error in /intentai:", error);
    res.status(500).json({
      text: "Désolé, je rencontre un problème technique. Pouvez-vous répéter votre question?",
      currentWord: null,
      isQuiz: false,
      chapterTitle: "",
      currentChapterWords: [],
      node: req.body.node
    });
  }
});

app.post('/goethe', async (req, res) => {
  console.log(req.body, "Goethe request");
  const { message, pq, pa } = req.body;
  
  try {
    const response = await goetheResponse(pq, pa, message);
    console.log(response, "Goethe response");
    
    if (response) {
      res.json({ message: response });
    } else {
      res.status(500).json({ error: "Failed to generate Goethe response" });
    }
  } catch (error) {
    console.error("Error in Goethe endpoint:", error);
    res.status(500).json({ 
      error: "An error occurred while processing your request",
      details: error.message 
    });
  }
});

app.post('/ennegram', async (req, res) => {
  console.log(req.body, "Ennegram request");
  const { message, pq, pa } = req.body;
  
  try {
    const response = await ennegramResponse(pq, pa, message);
    console.log(response, "Ennegram response");


           const context = await enneagramdetails(message);


    if (response) {
      res.json({ message: response, parameters: context });
    } else {
      res.status(500).json({ error: "Failed to generate Ennegram response" });
    }
  } catch (error) {
    console.error("Error in Ennegram endpoint:", error);
    res.status(500).json({ 
      error: "An error occurred while processing your request",
      details: error.message 
    });
  }
});


app.post('/arihantai0976', async(req,res)=>{


  console.log(req.body,"request hello")
    const {message,pq,pa}=req.body;
    console.log("message inside api is",message)
    // res.json({message:message})
    let company="arihantai";
   const response=await customGenerateCompletionwithContext(message,company,pq,pa);
       const context = await arihantdetails(message);

  console.log(response,"is response")

  if(response){

      
      res.json({message:response,parameters:context})
}
 })

app.post('/invest', async(req,res)=>{


  console.log(req.body,"request hello")
    const {message,pq,pa}=req.body;
    console.log("message inside api is",message)
    // res.json({message:message})
    let company="invest";
   const response=await customGenerateCompletionwithContext(message,company,pq,pa);

  console.log(response,"is response")

  if(response){
      res.json({message:response})
}
 })

app.post('/fortale', async(req,res)=>{

  console.log(req.body,"request hello")
    const {message,pq,pa}=req.body;
    console.log("message inside api is",message)
    // res.json({message:message})
    let company="fortale";
   const response=await customGenerateCompletionwithContext(message,company,pq,pa);
       const context = await fortaledetails(message);

  console.log(response,"is response")

  if(response){
      res.json({message:response,parameters:context})
}
 })

app.post('/vijay', async(req,res)=>{

  console.log(req.body,"request hello")
    const {message,pq,pa}=req.body;
    console.log("message inside api is",message)
    // res.json({message:message})
    let company="vijay";
   const response=await customGenerateCompletionwithContext(message,company,pq,pa);

  console.log(response,"is response")

  if(response){
      res.json({message:response})
}
 })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 



