import React from 'react'
import {Divider, Button, TextField} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {FieldArray, Form, Formik, getIn} from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    education: Yup.array().of(
        Yup.object().shape({
            name: Yup
                .string()
                .required('Institute name is required'),
            startYear: Yup
                .number('Must be a number')
                .required('Start year is required')
                .min(1800, 'Invalid year')
                .max(2040, 'Range not supported'),
            endYear: Yup
                .number()
                .min(Yup.ref("startYear"), 'End year must be after start')
                .max(2040, 'Range not supported')
        })
    )
})

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    button: {
        margin: theme.spacing(1)
    },
    field: {
        margin: theme.spacing(1)
    }
}))

const EducationForm = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <Formik
                initialValues={{
                    education: [
                        {
                            key: Math.random(),
                            name: '',
                            startYear: '',
                            endYear: ''
                        }
                    ]
                }}
                validationSchema={validationSchema}
                onSubmit={values => {
                    console.log('onSubmit', JSON.stringify(values, null, 2))
                }}
            >
                {({values, touched, errors, handleChange, handleBlur, isValid}) => (
                    <Form noValidate autoComplete="off">
                        <FieldArray name="education">
                            {({push, remove}) => (
                                <div>
                                    {values.education.map((p, index) => {
                                        const name = `education[${index}].name`
                                        const touchedName = getIn(touched, name)
                                        const errorName = getIn(errors, name)

                                        const startYear = `education[${index}].startYear`
                                        const touchedStartYear = getIn(touched, startYear)
                                        const errorStartYear = getIn(errors, startYear)

                                        const endYear = `education[${index}].endYear`
                                        const touchedEndYear = getIn(touched, endYear)
                                        const errorEndYear = getIn(errors, endYear)

                                        return (
                                            <div key={p.key}>
                                                <TextField
                                                    className={classes.field}
                                                    margin="normal"
                                                    variant="outlined"
                                                    label="Institute name"
                                                    name={name}
                                                    value={p.firstName}
                                                    required
                                                    helperText={
                                                        touchedName && errorName
                                                            ? errorName
                                                            : ''
                                                    }
                                                    error={Boolean(touchedName && errorName)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <TextField
                                                    className={classes.field}
                                                    margin="normal"
                                                    variant="outlined"
                                                    label="Start year"
                                                    name={startYear}
                                                    value={p.startYear}
                                                    required
                                                    helperText={
                                                        touchedStartYear && errorStartYear
                                                            ? errorStartYear
                                                            : ''
                                                    }
                                                    error={Boolean(touchedStartYear && errorStartYear)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <TextField
                                                    className={classes.field}
                                                    margin="normal"
                                                    variant="outlined"
                                                    label="End year"
                                                    name={endYear}
                                                    value={p.endYear}
                                                    required
                                                    helperText={
                                                        touchedEndYear && errorEndYear
                                                            ? errorStartYear
                                                            : ''
                                                    }
                                                    error={Boolean(touchedEndYear && errorEndYear)}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                                <Button
                                                    className={classes.button}
                                                    margin="normal"
                                                    type="button"
                                                    color="secondary"
                                                    variant="outlined"
                                                    onClick={() => remove(index)}
                                                >
                                                    x
                                                </Button>
                                            </div>
                                        )
                                    })}
                                    <Button
                                        className={classes.button}
                                        type="button"
                                        variant="outlined"
                                        onClick={() =>
                                            push({key: Math.random(), name: '', startYear: '', endYear: ''})
                                        }
                                    >
                                        Add
                                    </Button>
                                </div>
                            )}
                        </FieldArray>
                        <Divider style={{marginTop: 20, marginBottom: 20}}/>
                        <Button
                            className={classes.button}
                            type="submit"
                            color="primary"
                            variant="contained"
                            // disabled={!isValid || values.people.length === 0}
                        >
                            submit
                        </Button>
                        <Divider style={{marginTop: 20, marginBottom: 20}}/>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EducationForm
