import {useAuth} from '../../../context/auth'
import {useEffect, useState} from 'react'
import CustomTable from '../../CustomTable'
import useStyles from '../../styles/generalStyles'
import jobService from '../../../services/jobService'

const ViewApplications = (props) => {
    const classes = useStyles()
    const {authTokens} = useAuth()
    const [applications, setApplications] = useState([])
    const [filterFn, setFilterFn] = useState({fn: (items) => items})
    const { jobId } = props.match.params
    const headers = [
        {id: 'appName', name: 'Name', sortable: true},
        {id: 'skills', name: 'Skills', sortable: false},
        {id: 'dateOfApplication', name: 'Application date', sortable: true},
        {id: 'education', name: 'Education', sortable: false},
        {id: 'sop', name: 'SOP', sortable: false},
        {id: 'state', name: 'State', sortable: false},
        {id: 'applicantRating', name: 'Rating', sortable: true},
        {id: 'proceed', name: 'Choose', sortable: false}
    ]
    const {
        SortableTable,
        recordsAfterSorting
    } = CustomTable(applications, headers, filterFn)

    useEffect(() => {
        (async () => {
            try {
                const response = await jobService.getApplications(jobId)
                console.log('immediate', response)
                for (let ind in response) {
                    response[ind].appName = response[ind].applicant.user.name
                    response[ind].applicantRating = response[ind].applicant.rating
                    console.log('name', response[ind].applicant.user.name)
                }
                console.log('response modified to ', response)
                setApplications(response)
            } catch (err) {
                console.log('error', err)
            }
        })()
    }, [jobId])

    return (
        <div>

        </div>
    )
}

export default ViewApplications
