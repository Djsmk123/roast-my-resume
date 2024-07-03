import roastRequestSchema from "../../models/roast_request_model";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

import PDFParser from 'pdf2json';
import firebase from "../../db/db";
export const revalidate = 0; //revalidate api every 1 second
export const dynamic = 'force-dynamic';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const configuration = new GoogleGenerativeAI(GEMINI_API_KEY);
const modelId = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({ model: modelId });
const pdfParser = new PDFParser(this, true);
enum tones {
    "soft-hearted",
    "hard-hearted",
    "light",
    "dark",
    "vulgar",

}
enum roles {
    "Memer",
    "Job Interviewer",
    "Standup Comedian",
    "HR",
    "Friend",
    "Family Member",
    "Ashneer Grover",
    "Teacher",
    "Enemy",
    "Girlfriend",
    "Boyfriend",
}
enum languages {
    "English",
    "Hindi",
    "Both Hindi and English",
}
const safetySettings = [{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE, }, { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE, }, { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE, }, { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE, },];
let words = [
    ""
];

async function loadWordsFromRemoteConfig() {
    const remoteConfig = await firebase.remoteConfig.getTemplate();
    var templateStr = JSON.stringify(remoteConfig);
    words = JSON.parse(templateStr).parameters.words.defaultValue.value;;


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
        const role = parseInt(roastRequest.role);
        const language = parseInt(roastRequest.language);



        await loadWordsFromRemoteConfig();
        //parse string to int 
        const roastTone = tones[roastLevel];
        const roleType = roles[role];
        const languageType = languages[language];
        var prompt = `You are a witty assistant asked to create roast based on tone  ` + roastTone + `. use indian context for roasting`;
        switch (roleType) {
            case "Memer": {
                prompt += " \n\nRoast the resume like a memer, use memes and roast the resume in a memer way.";
                break;
            }
            case "Job Interviewer": {
                prompt += " \n\nRoast the resume like a job interviewer, use job interview context and roast the resume in a job interviewer way.";
                break;
            }
            case "Standup Comedian": {
                const standUpComedians = [
                    "Zakir Khan",
                    "Kenny Sebastian",
                    "Biswa Kalyan Rath",
                    "Kanan Gill",
                    "Rahul Subramanian",
                    "Bassi",
                    "Abhishek Upmanyu",
                    //english standup comedians
                    "George Carlin",
                    "Dave Chappelle",
                    "Louis C.K.",
                    "Richard Pryor",
                ]
                //select random standup comedian
                const randomStandUpComedian = standUpComedians[Math.floor(Math.random() * standUpComedians.length)];

                prompt += " \n\nRoast the resume like a standup comedian " + randomStandUpComedian + ", use standup comedian context and roast the resume in a standup comedian way.";
            }
            case "HR": {
                prompt += " \n\nRoast the resume like a HR, use HR context and roast the resume in a HR way.";
                break;
            }
            case "Friend": {
                prompt += " \n\nRoast the resume like a friend, use friendly context and roast the resume in a friendly way.";
                break;
            }
            case "Family Member": {
                prompt += " \n\nRoast the resume like a family member, use family context and roast the resume in a family member way.";
                break;
            }
            case "Ashneer Grover": {
                prompt += " \n\nRoast the resume like a Ashneer Grover, use Ashneer Grover context and roast the resume in a Ashneer Grover way.";
                break;
            }
            case "Teacher": {
                prompt += " \n\nRoast the resume like a teacher, use teacher context and roast the resume in a teacher way.";
                break;
            }
            case "Enemy": {
                prompt += " \n\nRoast the resume like a enemy, use enemy context and roast the resume in a enemy way.";
                break;
            }
            case "Girlfriend": {
                prompt += " \n\nRoast the resume like a girlfriend, use girlfriend context and roast the resume in a girlfriend way.";
                break;
            }
            case "Boyfriend": {
                prompt += " \n\nRoast the resume like a boyfriend, use boyfriend context and roast the resume in a boyfriend way.";
                break;
            }
            default: {

                break;
            }

        }
        if (roastTone == "vulgar") {
            prompt += " \n\nPlease using the following words in the roast for impact: " + words + ". and add vulgarity to the roast hindi and english both.";
        }
        if (roastTone == "dark") {
            prompt += "Keep it for dark humor, and add some dark humor to the roast.";
        }
        prompt += " Provide only roast text content, not any helper texts and use the following language: " + languageType + ".";

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
        return await ResponseHandler(prompt, resumeText, roastTone);
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

async function ResponseHandler(prompt: string, resumeText: string, toneLevel: String): Promise<Response> {

    const content = [
        { role: "model", parts: [{ text: prompt }] },
        { role: "user", parts: [{ text: resumeText },] },];
    console.log(content);
    const result = await model.generateContent({
        contents: content,
        safetySettings: safetySettings,
    });

    // Save the roast to the database, do not store resume text for privacy reasons
    //do not store if it is on local machine
    const env = process.env.NODE_ENV
    console.log(env);
    if (env != "development") {
        await firebase.resumeRoastCollection.add({
            roastText: result.response.text(),
            roastLevel: toneLevel,
            createdAt: new Date(),
        });
    }







    return new Response(JSON.stringify({
        message: result.response.text(),
    }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}
