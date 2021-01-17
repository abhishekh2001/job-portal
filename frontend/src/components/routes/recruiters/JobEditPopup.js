import {Dialog, DialogContent, DialogTitle, Divider} from '@material-ui/core'


const JobEditPopup = (props) => {
    const {title, children, openPopup, setOpenPopup} = props

    return (
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default JobEditPopup
