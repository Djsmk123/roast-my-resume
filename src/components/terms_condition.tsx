import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, Typography } from '@mui/material';


interface TermsConditionProps {
    openTerms: boolean;
    handleCloseTerms: () => void;
    theme: string;
    consent: boolean;
    setConsent: (value: boolean) => void;
    handleAgree: () => void;
}

function TermsCondition(
    { openTerms, handleCloseTerms, theme, consent, setConsent, handleAgree }: TermsConditionProps

) {
    return (
        <Dialog
            open={openTerms}
            onClose={() => { if (!consent) return; handleCloseTerms(); }}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}>
                Terms and Conditions
            </DialogTitle>
            <DialogContent className={theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}>
                <Typography variant="body1" gutterBottom>
                    Please read the following terms and conditions carefully:
                    <ul>
                        <li>We do not store text from resumes to protect sensitive information (e.g., email, phone).</li>
                        <li>Generated content (roast text or images) may be stored for sharing and model improvement.</li>
                        <li>This project is for entertainment purposes only. Generated roasts are not meant to be taken seriously.</li>
                        <li>Content may be harsh, vulgar, or dark—use at your own risk.</li>
                        <li>We do not encourage any kind of hate content; it is only for fun.</li>
                    </ul>
                </Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            className='text-blue-500'
                        />
                    }
                    label="I agree to the Terms and Conditions"
                />
            </DialogContent>
            <Button onClick={handleAgree} color="primary" disabled={!consent}>
                Agree
            </Button>
        </Dialog>
    );
}

export default TermsCondition;