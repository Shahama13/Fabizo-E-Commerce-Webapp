import axios from "axios"
import { allProductFailure, allProductRequest, allProductSuccess, productDetailsFailure, productDetailsRequest, productDetailsSuccess } from "../Reducers/product"

export const getProduct = (keyword="",currentPage=1,price=[0,5000],category) => async (dispatch) => {
    try {
        dispatch(allProductRequest())
        let link =`/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}`
        if(category){
            link= `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}`
        }

        const { data } = await axios(link)
        dispatch(allProductSuccess({
            // productCount: data.productCount,
            products: data.products,
            resultPerPage:data.resultPerPage,
            filteredProductCount:data.filteredProductCount,
        }))
    } catch (error) {
        dispatch(allProductFailure({
            error: error.response.data.message
        }))
    }
}

export const getProductDetails=(id)=>async(dispatch)=>{
try {
    dispatch(productDetailsRequest())
    const {data}= await axios.get(`/api/v1/product/${id}`)
    dispatch(productDetailsSuccess({
        product:data.product
    }))
} catch (error) {
    dispatch(productDetailsFailure({
        error:error.response.data.message
    }))
}
}