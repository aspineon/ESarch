import {
  FETCH_COMPANY_LIST_REQUEST,
  FETCH_COMPANY_LIST_SUCCESS,
  FETCH_COMPANY_LIST_FAILURE,
  FETCH_ORDERBOOKS_BY_COMPANYID_REQUEST,
  FETCH_ORDERBOOKS_BY_COMPANYID_SUCCESS,
  FETCH_ORDERBOOKS_BY_COMPANYID_FAILURE,
  FETCH_EXECUTED_TRADES_REQUEST,
  FETCH_EXECUTED_TRADES_SUCCESS,
  FETCH_EXECUTED_TRADES_FAILURE,
  PLACE_BUY_ORDER_REQUEST,
  PLACE_BUY_ORDER_SUCCESS,
  PLACE_BUY_ORDER_FAILURE,
  PLACE_SELL_ORDER_REQUEST,
  PLACE_SELL_ORDER_SUCCESS,
  PLACE_SELL_ORDER_FAILURE,
  SET_ACTIVE_COMPANY
} from '../constants/companyActions';
import { status, json } from '../utils/fetch';

const API_ROOT = process.env.REACT_APP_API_ROOT;

const fetchCompanyListRequest = () => (
  {
    type: FETCH_COMPANY_LIST_REQUEST,
    payload: {
      isFetching: true
    }
  }
)

const fetchCompanyListSuccess = data => (
  {
    type: FETCH_COMPANY_LIST_SUCCESS,
    payload: {
      isFetching: false,
      data
    }
  }
)

const fetchCompanyListFailure = error => (
  {
    type: FETCH_COMPANY_LIST_FAILURE,
    payload: {
      isFetching: false,
      error
    }
  }
)

export const fetchCompanyList = () =>
  (dispatch) => {
    dispatch(fetchCompanyListRequest());
    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    };
  
    return fetch(`${API_ROOT}/query/company`, options)
    .then(status)
    .then(json)
    .then((data) => {
      // got a successfull response from the server
      dispatch(fetchCompanyListSuccess(data));
    })
    .catch((error) => {
      // bad response
      console.log("Get Company List Failure", error);
      dispatch(fetchCompanyListFailure(error));
    });  
}

export const setActiveCompany = (id) => 
  (dispatch, getState) => {
    const state = getState();
    const index = state.companies.companyList.items.findIndex(element => {
      if(element.identifier ===id) {
        return true;
      }
      return false;
    })
    dispatch({
      type: SET_ACTIVE_COMPANY,
      payload: {
        index
      }})
  }

const fetchOrderBooksByCompanyIdRequest = () => (
  {
    type: FETCH_ORDERBOOKS_BY_COMPANYID_REQUEST
  }
)

const fetchOrderBooksByCompanyIdSuccess = data => (
  {
    type: FETCH_ORDERBOOKS_BY_COMPANYID_SUCCESS,
    payload: {
      isFetching: false,
      data
    }
  }
)
const fetchOrderBooksByCompanyIdFailure = error => (
  {
    type: FETCH_ORDERBOOKS_BY_COMPANYID_FAILURE,
    payload: {
      isFetching: false,
      error
    }
  }
)

const fetchExecutedTradesRequest = () => {
  return {
    type: FETCH_EXECUTED_TRADES_REQUEST
  }
}

const fetchExecutedTradesSuccess = (data) => {
  return {
    type: FETCH_EXECUTED_TRADES_SUCCESS,
    payload: {
      data
    }
  }
}

const fetchExecutedTradesFailure = (error) => {
  return {
    type: FETCH_EXECUTED_TRADES_FAILURE,
    payload: {
      error
    }
  }
}

const placeBuyOrderRequest = () => {
  return {
    type: PLACE_BUY_ORDER_REQUEST
  }
}

const placeBuyOrderSuccess = (transactionId) => {
  return {
    type: PLACE_BUY_ORDER_SUCCESS,
    payload: {
      transactionId
    }
  }
}

const placeBuyOrderFailure = (error) => {
  return {
    type: PLACE_BUY_ORDER_FAILURE,
    payload: {
      error
    }
  }
}

const placeSellOrderRequest = () => {
  return {
    type: PLACE_SELL_ORDER_REQUEST
  }
}

const placeSellOrderSuccess = (transactionId) => {
  return {
    type: PLACE_SELL_ORDER_SUCCESS,
    payload: {
      transactionId
    }
  }
}

const placeSellOrderFailure = (error) => {
  return {
    type: PLACE_SELL_ORDER_FAILURE,
    payload: {
      error
    }
  }
}

export const fetchOrderBooksByCompanyId = (id) =>
  (dispatch) => {
    dispatch(fetchOrderBooksByCompanyIdRequest());
    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
    };
  
    return fetch(`${API_ROOT}/query/order-book/by-company/${id}`, options)
    .then(status)
    .then(json)
    .then((data) => {
      // got a successfull response from the server
      dispatch(fetchOrderBooksByCompanyIdSuccess(data));
    })
    .catch((error) => {
      // bad response
      console.log("Get order book by company failure:", error);
      dispatch(fetchOrderBooksByCompanyIdFailure(error));
    });  
  }

export const fetchExecutedTradesByOrderBookId = (id) => {
  return (dispatch) => {
    dispatch(fetchExecutedTradesRequest());
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return fetch(`${API_ROOT}/query/executed-trades/${id}`, options)
      .then(status)
      .then(json)
      .then(data => {
        dispatch(fetchExecutedTradesSuccess(data))
      })
      .catch(error => {
        console.log('Get executed trades by order book failure: ', error);
        dispatch(fetchExecutedTradesFailure(error))
      })
  }
}

export const placeBuyOrder = (orderBookId, portfolioId, price, amount) => {
  return (dispatch) => {
    dispatch(placeBuyOrderRequest());

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderBookId,
        portfolioId,
        tradeCount: amount,
        pricePerItem: price
      })
    };

    return fetch(`${API_ROOT}/command/StartBuyTransactionCommand`, options)
      .then(status)
      .then(json)
      .then(transactionId => {
        console.log('place buy order success: ' + transactionId)
        dispatch(placeBuyOrderSuccess(transactionId))
      })
      .catch(error => {
        console.log('place buy order error', JSON.stringify(error, null, 4))
        dispatch(placeBuyOrderFailure(error))
      })
  }
}

export const placeSellOrder = (orderBookId, portfolioId, price, amount) => {
  return (dispatch) => {
    dispatch(placeSellOrderRequest());

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderBookId,
        portfolioId,
        tradeCount: amount,
        pricePerItem: price
      })
    };

    return fetch(`${API_ROOT}/command/StartSellTransactionCommand`, options)
      .then(status)
      .then(json)
      .then(transactionId => {
        console.log('place sell order success: ' + transactionId)
        dispatch(placeSellOrderSuccess(transactionId))
      })
      .catch(error => {
        console.log('place sell order error', JSON.stringify(error, null, 4))
        dispatch(placeSellOrderFailure(error))
      })
  }
}
