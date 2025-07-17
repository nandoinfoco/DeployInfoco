
import { GoogleGenAI } from "@google/genai";
import { Employee, Task, FinanceData } from '../types';

// The instructions state to assume process.env.API_KEY is available.
// In a real-world scenario, this key would be exposed on the client, which is a security risk.
// This implementation proceeds under the assumption of a secure, pre-configured environment as per the prompt.
const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY!,
});

interface AiContextData {
    employees: Employee[];
    tasks: Task[];
    financeData: FinanceData[];
}

/**
 * Generates an AI-powered analysis by calling the Gemini API.
 * @param userInput The user's question.
 * @param contextData The application data (employees, tasks, etc.).
 * @returns The text response from the AI model.
 * @throws Will throw an error if the API call fails.
 */
export const getAiDataAnalysis = async (userInput: string, contextData: AiContextData): Promise<string> => {
    try {
        const systemInstruction = `Você é um assistente de análise de dados para um sistema de gestão chamado Infoco.
Sua tarefa é analisar os dados em formato JSON fornecidos no prompt e responder à pergunta do usuário de forma clara, concisa e útil.
Atenha-se estritamente aos dados fornecidos. Os dados contêm três arrays principais: 'employees', 'tasks', e 'financeData'.
- 'employees': Contém informações sobre os funcionários da empresa.
- 'tasks': Contém uma lista de tarefas atribuídas aos funcionários, incluindo status e horas.
- 'financeData': Contém dados financeiros relacionados aos municípios.
Sempre formate sua resposta usando markdown para melhor legibilidade (use **negrito** para destacar termos importantes, *itálico*, e listas de itens com hífens ou asteriscos).
Se a pergunta não puder ser respondida com os dados fornecidos, informe educadamente que a informação não está disponível. Não invente informações.
Seja direto e objetivo na resposta.`;
        
        const userQueryPart = {
            text: `**PERGUNTA DO USUÁRIO:**\n${userInput}`
        };

        const dataContextPart = {
            text: `\n\n---\n\n**DADOS PARA ANÁLISE (JSON):**\n${JSON.stringify(contextData, null, 2)}`
        };
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [userQueryPart, dataContextPart] },
            config: {
                systemInstruction: systemInstruction,
            }
        });
        
        const aiText = response.text;
        
        if (!aiText) {
             throw new Error('A resposta do serviço de IA estava vazia ou em formato inválido.');
        }

        return aiText.trim();

    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        throw new Error('Falha ao se comunicar com o serviço de IA. Verifique o console para detalhes.');
    }
};
