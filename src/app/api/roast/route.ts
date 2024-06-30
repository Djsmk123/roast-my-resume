import roastRequestSchema from "../../models/roast_request_model";
import { GoogleGenerativeAI } from '@google/generative-ai';

import PDFParser from 'pdf2json';


const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const configuration = new GoogleGenerativeAI(GEMINI_API_KEY);
const modelId = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({ model: modelId });
const pdfParser = new PDFParser(this, true);
enum tones {
    "soft-hearted",
    "hard-hearted",
    "light",
    "soft-dark",
    "dark",

}


export async function POST(request: Request) {
    try {
        const body = await request.formData();
        const entries = Array.from(body.entries()); // convert IterableIterator to array
        const fromEntries = entries.reduce((accu: any, [key, value]) => {
            if (key in accu) {
                // account for multiples
                accu[key] = [key].concat(accu[key]);
            } else {
                accu[key] = value;
            }
            return accu;
        }, {});

        const { success, error, data } = roastRequestSchema.safeParse(fromEntries);
        if (!success) {
            return new Response(JSON.stringify({ message: error.message }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        const roastRequest = data;

        // Check request body for errors
        if (roastRequest instanceof Error) {
            return new Response(JSON.stringify({ message: roastRequest.message }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const roastLevel = parseInt(roastRequest.roastLevel);


        //parse string to int 
        const roastTone = tones[roastLevel];
        var prompt = `You are a witty assistant asked to create roast based on tone ` + roastTone + `.`;

        prompt += " Provide only roast text content, not any helper texts.";
        console.log(prompt);






        let resumeText = roastRequest.textBasedResume?.toString() ?? '';
        if (resumeText === '') {
            const file = roastRequest.file;
            // Check if file is provided or not
            if (!file) {
                return new Response(JSON.stringify({ message: "Please provide a file or resume text" }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            resumeText = await parsePDF(buffer);

        }
        return await ResponseHandler(prompt, resumeText);
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: e }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

async function parsePDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {

        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {

            return resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
    });
}

async function ResponseHandler(prompt: string, resumeText: string): Promise<Response> {

    const content = [
        { role: "model", parts: [{ text: prompt }] },
        { role: "user", parts: [{ text: resumeText },] },];
    console.log(content);
    const result = await model.generateContent({
        contents: content,
    });




    return new Response(JSON.stringify({

        message: result.response.text(),
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
