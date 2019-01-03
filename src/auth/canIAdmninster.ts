import { Router, Request, Response, NextFunction } from "express";
import { RequestHandlerParams } from "express-serve-static-core";

export default function canIAdminister(myRoles: string[], authorisedRoles: string[], checkAll = false): boolean {
  
    var authorisedMatches = 0;

    myRoles.forEach(myRole =>{
        authorisedRoles.forEach(authorisedRole => {
            if(myRole === authorisedRole)
            {
                authorisedMatches++;
            }
        });
    });
  
    if (checkAll) {
        return authorisedMatches === authorisedRoles.length;
    } else {
        return authorisedMatches > 0;
    }
}
