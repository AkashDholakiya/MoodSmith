"use client"

import * as React from "react"
import { Button } from "../components/ui/button"
import { useChat } from "ai/react"
import { useState, useCallback } from "react"
import { getDoc, doc } from "firebase/firestore";
import { rdb } from './firebase'
import { ref, get, push } from "firebase/database";
import { db, auth } from "./firebase";
import parse from 'html-react-parser';


export default function ChatContainer() {
  const [userdata, setUserData] = useState(null);
  const customVariable = ""; 


  const { messages, input, handleInputChange, handleSubmit, error, isLoading, setMessages } = useChat({
    experimental_prepareRequestBody: ({messages}) => {
      return {
        messages: messages, 
        customVariable: userdata?.customInstructions || customVariable, 
      };
    },
  });

  React.useEffect (() => {
    const chatContain = document.getElementById("chat-contain");
    if (chatContain) {
      chatContain.scrollTop = chatContain.scrollHeight;
    }

    if(!isLoading) {
      saveMessage();
    }
  }
  , [isLoading]);

  
  const saveMessage = () => {
    if (messages.length > 0 && auth.currentUser) {
      const userMessage = messages[messages.length - 2];
      const message = messages[messages.length - 1];
      
      // Log the message to ensure it is not undefined or null
      console.log('Message to save:', message);
      
      // Remove `experimental_attachments` if it exists
      delete message.experimental_attachments;
      delete userMessage.experimental_attachments;
  
      if (message) {
        // Create a reference to the user's messages
        const dbRef = ref(rdb, `messages/${auth.currentUser.uid}`);
        
        // Use `push` to generate a unique ID
        push(dbRef, userMessage)
          .then(() => {
            console.log('User message saved successfully!');
          }
          )

        push(dbRef, message)
          .then(() => {
            console.log('Message saved successfully!');
          })
          .catch((error) => {
            console.error('Error saving message:', error);
          });
      } else {
        console.error('Message is undefined or null');
      }
    } else {
      console.log('No user authenticated or no messages to save.');
    }
  };

  React.useEffect (() => {
    const fetchData = async () => {
      if(!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser?.uid);
      const docSnap = await getDoc(docRef);

      const dbRef = ref(rdb, `messages/${auth.currentUser?.uid}`);
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const messagesData = [];
          snapshot.forEach((message) => {
            messagesData.push(message.val());
          });
          setMessages(messagesData);

          const scroll = document.getElementById("chat-contain");
          scroll.scrollTop = scroll.scrollHeight
          
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
      

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserData(docSnap.data());
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
 
  }, []);
  
  return (
    <form className="h-[90%] flex scroll-smooth flex-col w-full justify-center items-center bg-background" onSubmit={handleSubmit}>
      <div id="chat-contain" className="scroll-smooth w-1/2 max-lg:w-full h-full py-2 overflow-y-auto bg-background text-foreground">
        <div className="flex-1 p-4 space-y-4">
          {messages && messages.length > 0 && messages.map((message, index) => {
            return (
              <div className={`flex max-w-full`} key={message.id}>
                <div className={`${message.role === "assistant" ? "flex justify-start w-full" : "flex justify-end w-full"} py-1.5 max-w-full rounded-md`}>
                  <div className={`w-3/4 flex max-w-full ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    <div className="bg-secondary p-2.5 max-w-full break-words text-justify rounded-xl">{parse(message.content)}</div>
                  </div>
                </div>
              </div>
          )})}
        </div>
      </div>
      <div className="py-2 w-1/2 max-lg:w-full max-lg:px-2 flex space-x-2">
        <input onChange={handleInputChange} value={input} className="w-full py-2 rounded-md border-2  px-4 focus:border-2 focus:outline-none bg-transparent border-gray-600" placeholder="Type your message..." />
        <Button className="border-2 h-full border-gray-600" variant="primary">Send</Button>
      </div>
    </form>
  )
}
