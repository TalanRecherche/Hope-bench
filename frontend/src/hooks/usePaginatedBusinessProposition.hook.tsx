import {ReactNode, useContext, useEffect, useState} from "react";
import {ApiContext} from "../contexts/ApiContext.tsx";
import {BusinessProposition, PageResult, SearchOptions} from "../model/models.ts";
import {useBoolean} from "usehooks-ts";
import {PaginationControl} from "react-bootstrap-pagination-control";

interface Result {
    loading: boolean
    businessPropositionPage: PageResult<BusinessProposition>
    changePage: (page?: number) => void
    paginator: ReactNode
}

const usePaginatedBusinessProposition = (selfSearch: boolean, userId?: string, search?: string, limitBusinessPropositionsToAllowedOnes?: boolean, selectedStatusToShow? : {[key: string]: boolean}): Result => {
    const {value: loading, setTrue: setLoading, setFalse: setLoaded} = useBoolean(true)
    const [businessPropositionPage, _setBusinessPropositionPage] = useState<PageResult<BusinessPropositionData>>({
        page: 0, pageSize: 0, totalElements: 0, elements: []
    })
    const {listBusinessPropositions} = useContext(ApiContext)
        
    const setBusinessPropositionPage = (p: PageResult<BusinessPropositionData>) => {
        _setBusinessPropositionPage(p)
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
        listBusinessPropositions(options).then(setBusinessPropositionPage).then(setLoaded);
    }

    const initialSearchParams: SearchOptions = {limitToAllowedBusinessProposition: limitBusinessPropositionToAllowedOnes == undefined ? true : limitBusinessPropositionToAllowedOnes,
        searchString: search == undefined ? "" : search, userId: userId == undefined ? "" : userId, selfSearch: selfSearch}

    const [searchParams, setSearchParams] = useState<SearchOptions>(initialSearchParams)

    const changePage = (page?: number) => {
        setSearchParams({...searchParams, page: page})
        searchPage({...searchParams, page: page})
    }

    useEffect(() => {
        var status = convertSelectedStatusToInt()
        setSearchParams({...searchParams, searchString: search, limitToAllowedBusinessProposition: limitBusinessPropositionToAllowedOnes, statusToCheck: status})
        searchPage({...searchParams, searchString: search, limitToAllowedBusinessProposition: limitBusinessPropositionToAllowedOnes, statusToCheck: status});
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
