import {ReactNode, useContext, useEffect, useState} from "react";
import {ApiContext} from "../contexts/ApiContext.tsx";
import {CVData, PageResult, SearchOptions} from "../model/models.ts";
import {useBoolean} from "usehooks-ts";
import {PaginationControl} from "react-bootstrap-pagination-control";

interface Result {
    loading: boolean
    cvPage: PageResult<CVData>
    changePage: (page?: number) => void
    paginator: ReactNode
}

const usePaginatedCvs = (selfSearch: boolean, userId?: string, search?: string, limitCvToAllowedOnes?: boolean, selectedStatusToShow? : {[key: string]: boolean} , showMainCvOnly?:boolean): Result => {
    const {value: loading, setTrue: setLoading, setFalse: setLoaded} = useBoolean(true)
    const [cvPage, _setCvPage] = useState<PageResult<CVData>>({
        page: 0, pageSize: 0, totalElements: 0, elements: []
    })
    const {listCvs} = useContext(ApiContext)
        
    const setCvPage = (p: PageResult<CVData>) => {
        _setCvPage(p)
    }

    const convertSelectedStatusToInt = () => {
        var status : number[] = []
        if(selectedStatusToShow === undefined){
            return [0, 1, 2, 3]
        }
        else{

            if(selectedStatusToShow.brouillons){
                status.push(0)
            }
            if(selectedStatusToShow["waitingCorrect"]){
                status.push(1)
            }
            if(selectedStatusToShow["waitingReview"]){
                status.push(2)
            }
            if(selectedStatusToShow["valid"]){
                status.push(3)
            }
        }
        return status
    }

    const searchPage = (options: SearchOptions) => {
        setLoading()
        // listCvs({} as SearchOptions).then(setCvPage).then(setLoaded);
        listCvs(options).then(setCvPage).then(setLoaded);
    }

    const initialSearchParams: SearchOptions = {limitToAllowedCv: limitCvToAllowedOnes == undefined ? true : limitCvToAllowedOnes, 
        searchString: search == undefined ? "" : search, userId: userId == undefined ? "" : userId, selfSearch: selfSearch, onlyMainCv: showMainCvOnly}

    const [searchParams, setSearchParams] = useState<SearchOptions>(initialSearchParams)

    const changePage = (page?: number) => {
        setSearchParams({...searchParams, page: page})
        searchPage({...searchParams, page: page})
    }

    useEffect(() => {
        var status = convertSelectedStatusToInt()
        setSearchParams({...searchParams, searchString: search, limitToAllowedCv: limitCvToAllowedOnes, statusToCheck: status, onlyMainCv: showMainCvOnly})
        searchPage({...searchParams, searchString: search, limitToAllowedCv: limitCvToAllowedOnes, statusToCheck: status, onlyMainCv: showMainCvOnly});
    }, [search, limitCvToAllowedOnes, selectedStatusToShow, showMainCvOnly])

    


    return {
        cvPage,
        loading,
        changePage,
        paginator: cvPage.totalElements > cvPage.pageSize ? (<PaginationControl
            page={cvPage.page + 1}
            total={cvPage.totalElements}
            limit={cvPage.pageSize}
            changePage={changePage}
            next={true}
            last={true}
        />) : null
    }
}

export default usePaginatedCvs
