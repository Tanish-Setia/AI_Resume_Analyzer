const { GoogleGenAI } = require('@google/genai');

const analyzeResumeWithAI = async (resumeText, jobDescription = '') => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let prompt = `
You are an expert HR consultant and ATS specialist. Analyze the following resume and return a JSON response with: 
- overallScore (0-100)
- strengths (array of strings)
- weaknesses (array of strings)
- missingKeywords (array of strings)
- atsScore (0-100)
- sectionFeedback (object with keys: summary, experience, education, skills, each containing a string evaluation)
- topImprovements (array of strings - exactly 3)
`;

    if (jobDescription) {
      prompt += `\n- jobMatchScore (0-100) indicating how well the resume matches the provided job description.\n\nJob Description:\n${jobDescription}\n`;
    }

    prompt += `
IMPORTANT: Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON object.

Resume text:
${resumeText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let resultText = response.text;
    
    // Clean up potential markdown formatting from Gemini
    if (resultText.startsWith('\`\`\`json')) {
      resultText = resultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    } else if (resultText.startsWith('\`\`\`')) {
      resultText = resultText.replace(/\`\`\`/g, '').trim();
    }

    const parsedJson = JSON.parse(resultText);
    return parsedJson;

  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze resume with AI');
  }
};

const chatAboutResume = async (resumeText, message, history = []) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Construct the context and history
    let prompt = `
You are an expert career counselor and HR consultant. The user is asking you questions about their resume.
Here is the text of their resume for context:

--- RESUME TEXT ---
${resumeText}
-------------------

`;
    
    if (history && history.length > 0) {
      prompt += `Here is the recent chat history:\n`;
      history.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'You'}: ${msg.content}\n`;
      });
      prompt += `\n`;
    }

    prompt += `User's latest question: ${message}\n\nProvide a helpful, encouraging, and specific answer based primarily on their resume content.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw new Error('Failed to chat about resume with AI');
  }
};

module.exports = { analyzeResumeWithAI, chatAboutResume };
