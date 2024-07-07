interface RoastResponse {
    roast: string;
    meme: {
        output: string;
        outputFull: {
            type: string;
            value: string;
            width: number;
            height: number;
            html: string;
        };
    } | null;
};
export default RoastResponse;
