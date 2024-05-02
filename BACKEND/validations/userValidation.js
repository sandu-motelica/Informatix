import ApiError from "../exceptions/apiError.js";
import varToString from "../utils/varToString.js";
export const userRegisterValidation = (username, email, password,role) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))  errors.push({
        value:email,
        param:varToString({email}),
        msg:"Invalid value"
    });
    if(username.length < 3 && username.length > 20) errors.push({
        value:username,
        param:varToString({username}),
        msg:"Invalid value (min 3 characters, max 20 characters)"
    });
    if(password.length < 5) errors.push({
        value:password,
        param:varToString({password}),
        msg:"Password is too weak"
    });

    if(role != 'admin' && role!='teacher' && role!='student') errors.push({
        value:role,
        param:varToString({role}),
        msg:"Invalid role"
    });

    if(errors.length) throw ApiError.BadRequest("Bad request",errors);
}