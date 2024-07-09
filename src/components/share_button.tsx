import RoastResponse from '@/model/roast_model';
import { Box } from '@mui/material';
// import { TwitterShareButton, LinkedinShareButton, RedditShareButton, WhatsappShareButton } from 'react-share';
import { TwitterIcon, LinkedinIcon, RedditIcon, WhatsappIcon } from 'react-share';
import { shareUrl } from '@/utils/share';

interface ShareMenuProps {
    roastResponse: RoastResponse

}

interface ShareOption {
    icon: JSX.Element;
    title: string;
    onClick: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ roastResponse }) => {

    const shareOptions: ShareOption[] = [
        {
            icon: <TwitterIcon size={24} round style={{ margin: 'auto', display: 'block' }} />,
            title: 'Share on Twitter',
            onClick: () => {
                // Add your Twitter share logic here
                const shareLink = shareUrl(roastResponse);
                alert(shareLink);
            }
        },
        {
            icon: <LinkedinIcon size={24} round style={{ margin: 'auto', display: 'block' }} />,
            title: 'Share on LinkedIn',
            onClick: () => {
                // Add your LinkedIn share logic here
            }
        },
        {
            icon: <RedditIcon size={24} round style={{ margin: 'auto', display: 'block' }} />,
            title: 'Share on Reddit',
            onClick: () => {
                // Add your Reddit share logic here
            }
        },
        {
            icon: <WhatsappIcon size={24} round style={{ margin: 'auto', display: 'block' }} />,
            title: 'Share on WhatsApp',
            onClick: () => {
                // Add your WhatsApp share logic here
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

export default ShareMenu;
