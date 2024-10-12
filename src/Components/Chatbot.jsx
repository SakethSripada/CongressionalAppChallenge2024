import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    const scriptConfig = document.createElement('script');
    scriptConfig.innerHTML = `
      window.embeddedChatbotConfig = {
        chatbotId: "ftwSqUjOUzL7qEW0HRdwC",
        domain: "www.chatbase.co"
      };
    `;
    document.body.appendChild(scriptConfig);

    const scriptEmbed = document.createElement('script');
    scriptEmbed.src = 'https://www.chatbase.co/embed.min.js';
    scriptEmbed.setAttribute('chatbotId', 'ftwSqUjOUzL7qEW0HRdwC');
    scriptEmbed.setAttribute('domain', 'www.chatbase.co');
    scriptEmbed.defer = true;
    document.body.appendChild(scriptEmbed);

    return () => {
      document.body.removeChild(scriptConfig);
      document.body.removeChild(scriptEmbed);
    };
  }, []);

  return null;
};

export default Chatbot;  
