const moment = require("moment");

module.exports = {
  showParamsErrorResponse: (message) => {
    var resData = {
      status: "failure",
      status_code: 200,
      error_code: 5001,
      error_description: "Missing Params or Params data type error!",
      message: message,
      data: {},
      error: {},
    };
    return resData;
  },
  showValidationErrorResponse: (message) => {
    var resData = {
      status: "failure",
      status_code: 200,
      error_code: 5002,
      error_description: "Validation Error!",
      message: (message),
      data: {},
      error: {},
    };
    return resData;
  },
  showFailureErrorResponse: (message) => {
    var resData = {
      status: "failure",
      status_code: 200,
      error_code: 50011,
      error_description: "Failure!",
      message: (message),
      data: {},
      error: {},
    };
    return resData;
  },

  showFailureErrorResponseNew: (message, data) => {
    var resData = {
      status: "failure",
      status_code: 200,
      error_code: 50011,
      error_description: "Failure!",
      message: (message),
      data: data,
      error: {},
    };
    return resData;
  },

  showInternalServerErrorResponse: (message, error) => {
    var resData = {
      status: "failure",
      status_code: 200,
      error_code: 5003,
      error_description: "Internal Coding error or Params Undefined!",
      message: message,
      data: {},
      error: error,
    };
    return resData;
  },

  showUnauthorizedErrorResponse: (message) => {
    var resData = {
      status: "failure",
      status_code: 200,
      error_code: 5004,
      error_description: "Invalid Login Credential!",
      message: (message),
      data: {},
      error: {},
    };
    return resData;
  },

  showDatabaseErrorResponse: (message, error) => {
    var resData = {
      status: "failure",
      status_code: 200,
      error_code: 5005,
      error_description: "Database error!",
      message: (message),
      data: {},
      error: error,
    };
    return resData;
  },

  showSuccessResponse: (message, data) => {
    var resData = {
      status: "success",
      status_code: 200,
      message: (message),
      data: data,
    };
    return resData;
  },

  showSuccessResponseWithUser: (message, data, user) => {
    var resData = {
      status: "success",
      status_code: 200,
      message: (message),
      data: data,
      user: user,
    };
    return resData;
  },

  showSuccessResponseCount: (message, data, count) => {
    var resData = {
      status: "success",
      status_code: 200,
      message: (message),
      data: data,
      totalcount: count,
    };
    return resData;
  },
  roundNumber: (num) => {
    return Math.round(num * 100) / 100;
  },


};
