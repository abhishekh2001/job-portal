import {useState} from 'react'
import ApplicantForm from '../../forms/ApplicantForm'
import RecruiterForm from '../../forms/RecruiterForm'
import useStyles from '../../styles/generalStyles'
import {FormControl, InputLabel, makeStyles, MenuItem, Select} from '@material-ui/core'

const formStyle = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}))

const MasterAuth = () => {
    const [type, setType] = useState('')
    const classes = useStyles()
    const formClasses = formStyle()

    const handleChange = (event) => {
        setType(event.target.value)
    }

    let form = null
    if (type === 'recruiter')
        form = <RecruiterForm />
    else if (type === 'applicant')
        form = <ApplicantForm />

    return (
        <div>
            <div className={classes.appBarSpacer} />
            <FormControl className={formClasses.formControl}>
                <InputLabel id="type">Type</InputLabel>
                <Select
                    labelId="type"
                    id="selectType"
                    value={type}
                    onChange={handleChange}
                >
                    <MenuItem value={'recruiter'}>Recruiter</MenuItem>
                    <MenuItem value={'applicant'}>Applicant</MenuItem>
                </Select>
            </FormControl>

            {form}
        </div>
    )
}

export default MasterAuth
