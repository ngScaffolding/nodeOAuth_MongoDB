import { Router, Request, Response, NextFunction } from "express";
import { RequestHandlerParams } from "express-serve-static-core";

export default function canIAdminister(myRoles: string[], authorisedRoles: string[]): boolean {
  
    myRoles.forEach(myRole =>{
        authorisedRoles.forEach(authorisedRole => {
            if(myRole === authorisedRole)
            {
                return true;
            }
        });
    });
  
    return false; 
}
