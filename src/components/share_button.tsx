import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { FaShare } from "react-icons/fa";
import { LinkedinShareButton, RedditShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { TwitterIcon, LinkedinIcon, RedditIcon, WhatsappIcon, } from "react-share";
interface ShareMenuProps {
    image: string | null;
}


const ShareMenu = ({ image }: ShareMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const urlToShare = 'https://roast-my-resume-henna.vercel.app/';
    const shareTitle = "I got my resume roasted by Roast My Resume! Check out this amazing tool, built by ";


    return (
        <div className="mb-4 text-center">
            <button
                onClick={handleShareClick}
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center"
                style={{
                    width: "20%",
                    margin: "0 auto",
                }}
            >
                <FaShare style={{ marginRight: "0.5rem" }} />
                Share

            </button>
            <Menu
                id="share-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >

                <MenuItem>
                    <TwitterIcon size={24} round
                        style={{ marginRight: "0.5rem" }}

                    />
                    <TwitterShareButton url={urlToShare} title={shareTitle + " @smkwinner . "}
                        related={[
                            "smkwinner"
                        ]}
                    >
                        Share on Twitter
                    </TwitterShareButton>
                </MenuItem>
                <MenuItem>
                    <LinkedinIcon size={24} round
                        style={{ marginRight: "0.5rem" }}
                    />
                    <LinkedinShareButton url={urlToShare} title={shareTitle + " @smkwinner."}
                    >
                        Share on LinkedIn
                    </LinkedinShareButton>
                </MenuItem>
                <MenuItem>
                    <RedditIcon size={24} round
                        style={{ marginRight: "0.5rem" }}
                    />
                    <RedditShareButton url={urlToShare} title={shareTitle}>

                        Share on Reddit
                    </RedditShareButton>
                </MenuItem>
                <MenuItem>
                    <WhatsappIcon size={24} round


                        style={{ marginRight: "0.5rem" }}
                    />
                    <WhatsappShareButton url={urlToShare}


                        title={shareTitle}>

                        Share on WhatsApp
                    </WhatsappShareButton>
                </MenuItem>
            </Menu>
        </div >
    );
};

export default ShareMenu;
