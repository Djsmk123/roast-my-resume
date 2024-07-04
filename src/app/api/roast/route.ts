import roastRequestSchema from "../../models/roast_request_model";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import PDFParser from 'pdf2json';
import firebase from "../../db/db";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const configuration = new GoogleGenerativeAI(GEMINI_API_KEY);
const modelId = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({ model: modelId });
const pdfParser = new PDFParser(this, true);

enum Tones {
    SoftHearted = "soft-hearted",
    HardHearted = "hard-hearted",
    Light = "light",
    Dark = "dark",
    Vulgar = "vulgar",
}

enum Roles {
    Memer = "Memer",
    JobInterviewer = "Job Interviewer",
    StandupComedian = "Standup Comedian",
    HR = "HR",
    Friend = "Friend",
    FamilyMember = "Family Member",
    AshneerGrover = "Ashneer Grover",
    Teacher = "Teacher",
    Enemy = "Enemy",
    Girlfriend = "Girlfriend",
    Boyfriend = "Boyfriend",
}

enum Languages {
    English = "English",
    Hindi = "Hindi",
    BothHindiAndEnglish = "Both Hindi and English",
}

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

let words: string[] = [];

async function loadWordsFromRemoteConfig() {
    const remoteConfig = await firebase.remoteConfig.getTemplate();
    const templateStr = JSON.stringify(remoteConfig);
    words = JSON.parse(templateStr).parameters.words.defaultValue.value;
}

export async function POST(request: Request) {
    try {
        const body = await request.formData();
        const entries = Array.from(body.entries());
        const fromEntries = entries.reduce((accu: any, [key, value]) => {
            if (key in accu) {
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

        if (roastRequest instanceof Error) {
            return new Response(JSON.stringify({ message: roastRequest.message }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const roastLevel = parseInt(roastRequest.roastLevel); //index of roast level
        const role = parseInt(roastRequest.role);
        const language = parseInt(roastRequest.language);

        await loadWordsFromRemoteConfig();

        const roastTone = Object.values(Tones)[roastLevel];
        const roleType = Object.values(Roles)[role];
        const languageType = Object.values(Languages)[language];

        let prompt = `You are a witty assistant asked to create roast based on tone ${roastTone}. Use Indian context for roasting.`;

        switch (roleType) {
            case Roles.Memer:
                prompt += "\n\nRoast the resume like a memer, use meme context and roast the resume in a memer way.";
                break;
            case Roles.JobInterviewer:
                prompt += "\n\nRoast the resume like a job interviewer, use job interview context and roast the resume in a job interviewer way.";
                break;
            case Roles.StandupComedian:
                const standUpComedians = [
                    "Zakir Khan",
                    "Kenny Sebastian",
                    "Biswa Kalyan Rath",
                    "Kanan Gill",
                    "Rahul Subramanian",
                    "Bassi",
                    "Abhishek Upmanyu",
                    "George Carlin",
                    "Dave Chappelle",
                    "Louis C.K.",
                    "Richard Pryor",
                ];
                const randomStandUpComedian = standUpComedians[Math.floor(Math.random() * standUpComedians.length)];
                prompt += `\n\nRoast the resume like a standup comedian ${randomStandUpComedian}, use standup comedian context and roast the resume in a standup comedian way.`;
                break;
            case Roles.HR:
                prompt += "\n\nRoast the resume like a HR, use HR context and roast the resume in a HR way.";
                break;
            case Roles.Friend:
                const friends = [
                    "Best Friend",
                    "Close Friend",
                    "Childhood Friend",
                    "College Friend",
                    "School Friend",
                ];
                const randomFriend = friends[Math.floor(Math.random() * friends.length)];
                prompt += `\n\nRoast the resume like a friend ${randomFriend}, use friend context and roast the resume in a friend way.`;
                break;
            case Roles.FamilyMember:
                const familyMembers = [
                    "Father",
                    "Mother",
                    "Sister",
                    "Brother",
                    "Uncle",
                    "Aunt",
                    "Grandfather",
                    "Grandmother",
                ];
                const randomFamilyMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
                prompt += `\n\nRoast the resume like a family member ${randomFamilyMember}, use family member context and roast the resume in a family member way.`;
                break;
            case Roles.AshneerGrover:
                prompt += "\n\nRoast the resume like Ashneer Grover, use Ashneer Grover context and roast the resume in an Ashneer Grover way.";
                break;
            case Roles.Teacher:
                prompt += "\n\nRoast the resume like a teacher, use teacher context and roast the resume in a teacher way.";
                break;
            case Roles.Enemy:
                prompt += "\n\nRoast the resume like an enemy, use enemy context and roast the resume in an enemy way.";
                break;
            case Roles.Girlfriend:
                const girlfriend = [
                    "Girlfriend",
                    "Ex-Girlfriend",
                    "Crush",
                ];
                const randomGirlfriend = girlfriend[Math.floor(Math.random() * girlfriend.length)];
                prompt += `\n\nRoast the resume like a ${randomGirlfriend}, use girlfriend context and roast the resume in a girlfriend way.`;
                break;
            case Roles.Boyfriend:
                const boyfriend = [
                    "Boyfriend",
                    "Ex-Boyfriend",
                    "Crush",
                ];
                const randomBoyfriend = boyfriend[Math.floor(Math.random() * boyfriend.length)];
                prompt += `\n\nRoast the resume like a ${randomBoyfriend}, use boyfriend context and roast the resume in a boyfriend way.`;
                break;
            default:
                break;
        }

        if (roastTone === Tones.Vulgar) {
            prompt += `\n\nPlease use the following words in the roast for impact: ${words.join(", ")}. Add vulgarity to the roast in both Hindi and English.`;
        }

        if (roastTone === Tones.Dark) {
            prompt += "\n\nKeep it for dark humor, and add some dark humor to the roast.";
        }

        prompt += ` Provide only roast text content, not any helper texts and use the following language: ${languageType}.`;

        console.log(prompt);

        let resumeText = roastRequest.textBasedResume?.toString() ?? '';

        if (resumeText === '') {
            const file = roastRequest.file;

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

        return await responseHandler(prompt, resumeText, roastTone);
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
        pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfParser.getRawTextContent()));
        pdfParser.parseBuffer(buffer);
    });
}

async function responseHandler(prompt: string, resumeText: string, toneLevel: string): Promise<Response> {
    const content = [
        { role: "model", parts: [{ text: prompt }] },
        { role: "user", parts: [{ text: resumeText }] },
    ];

    console.log(content);

    const result = await model.generateContent({
        contents: content,
        safetySettings: safetySettings,
    });

    const env = process.env.NODE_ENV;
    console.log(env);

    if (env !== "development") {
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
