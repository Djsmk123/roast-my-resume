import { Alert, Snackbar } from "@mui/material";
enum SnackBarSeverity {
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    SUCCESS = "success"

}
interface SnackBarProps {
    openSnackbar: boolean;
    snackbarMessage: string;
    handleCloseSnackbar: () => void;
    severity?: SnackBarSeverity;


}

function SnackBarComponent({
    openSnackbar,
    snackbarMessage,
    handleCloseSnackbar,
    severity = SnackBarSeverity.WARNING
}: SnackBarProps) {
    return (
        <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
        >
            <Alert onClose={handleCloseSnackbar} severity={severity}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
    );
}
export default { SnackBarComponent, SnackBarSeverity };