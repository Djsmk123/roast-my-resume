import RoastResponse from '@/model/roast_model';
import { Box } from '@mui/material';
// import { TwitterShareButton, LinkedinShareButton, RedditShareButton, WhatsappShareButton } from 'react-share';
import { TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
import { FaCopy } from "react-icons/fa";

import { shareUrl } from '@/utils/share';

interface ShareMenuProps {
    roastResponse: RoastResponse,
    imageUrl: string | null;

}

interface ShareOption {
    icon: JSX.Element;
    title: string;
    onClick: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ roastResponse, imageUrl }) => {


    const shareOptions: ShareOption[] = [
        {
            icon: <TwitterIcon size={24} round style={{ margin: 'auto', display: 'block' }} />,
            title: 'Twitter',
            onClick: () => {
                share('twitter', roastResponse, imageUrl);
            }
        },
        {
            icon: <LinkedinIcon size={24} round style={{ margin: 'auto', display: 'block' }} />,
            title: "LinkedIn",
            onClick: () => {
                share('linkedin', roastResponse, imageUrl);
            }
        },

        {
            icon: <WhatsappIcon size={24} round style={{ margin: 'auto', display: 'block' }} />,
            title: 'WhatsApp',
            onClick: () => {
                share('whatsapp', roastResponse, imageUrl);
            }
        },
        {
            icon: <FaCopy size={24} style={{
                margin: 'auto', display: 'block',
                color: "blue-500"


            }} />,
            title: 'Copy Link',

            onClick: () => {
                navigator.clipboard.writeText(shareUrl(roastResponse));
                alert('Link copied to clipboard');
            }
        }
    ];

    return (
        <div>
            <Box display="flex" justifyContent="center" alignItems="center">
                {shareOptions.map((option, index) => (
                    <div key={index} onClick={option.onClick} style={{ cursor: 'pointer', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', margin: '5px', textAlign: 'center' }}>
                        {option.icon}
                    </div>
                ))}
            </Box>
        </div>
    );
};
function share(
    platform: string,
    roastResponse: RoastResponse,
    imageUrl: string | null,
) {
    const shareLink = shareUrl(roastResponse);
    const twitterUsername = "SmkWinner";
    const linkedinUsername = "md-mobin-bb928820b";
    switch (platform) {
        case 'twitter':
            var text = `I just got roasted by the Roast Bot!,\n\nCheck out my roast here: \n\nhttps://roast-bot.vercel.app/roast/${roastResponse.id} by @${twitterUsername} #RoastMyResume24`;
            window.open(`https://twitter.com/intent/tweet?text=${text}. {shareLink}`);
            return;
        case 'linkedin':
            var text = `I just got roasted by the Roast Bot!,\n\nCheck out my roast here: \n\nhttps://roast-bot.vercel.app/roast/${roastResponse.id} by @${twitterUsername} #RoastMyResume24`;
            window.open(`https://www.linkedin.com/shareArticle?url=${shareLink}&title=${roastResponse.roast}&summary=${roastResponse.roast} by ${linkedinUsername}`);
            break;
        case 'whatsapp':
            var text = `I just got roasted by the Roast Bot!,\n\nCheck out my roast here: \n\nhttps://roast-bot.vercel.app/roast/${roastResponse.id} by @${twitterUsername} #RoastMyResume24`;
            if (imageUrl) {
                text = `${text}\n\nHere is the image roast: ${imageUrl}`;
            }

            window.open(`https://api.whatsapp.com/send?text=${roastResponse.roast} by ${twitterUsername} ${shareLink}`);
            break;
    }


}

export default ShareMenu;
