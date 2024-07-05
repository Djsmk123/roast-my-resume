import { RoastLevel, RoastStatus, RoleType, Languages } from "../utils/constants";

async function submitRoastRequest(
    roastLevel: string,
    roleType: string,
    roastStatus: RoastStatus,
    setRoastStatus: (status: RoastStatus) => void,
    setRoastText: (text: string) => void,
    setRoastCount: (count: any) => number,
    resumeText: string,
    selectedFile: File | null,
    language: string,

) {
    // Prevent multiple requests
    if (roastStatus === RoastStatus.loading) {
        return;
    }
    if (roastStatus === RoastStatus.success) {
        setRoastStatus(RoastStatus.initial);
        return;
    }
    if (roastLevel === "") {
        alert("Please select a roast level");
        return;
    }
    if (roleType === "") {
        alert("Please select a role type");
        return;
    }
    if (language === "") {
        alert("Please select a language");
        return;
    }

    if (!resumeText && !selectedFile) {
        alert("Please provide a file or resume text");
        return;
    }
    const BASEURL = process.env.Backend_URL;

    const formData = new FormData();
    const roastIndex = Object.keys(RoastLevel).indexOf(roastLevel);
    formData.append("roastLevel", roastIndex.toString());
    const roleIndex = Object.keys(RoleType).indexOf(roleType);
    formData.append("role", roleIndex.toString());
    const languageIndex = Object.keys(Languages).indexOf(language);
    formData.append("language", languageIndex.toString());
    if (selectedFile) {
        formData.append("file", selectedFile);
    }
    if (resumeText) {
        formData.append("textBasedResume", resumeText);
    }
    setRoastStatus(RoastStatus.loading);

    await fetch(
        `${BASEURL}/roast`,
        {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
            cache: 'no-store',
        })
        .then(async (response) => {
            var data = await response.json();
            if (response.ok) {
                return data;
            }

            throw new Error(data.message);
        })
        .then((data) => {
            console.log(data);
            setRoastStatus(RoastStatus.success);
            setRoastText(data.message);
            alert("Roast generated successfully!");

            // Update roast count
            setRoastCount((prevCount: number) => {
                const newCount = prevCount + 1;
                localStorage.setItem("roastCount", newCount.toString());
                localStorage.setItem("roastCountTimestamp", Date.now().toString());
                return newCount;
            });
        })
        .catch((error) => {
            setRoastStatus(RoastStatus.error);
            alert("An error occurred. Please try again later.");
        });


}
function getRoastCount(
    setRoastCount: (count: any) => void

) {
    const cachedRoastCount = localStorage.getItem("roastCount");
    const cachedTimestamp = localStorage.getItem("roastCountTimestamp");

    if (cachedRoastCount && cachedTimestamp) {
        const now = Date.now();
        const timestamp = parseInt(cachedTimestamp, 10);

        // Check if cached data is older than 1 hour
        if (now - timestamp < 3600000) {
            setRoastCount(parseInt(cachedRoastCount, 10));
            return;
        }
    }
    const BASEURL = process.env.Backend_URL;

    fetch(`${BASEURL}/roastCount`,)
        .then((response) => {
            if (!response.ok) {
                throw new Error("An error occurred while fetching roast count");
            }
            return response.json();
        })
        .then((data) => {
            setRoastCount(data.roastCount);
            localStorage.setItem("roastCount", data['message'].toString());
            localStorage.setItem("roastCountTimestamp", Date.now().toString());
        });
}
export { submitRoastRequest, getRoastCount };