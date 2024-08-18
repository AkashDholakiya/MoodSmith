"use client"

import * as React from "react"
import { Button } from "../components/ui/button"
import { useChat } from "ai/react"
import { useState } from "react"
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";

export default function ChatContainer() {
  const [userdata, setUserData] = useState(null);
  const customVariable = "Custom Instruction or Data"; // Your custom variable

  const { messages, input, handleInputChange, handleSubmit, error, isLoading, setMessages } = useChat({
    experimental_prepareRequestBody: ({messages}) => {
      return {
        messages: messages, 
        customVariable: customVariable, 
      };
    },
  });

  React.useEffect (() => {
    const chatContain = document.getElementById("chat-contain");
    if (chatContain) {
      chatContain.scrollTop = chatContain.scrollHeight;
    }
  }
  , [isLoading]);

  React.useEffect (() => {
    const fetchData = async () => {
      if(!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser?.uid);
      const docSnap = await getDoc(docRef);
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
    <form className="h-[90%] flex flex-col w-full justify-center items-center bg-background" onSubmit={handleSubmit}>
      <div id="chat-contain" className="w-1/2 max-lg:w-full h-full py-2 overflow-y-auto bg-background text-foreground">
        <div className="flex-1 p-4 space-y-4">
          {messages.map((message, index) => {
            return (
              <div className={`flex w-full`} key={message.id}>
                <div className={`${message.role === "assistant" ? "flex justify-start w-full" : "flex justify-end w-full"} py-1.5 rounded-md`}>
                  <div className={`w-3/4 flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                    <p className="bg-secondary p-2.5 text-justify rounded-xl">{message.content}</p>
                  </div>
                </div>
              </div>
          )})}
        </div>
      </div>
      <div className="py-2 w-1/2 max-lg:w-full max-lg:px-2 flex space-x-2">
        <input onChange={handleInputChange} value={input} className="w-full py-2 rounded-md border-2 bg-transparent px-4 focus:border-2 focus:outline-none" placeholder="Type your message..." />
        <Button className="border-2 h-full" variant="primary">Send</Button>
      </div>
    </form>
  )
}
