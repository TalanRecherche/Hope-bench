import {useContext, useEffect, useState} from "react";
import {ApiContext, TemplatesByType} from "../contexts/ApiContext.tsx";

const useTemplatesByType = (active?: boolean): TemplatesByType => {
    const [templatesByType, setTemplatesByType] = useState<TemplatesByType>({})
    const {listTemplatesByType} = useContext(ApiContext)

    useEffect(() => {
        listTemplatesByType(active).then(setTemplatesByType)
    }, [])

    return templatesByType
}

export default useTemplatesByType
