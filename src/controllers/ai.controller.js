const { OpenAI } = require('openai'); // Optional: if you add real AI later


const chat = async (req, res) => {
    try {
        const { message } = req.body;
        const lowMessage = message.toLowerCase();

        let response = "I'm not sure about that. Try asking about our services, how to post a job, or contact support.";

        if (lowMessage.includes('hello') || lowMessage.includes('hi')) {
            response = "Hello! I am your Tayolar assistant. How can I help you today?";
        } else if (lowMessage.includes('job') || lowMessage.includes('post')) {
            response = "You can post a job by going to the 'Post Job' page. Desribe what you need, set your budget, and tailors will apply.";
        } else if (lowMessage.includes('service') || lowMessage.includes('shop')) {
            response = "Check out our 'Shop' to see services offered by expert tailors. You can browse, filter, and order directly.";
        } else if (lowMessage.includes('contact') || lowMessage.includes('support')) {
            response = "You can reach our support team at support@tayolar.com or visit the Help & Support page.";
        } else if (lowMessage.includes('payment') || lowMessage.includes('pay')) {
            response = "We process payments securely. Tailors receive payment after you confirm the work is completed.";
        }

        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 500));

        res.json({ response });
    } catch (error) {
        console.error('AI Chat error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { chat };
