import { useFormikContext } from 'formik'
import { useEffect } from 'react'

const FormErrorNotification = () => {
    const { isValid, isValidating, isSubmitting } = useFormikContext()

    useEffect(() => {
        if (!isValid && !isValidating && isSubmitting) {
            console.log(isValid.toString())
            alert('Fix your form errors!')
        }
    }, [isSubmitting, isValid, isValidating])

    return null
}

export default FormErrorNotification