
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
require('dotenv').config();


const configuration = new Configuration({
  apiKey: process.env.apikey5,
});
const openai = new OpenAIApi(configuration);

// const openai = new OpenAIApi(configuration);


const API_URL = 'https://api.openai.com/v1/audio/speech';
const OPENAI_API_KEY = process.env.apikey5; // Replace with your actual key



// async function main() {

// // get audio URL
// // const url = googleTTS.getAudioUrl('Hi this is a nice report', {
// //   lang: 'en',
// //   slow: false,
// //   host: 'https://translate.google.com',
// // });
// // console.log(url);




// }
// main();

async function minddetails(discussion) {

const printdetails=({is_human,is_booking,is_offer,is_intro})=>{
 
  console.log(is_human);
  console.log(is_booking);
  
  return {is_human,is_booking,is_offer,is_intro}
  }
  try {
      const response = await openai.createChatCompletion({
          model: "gpt-4o-mini",
          messages: [
              { role: "system", content: "You are an assistant that extracts specifics from discussions." },
              { role: "user", content: `Extract the specifics from the following discussion.: ${discussion}` },
          ],
          functions:[
            {
            name: 'printdetails',
            description: 'prints the specifics from discussion',
            parameters:{
              type:"object",
              properties:{
                is_human:{
                  "type": "boolean",
                    "enum": [true, false],
                    "description": "indicates whether the user is asking specifically to talk to a human. Meaning instead of ai chat user wants to talk to an actual human. This is false if user is asking to book a room"
                },
                 is_offer: {
                    "type": "boolean",
                    "enum": [true, false],
                    "description": "indicates whether the user is asking specifically to get offer "
                  },
                    is_intro: {
                    "type": "boolean",
                    "enum": [true, false],
                    "description": "indicates whether the user is asking specifically to get an idea/ overview or intro about mindora "
                  },


                
                },
                
              required:["is_human","is_booking"]
             
            }
               
          }],
          function_call:{ name: 'printdetails'},
          temperature: 0.2,
      });

      const reply = response.data.choices[0].message;
console.log(reply)

     if(reply.content==null)
     {
        if(reply.function_call.name=="printdetails")
        {
          var ans=printdetails(JSON.parse(reply.function_call.arguments));
          return ans;
        }
     }
     else return {is_human:false,is_booking:false};
  } catch (error) {
      console.error("Error extracting mind details:", error.response.data);
      return {is_human:false,is_booking:false};;
  }
}


// (async () => {
//   const discussion = "I think Apple stock is going to go up this quarter.";
//   const symbol = await getTradingViewSymbol(discussion);
//   console.log("TradingView Symbol:", symbol); // Should return "AAPL"
// })();

module.exports= {minddetails}