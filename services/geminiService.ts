import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, GenerationSettings } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema strictly using the Type enum as per guidelines
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The main topic of the content" },
    generated_at: { type: Type.STRING, description: "ISO timestamp of generation" },
    source: { type: Type.STRING, description: "General source or context of the knowledge" },
    confidence: { type: Type.STRING, enum: ["high", "medium", "low"], description: "Confidence level of the generated content" },
    mcqs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Exactly 4 options"
          },
          answer_index: { type: Type.INTEGER, description: "0-based index of the correct answer" },
          difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          timer_seconds: { type: Type.INTEGER },
          hint: { type: Type.STRING },
          explanation: { type: Type.STRING },
          source: { type: Type.STRING },
          confidence: { type: Type.STRING }
        },
        required: ["id", "question", "options", "answer_index", "difficulty", "tags", "timer_seconds", "hint", "explanation"]
      }
    },
    punchcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          front: { type: Type.STRING, description: "Concept or term" },
          back: { type: Type.STRING, description: "Definition or key fact" },
          mnemonic: { type: Type.STRING, description: "Memory aid if applicable" }
        },
        required: ["id", "front", "back"]
      }
    },
    study_plan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 actionable study steps"
    }
  },
  required: ["topic", "generated_at", "mcqs", "punchcards", "study_plan"]
};

export const generateStudyContent = async (topic: string, settings: GenerationSettings): Promise<GeneratedContent> => {
  try {
    let timerInstruction = "Set timer to 60 seconds per question.";
    if (settings.timerMode === 'fast') timerInstruction = "Set timer to 30 seconds. Questions should be quick to answer.";
    if (settings.timerMode === 'relaxed') timerInstruction = "Set timer to 120 seconds. Questions can be more thoughtful.";

    let difficultyInstruction = "Ensure a mix of difficulty levels (easy, medium, hard).";
    if (settings.difficulty !== 'mixed') {
      difficultyInstruction = `Make all questions ${settings.difficulty} difficulty.`;
    }

    const prompt = `
      Create a study set for the topic: "${topic}".
      Generate ${settings.questionCount} multiple choice questions (MCQs) and 8 punchcard flashcards.
      
      Requirements:
      1. MCQs must have 4 options.
      2. ${difficultyInstruction}
      3. ${timerInstruction}
      4. Questions should be conceptual and applied, not just memorization.
      5. Provide a helpful hint and a detailed explanation for each MCQ.
      6. Flashcards should be punchy and concise.
      7. Output strict JSON.
    `;

    // Using gemini-2.5-flash-lite for lowest latency as requested
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as GeneratedContent;
    
    // Fallback/Ensure IDs if model misses them (rare with strict schema but good for safety)
    data.mcqs = data.mcqs.map((q, idx) => ({ ...q, id: q.id || `mcq-${idx}` }));
    data.punchcards = data.punchcards.map((p, idx) => ({ ...p, id: p.id || `flash-${idx}` }));

    return data;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
};