// src/utils/asyncHandler.js using promises


const asyncHandler = (requesHandler) => {
    (req, res, next) => {
        Promise.resolve(requesHandler(req, res, next)).catch((err) => next(err));
    }
}


export {  asyncHandler };

/*const asyncHandler = () => {}
const asyncHandler = (func) => () => {}
const asyncHandler = (func) => async () => {} */

//try catch wrapper for async functions


/*const asyncHandler = (fn) => async (re,res,next) => {
    try{
        await fn(re,res,next);
    } catch(error) {
        res.status(err.code || 500).json({
            success: false,
            message: error.message
        })
    }
}*/